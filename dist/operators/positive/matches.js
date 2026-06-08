"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../util");
const op = {
    arity: 'binary',
    description: `checks that the string representation of 'a' matches regex 'b'`,
    exec: (actual, expected) => {
        const expectedRexExp = (0, util_1.stringToRegexp)(expected);
        return (0, util_1.getString)(actual).match(expectedRexExp)
            ? undefined
            : { error: 'does not match', expected: `${expectedRexExp}` };
    },
    name: 'matches',
};
exports.default = op;
//# sourceMappingURL=matches.js.map