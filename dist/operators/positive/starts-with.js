"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../util");
const op = {
    arity: 'binary',
    description: `checks that the string representation of 'a' starts with 'b'`,
    exec: (actual, expected) => {
        const expectedString = `${JSON.parse(expected)}`;
        return (0, util_1.getString)(actual).indexOf(expectedString) === 0
            ? undefined
            : { error: 'does not start with', expected: expectedString };
    },
    name: 'starts with',
};
exports.default = op;
//# sourceMappingURL=starts-with.js.map