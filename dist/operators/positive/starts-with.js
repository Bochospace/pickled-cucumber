import { getString } from '../../util.js';
const op = {
    arity: 'binary',
    description: `checks that the string representation of 'a' starts with 'b'`,
    exec: (actual, expected) => {
        const expectedString = getString(JSON.parse(expected));
        return getString(actual).indexOf(expectedString) === 0
            ? undefined
            : { error: 'does not start with', expected: expectedString };
    },
    name: 'starts with',
};
export default op;
//# sourceMappingURL=starts-with.js.map