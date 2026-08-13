import { getString } from '../../util.js';
import { Operator } from '../types.js';

const op: Operator = {
  arity: 'binary',
  description: `checks that the string representation of 'a' contains 'b'`,
  exec: (actual, expected) => {
    const expectedString = getString(JSON.parse(expected));
    return getString(actual).indexOf(expectedString) !== -1
      ? undefined
      : { error: 'does not contain', expected: expectedString };
  },
  name: ['contain', 'contains'],
};

export default op;
