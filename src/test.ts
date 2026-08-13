import { AfterAll } from '@cucumber/cucumber';
import assert from 'assert';
import execa from 'execa';
import fs from 'fs';
import nodeFetch from 'node-fetch';
import path from 'path';
import compareJson from './compare-json.js';
import createElasticEntity from './entities/elasticsearch.js';
import createMemoryEntity from './entities/memory.js';
import createMongoEntity from './entities/mongodb.js';
import { EntityMap } from './entities/types.js';
import httpFastifyInject from './http/fastify-inject.js';
import httpFetch from './http/fetch.js';
import httpSupertest from './http/supertest.js';
import setup, { getVariables, Options, SetupFn } from './index.js';
import { createIncludes } from './operators/positive/includes.js';
import { CompareError, OperatorMap } from './operators/types.js';
const { mkdtemp, rm, writeFile } = fs.promises;

let initialTen = 10;
const ELASTIC_URI = process.env.ELASTIC_URI
  ? `${process.env.ELASTIC_URI}/test-index`
  : undefined;

// === Test `entities` ====================================================== //
const entities: EntityMap = {};

interface Box {
  id: number;
  color: string;
}
let boxId = 0;
entities['box'] = createMemoryEntity<Box, 'id'>('id', () => (boxId += 1));

// === Test `entities/mongo` ================================================ //
if (process.env.MONGO_URI) {
  // eslint-disable-next-line
  let client: any;
  let connected = false;

  const getDb = async () => {
    if (client) return client.db();

    // `mongodb` is an optional peer dependency installed without `--save`, so
    // it is referenced through an indirect specifier to keep the compiler from
    // requiring its types at build time.
    const mongoPkg = 'mongodb';
    // eslint-disable-next-line
    const mongo = await import(mongoPkg);
    const conn = new mongo.MongoClient(process.env.MONGO_URI as string);
    client = await conn.connect();

    connected = true;
    return client.db();
  };
  AfterAll(async () => {
    if (connected) (await client).close();
  });

  entities['user'] = createMongoEntity(getDb, 'test-users', 'id', {
    onCreate: (attrs) => ({ id: Date.now(), ...attrs, created: Date.now() }),
    onUpdate: (attrs) => ({ ...attrs, updated: Date.now() }),
  });
}

// === Test `entities/elasticsearch` ======================================== //
if (ELASTIC_URI) {
  const indexMapping = {
    properties: {
      id: { type: 'long' },
      action: { type: 'text' },
      color: { type: 'text' },
      created: { type: 'long' },
      updated: { type: 'long' },
    },
  };
  entities['search'] = createElasticEntity(ELASTIC_URI, indexMapping, 'id', {
    onCreate: (attrs) => ({ id: Date.now(), ...attrs, created: Date.now() }),
    onUpdate: (attrs) => ({ ...attrs, updated: Date.now() }),
  });
}

// === Test custom `operators` ============================================== //
// Named so no other operator prefixes it: `{op}` compiles to a regexp
// alternation followed by the payload, so `includes strictly` would match as
// `includes` with a payload of `strictly …`.
const OPERATORS: OperatorMap = {
  'strictly includes': createIncludes({ absentSatisfiesNull: false }),
};

// ========================================================================== //
const options: Options = {
  aliases: {
    '/api/*': /\/api\/.*/,
    'proper-name': /[A-Z][a-z]*/,
  },
  elasticSearchIndexUri: ELASTIC_URI,
  entities,
  http: httpFetch(nodeFetch),
  initialContext: () => ({
    deeply: {
      nested: {
        string: 'hello!',
      },
    },
    initialFive: 5,
  }),
  operators: OPERATORS,
  usage: true,
};

