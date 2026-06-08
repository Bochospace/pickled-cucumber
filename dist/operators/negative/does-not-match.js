"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../util");
const op = {
    arity: 'binary',
    description: `checks that the string representation of 'a' does not match regex 'b'`,
    exec: (actual, expected) => {
        const expectedRexExp = (0, util_1.stringToRegexp)(expected);
        return !(0, util_1.getString)(actual).match(expectedRexExp)
            ? undefined
            : { error: 'matches', expected: `${expectedRexExp}` };
    },
    name: 'does not match',
};
exports.default = op;
//# sourceMappingURL=does-not-match.js.map