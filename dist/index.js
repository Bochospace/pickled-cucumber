import { After, AfterAll, AfterStep, Before, BeforeAll, BeforeStep, Given, setDefaultTimeout, Then, When, } from '@cucumber/cucumber';
import printAliases from './aliases/printer.js';
import compareJson from './compare-json.js';
import { getCtx, getCtxItem, pushCtxItem, setCtx, setCtxItem, } from './context.js';
import { defineElasticSteps } from './entities/elasticsearch.js';
import setupEntities from './entities/index.js';
import setupHttp from './http/index.js';
import setupMisc from './misc/index.js';
import { getOpSpec } from './operators/index.js';
import printOperators, { printError } from './operators/printer.js';
import stepCtor from './steps/constructor.js';
import printSteps from './steps/printer.js';
export { getVariables } from './aliases/index.js';
const setup = (fn, options = {}) => {
    // Force unhandleded promise rejections to fail (warning => error)
    process.on('unhandledRejection', (up) => {
        throw up;
    });
    // Tear down
    const { aliases = {}, elasticSearchIndexUri, entities = {}, http, operators = {}, timeout, usage, } = options;
    const getTearDown = () => getCtxItem('$tearDown');
    if (!process.env.KEEP_DATA) {
        After(async () => {
            await Promise.all(getTearDown()
                .reverse()
                .map((fn) => fn()));
        });
    }
    setDefaultTimeout(timeout || Number(process.env.TEST_TIMEOUT || '10') * 1000);
    Before(($scenario) => {
        // Execute before initial context hook
        const customCtx = (options.initialContext && options.initialContext()) || {};
        setCtx({
            random: Date.now(),
            ...customCtx,
            $scenario,
            $tearDown: [],
        });
        // Execute after initial context hook
    });
    const entityNames = Object.keys(entities);
    const hasEntities = !!entityNames.length;
    const effectiveAliases = {
        ...aliases,
        op: getOpSpec(operators),
    };
    if (hasEntities) {
        effectiveAliases['entity'] = new RegExp(entityNames.join('|'));
    }
    const createStep = stepCtor(effectiveAliases, getCtx);
    const steps = [];
    const step = (kind) => (...args) => {
        steps.push(...createStep(kind, ...args));
        return steps;
    };
    const args = {
        After,
        AfterAll,
        AfterStep,
        Before,
        BeforeStep,
        BeforeAll,
        compare: (op, a, e) => {
            const error = compareJson(operators, op, a, e);
            if (error !== undefined)
                printError(error);
        },
        getCtx: getCtxItem,
        Given: step('Given'),
        onTearDown: (fn) => getTearDown().push(fn),
        pushCtx: pushCtxItem,
        setCtx: setCtxItem,
        Then: step('Then'),
        When: step('When'),
    };
    setupMisc(args);
    if (hasEntities)
        setupEntities(entities, args);
    if (elasticSearchIndexUri)
        defineElasticSteps(elasticSearchIndexUri, args);
    if (http)
        setupHttp(http, args);
    fn(args);
    if (usage) {
        console.log('Step reference');
        console.log('--------------');
        console.log(printSteps(steps));
        console.log();
        console.log('Operators');
        console.log('---------');
        console.log(printOperators(operators));
        console.log();
        console.log('Aliases');
        console.log('-------');
        console.log(printAliases(effectiveAliases));
        console.log();
        console.log('Variables');
        console.log('---------');
        console.log(`
    \${varName}          => expands to the value bound to varName
    \${varName.propName} => expands to the propName property of varName
    \${varName[0].name}  => expands to the name of the first item of varName
    `.replace(/^\s+/gm, ''));
    }
    steps.forEach((s) => {
        switch (s.kind) {
            case 'Given':
                return Given(s.regexp, s.fn);
            case 'Then':
                return Then(s.regexp, s.fn);
            case 'When':
                return When(s.regexp, s.fn);
        }
    });
    return steps;
};
export default setup;
//# sourceMappingURL=index.js.map