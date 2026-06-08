"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../util");
const isObject = (item) => typeof item === 'object' && !Array.isArray(item) && item !== null;
const recursiveIncludes = (actual, expectedPartial, path) => {
    const expected = isObject(actual) && isObject(expectedPartial)
        ? { ...actual, ...expectedPartial } // make a whole object from a partial
        : expectedPartial; // is a primitive or array
    return (0, util_1.recursiveMatch)(actual, expected, path, true);
};
const NOT_IN_ARRAY = {};
const findOffendingItem = (actual, expected) => {
    if (!Array.isArray(actual)) {
        return { actual, path: recursiveIncludes(actual, expected) };
    }
    const items = actual.map((a, i) => ({
        actual: a,
        path: recursiveIncludes(a, expected, `${i}`),
    }));
    if (items.some((i) => !i.path)) {
        return { actual, path: undefined };
    }
    if (!items.length) {
        return { actual: NOT_IN_ARRAY, path: '0' };
    }
    return { actual: NOT_IN_ARRAY, path: items[0].path };
};
const op = {
    arity: 'binary',
    description: `checks that the array or object 'a' contains the partial 'b'`,
    exec: (actual, expected) => {
        const expectedJson = JSON.parse(expected);
        const offending = findOffendingItem(actual, expectedJson);
        if (offending.path === undefined)
            return undefined;
        return {
            assertEquals: true,
            error: 'does not include',
            expected: expectedJson,
            subError: offending.actual !== NOT_IN_ARRAY
                ? {
                    actual: (0, util_1.getDeep)(offending.actual, offending.path),
                    expected: (0, util_1.getDeep)(expectedJson, offending.path),
                    path: offending.path,
                }
                : undefined,
        };
    },
    name: ['include', 'includes'],
};
exports.default = op;
//# sourceMappingURL=includes.js.map