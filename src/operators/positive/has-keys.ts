import { getKeyListError } from '../../util.js';
import { Operator } from '../types.js';

const op: Operator = {
  arity: 'binary',
  description: `checks that the object 'a' has all the keys in array 'b'`,
  exec: (actual, expected) => {
    const expectedKeys: string[] = JSON.parse(expected);
    const keyListError = getKeyListError(actual, expectedKeys);

    if (keyListError !== undefined)
      return { error: keyListError, expected: expectedKeys };

    const actualObject = actual as Record<string, unknown>;
    const missing = expectedKeys.filter(
      (k) => !Object.prototype.hasOwnProperty.call(actualObject, k),
    );
    const error =
      missing.length === 1 ? 'does not have key' : 'does not have keys';
    return !missing.length ? undefined : { error, expected: missing };
  },
  name: 'has keys',
};

export default op;
