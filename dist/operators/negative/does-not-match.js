import { getString, stringToRegexp } from '../../util.js';
const op = {
    arity: 'binary',
    description: `checks that the string representation of 'a' does not match regex 'b'`,
    exec: (actual, expected) => {
        const expectedRexExp = stringToRegexp(expected);
        return !getString(actual).match(expectedRexExp)
            ? undefined
            : { error: 'matches', expected: `${expectedRexExp}` };
    },
    name: 'does not match',
};
export default op;
//# sourceMappingURL=does-not-match.js.map