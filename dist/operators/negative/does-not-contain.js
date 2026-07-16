import { getString } from '../../util.js';
const op = {
    arity: 'binary',
    description: `checks that the string representation of 'a' does not contain 'b'`,
    exec: (actual, expected) => {
        const expectedString = `${JSON.parse(expected)}`;
        return getString(actual).indexOf(expectedString) === -1
            ? undefined
            : { error: 'contains', expected: expectedString };
    },
    name: ['do not contain', 'does not contain'],
};
export default op;
//# sourceMappingURL=does-not-contain.js.map