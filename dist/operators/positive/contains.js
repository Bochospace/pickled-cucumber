import { getString } from '../../util.js';
const op = {
    arity: 'binary',
    description: `checks that the string representation of 'a' contains 'b'`,
    exec: (actual, expected) => {
        const expectedString = `${JSON.parse(expected)}`;
        return getString(actual).indexOf(expectedString) !== -1
            ? undefined
            : { error: 'does not contain', expected: expectedString };
    },
    name: ['contain', 'contains'],
};
export default op;
//# sourceMappingURL=contains.js.map