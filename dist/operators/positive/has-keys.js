import { getKeyListError } from '../../util.js';
const op = {
    arity: 'binary',
    description: `checks that the object 'a' has all the keys in array 'b'`,
    exec: (actual, expected) => {
        const expectedKeys = JSON.parse(expected);
        const keyListError = getKeyListError(actual, expectedKeys);
        if (keyListError !== undefined)
            return { error: keyListError, expected: expectedKeys };
        const actualObject = actual;
        const missing = expectedKeys.filter((k) => !Object.prototype.hasOwnProperty.call(actualObject, k));
        const error = missing.length === 1 ? 'does not have key' : 'does not have keys';
        return !missing.length ? undefined : { error, expected: missing };
    },
    name: 'has keys',
};
export default op;
//# sourceMappingURL=has-keys.js.map