const fn: SetupFn = ({ getCtx, Given, onTearDown, setCtx, Then, When }) => {
  // === Test `compareJson` and `aliases` =================================== //
  const getResult = () => getCtx<CompareError>('$result');

  Given('{word} is', (name, value) => setCtx(name, JSON.parse(value)), {
    inline: true,
  });

  // `Given {word} is` parses JSON, which cannot model a `Date` — the shape that
  // matters most for an expected `null`, since spreading a `Date` yields `{}`
  // just like spreading `null` does. Worded away from `{word} is …` because its
  // `inline` variant registers `^(\S+) is (.+)$` and would match ambiguously.
  Given('{word} holds the date {any}', (name, iso) =>
    setCtx(name, new Date(iso)),
  );
  Given('{word} holds under {word} the date {any}', (name, key, iso) =>
    setCtx(name, { [key]: new Date(iso) }),
  );

  When(
    'asserting that {word} {op}',
    (varName, op, expected) =>
      setCtx('$result', compareJson(OPERATORS, op, getCtx(varName), expected)),
    { inline: true },
  );

  Then('the assertion passes', () => assert.equal(getResult(), undefined));
  Then('the assertion fails with {any}', (expected) => {
    const r = getResult();
    assert(r, 'the assertion passed');
    assert.deepEqual(
      `${JSON.stringify(r.actual)} ${r.error}${
        !r.unary ? ` ${JSON.stringify(r.expected)}` : ''
      }`,
      expected,
    );
  });
  Then('the error path is {any}', (path) =>
    assert.equal(JSON.stringify(getResult().path), path),
  );
  Then(
    'the full actual value is',
    (actual) => assert.deepEqual(JSON.parse(actual), getResult().full),
    { inline: true },
  );
  Then(
    'the sub error is: got {any} instead of {any} at {any}',
    (actual, expected, path) => {
      const r = getResult();
      assert(r.subError, 'no subError found');
      if (r.subError) {
        assert.deepEqual(r.subError.actual, JSON.parse(actual));
        assert.deepEqual(r.subError.expected, JSON.parse(expected));
        assert.deepEqual(r.subError.path, JSON.parse(path));
      }
    },
  );
  Then('A proper name can be {proper-name}', (name) =>
    assert(!!name.match(/^[A-Z]/)),
  );
  Then('the {/api/*} alias matches (.*)', (actual, expected) =>
    assert.equal(actual, expected),
  );

  // === Test `initialContext` ============================================== //
  When('incrementing the value of {variable}', (name) =>
    setCtx(name, getCtx<number>(name) + 1),
  );
  Then('the value of {variable} is {int}', (name, val) =>
    assert.equal(getCtx<number>(name), parseInt(val, 10)),
  );

  // === Test `onTearDown` ================================================== //
  When('incrementing the value of the global initialTen', () => {
    initialTen += 1;
    onTearDown(() => {
      initialTen -= 1;
    });
  });
  Then('the value of the global initialTen is {int}', (val) =>
    assert.equal(initialTen, parseInt(val, 10)),
  );

  // === Test expansion ===================================================== //
  Then('variable {variable} has value (.*)', (name, val) =>
    assert.equal(getCtx(name), val),
  );

  // === Test parser ===================================================== //
  Then(
    'JSON representation of the payload is (.*)',
    (repr, payload) => assert.equal(repr, JSON.stringify(payload)),
    { parser: 'json' },
  );

  // === Test output ======================================================== //
  Given('step definition', (payload) => setCtx('steps-definition', payload));
  Given('feature file is', (payload) =>
    setCtx(`feature-file-content`, payload),
  );
  When('the suite is executed', async () => {
    const testDir = await mkdtemp(`output-test-`);
    const featureFile = path.join(testDir, 'test-feature.feature');
    const stepsFile = path.join(testDir, 'steps.ts');

    await writeFile(featureFile, getCtx('feature-file-content'));

    const testOptions: Options = {};

    // Assume they define fn
    const stepsContent = `
import setup, { SetupFn } from '../src/index.js';

${getCtx('steps-definition')}

setup(fn, {
  ...${JSON.stringify(testOptions)},
  initialContext: () => {
    console.log('logged-on-initial-context-stdout');
    console.error('logged-on-initial-context-stderr');
    return {};
  },
});
    `;

    await writeFile(stepsFile, stepsContent);

    await execa(
      './node_modules/.bin/cucumber-js',
      // cucumber-js 13 removed `--publish-quiet`; publishing is opt-in now, so
      // no banner-suppression flag is needed.
      ['--import', stepsFile, featureFile],
      {
        env: {
          NODE_OPTIONS: '--import tsx',
        },
      },
    );

    onTearDown(async () => {
      if (testDir) {
        await rm(testDir, { recursive: true });
      }
    });
  });
};

setup(fn, options);

// === Test `getVariables` ================================================== //
assert.deepEqual(getVariables('A'), ['A']);
assert.deepEqual(getVariables('A, B'), ['A', 'B']);
assert.deepEqual(getVariables('A and B'), ['A', 'B']);
assert.deepEqual(getVariables('A, B and C'), ['A', 'B', 'C']);

// === Test `http/fastify-inject` =========================================== //
// Exercised against a fake `inject`-able app so the request/response mapping is
// covered without pulling in `fastify`.
(async () => {
  const injected: unknown[] = [];
  const fakeApp = {
    inject: async (opts: unknown) => {
      injected.push(opts);
      return {
        headers: {
          'content-type': 'application/json',
          'set-cookie': ['a=1', 'b=2'],
          'x-count': 3,
        },
        payload: '{"ok":true}',
        statusCode: 201,
      };
    },
  };

  const httpFn = httpFastifyInject(() => fakeApp, {
    applyCredentials: (req) => ({
      ...req,
      headers: { ...req.headers, authorization: 'Bearer token' },
    }),
    baseUri: 'http://api',
  });

  const res = await httpFn({
    body: { name: 'box' },
    credentials: { id: 1 },
    method: 'POST',
    path: '/things',
  });

  assert.deepEqual(injected, [
    {
      headers: {
        authorization: 'Bearer token',
        'content-type': 'application/json; charset=utf-8',
      },
      method: 'POST',
      payload: '{"name":"box"}',
      url: 'http://api/things',
    },
  ]);
  assert.deepEqual(res, {
    headers: {
      'content-type': 'application/json',
      'set-cookie': 'a=1, b=2',
      'x-count': '3',
    },
    status: 201,
    text: '{"ok":true}',
  });
})().catch((err) => {
  throw err;
});

// === Pin down untested dependencies ======================================= //
assert(httpSupertest);
