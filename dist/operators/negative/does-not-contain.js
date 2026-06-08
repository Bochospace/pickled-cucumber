"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../util");
const op = {
    arity: 'binary',
    description: `checks that the string representation of 'a' does not contain 'b'`,
    exec: (actual, expected) => {
        const expectedString = `${JSON.parse(expected)}`;
        return (0, util_1.getString)(actual).indexOf(expectedString) === -1
            ? undefined
            : { error: 'contains', expected: expectedString };
    },
    name: ['do not contain', 'does not contain'],
};
exports.default = op;
//# sourceMappingURL=does-not-contain.js.map