import { getString, stringToRegexp } from '../../util.js';
const op = {
    arity: 'binary',
    description: `checks that the string representation of 'a' matches regex 'b'`,
    exec: (actual, expected) => {
        const expectedRexExp = stringToRegexp(expected);
        return getString(actual).match(expectedRexExp)
            ? undefined
            : { error: 'does not match', expected: `${expectedRexExp}` };
    },
    name: 'matches',
};
export default op;
//# sourceMappingURL=matches.js.map