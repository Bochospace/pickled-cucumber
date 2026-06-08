"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../util");
const op = {
    arity: 'binary',
    description: `checks that 'a' deep equals 'b'`,
    exec: (actual, expected) => {
        if (expected === 'null' && actual === null)
            return undefined;
        const isUndef = expected === 'undefined';
        const expectedJson = isUndef ? undefined : JSON.parse(expected);
        const errorPath = (0, util_1.recursiveMatch)(actual, expectedJson);
        return errorPath === undefined
            ? undefined
            : {
                assertEquals: true,
                error: 'is not',
                expected: expectedJson,
                path: errorPath,
            };
    },
    name: 'is',
};
exports.default = op;
//# sourceMappingURL=is.js.map