"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../util");
const op = {
    arity: 'binary',
    description: `checks that the string representation of 'a' contains 'b'`,
    exec: (actual, expected) => {
        const expectedString = `${JSON.parse(expected)}`;
        return (0, util_1.getString)(actual).indexOf(expectedString) !== -1
            ? undefined
            : { error: 'does not contain', expected: expectedString };
    },
    name: ['contain', 'contains'],
};
exports.default = op;
//# sourceMappingURL=contains.js.map