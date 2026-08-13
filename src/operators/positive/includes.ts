import { getDeep, recursiveMatch } from '../../util.js';
import { Operator } from '../types.js';

interface Offending {
  actual: unknown;
  path: string | undefined;
}

const isObject = (item: unknown): item is Record<string, unknown> =>
  typeof item === 'object' && !Array.isArray(item) && item !== null;

const recursiveIncludes = (
  actual: unknown,
  expectedPartial: unknown,
  absentSatisfiesNull: boolean,
  path?: string,
) => {
  const expected =
    isObject(actual) && isObject(expectedPartial)
      ? { ...actual, ...expectedPartial } // make a whole object from a partial
      : expectedPartial; // is a primitive or array

  return recursiveMatch(actual, expected, path, true, absentSatisfiesNull);
};

const NOT_IN_ARRAY = {};

const findOffendingItem = (
  actual: unknown,
  expected: unknown,
  absentSatisfiesNull: boolean,
): Offending => {
  if (!Array.isArray(actual)) {
    return {
      actual,
      path: recursiveIncludes(actual, expected, absentSatisfiesNull),
    };
  }

  const items = actual.map((a, i) => ({
    actual: a,
    path: recursiveIncludes(a, expected, absentSatisfiesNull, `${i}`),
  }));

  if (items.some((i) => !i.path)) {
    return { actual, path: undefined };
  }

  if (!items.length) {
    return { actual: NOT_IN_ARRAY, path: '0' };
  }

  return { actual: NOT_IN_ARRAY, path: items[0].path };
};

interface IncludesOptions {
  // if false, a `null` in the partial requires the key to be present in 'a',
  // rather than being satisfied by its absence
  absentSatisfiesNull?: boolean;
}

// A factory rather than a single operator so a consumer can register `includes`
// under its own absent-key policy without re-walking the tree itself.
export const createIncludes = ({
  absentSatisfiesNull = true,
}: IncludesOptions = {}): Operator => ({
  arity: 'binary',
  description: `checks that the array or object 'a' contains the partial 'b'${
    absentSatisfiesNull ? '' : `, requiring a null in 'b' to be present in 'a'`
  }`,
  exec: (actual, expected) => {
    const expectedJson = JSON.parse(expected);
    const offending = findOffendingItem(
      actual,
      expectedJson,
      absentSatisfiesNull,
    );

    if (offending.path === undefined) return undefined;

    return {
      assertEquals: true,
      error: 'does not include',
      expected: expectedJson,
      subError:
        offending.actual !== NOT_IN_ARRAY
          ? {
              actual: getDeep(offending.actual, offending.path),
              expected: getDeep(expectedJson, offending.path),
              path: offending.path,
            }
          : undefined,
    };
  },
  name: ['include', 'includes'],
});

export default createIncludes();
