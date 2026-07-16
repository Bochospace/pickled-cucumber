import opDoesNotContain from './negative/does-not-contain.js';
import opDoesNotExist from './negative/does-not-exist.js';
import opDoesNotHaveKeys from './negative/does-not-have-keys.js';
import opDoesNotMatch from './negative/does-not-match.js';
import opIsNot from './negative/is-not.js';
import opApproximates from './positive/approximates.js';
import opContains from './positive/contains.js';
import opExists from './positive/exists.js';
import opHasKeys from './positive/has-keys.js';
import opIncludes from './positive/includes.js';
import opIs from './positive/is.js';
import opMatches from './positive/matches.js';
import opStartsWith from './positive/starts-with.js';
import { OperatorMap } from './types.js';

const OPERATORS = [
  opContains,
  opDoesNotContain,
  opDoesNotExist,
  opDoesNotHaveKeys,
  opDoesNotMatch,
  opExists,
  opHasKeys,
  opIncludes,
  opIs,
  opIsNot,
  opMatches,
  opStartsWith,
  opApproximates,
].reduce<OperatorMap>((acc, op) => {
  if (typeof op.name === 'string') acc[op.name] = op;
  else op.name.forEach((name) => (acc[name] = op));
  return acc;
}, {});

export default OPERATORS;

export const opAtSpec = '[\\w.\\[\\]\\$\\{\\}/\\\\"-]+';

export const getOpSpec = (ops: OperatorMap = {}): RegExp => {
  const keys = Object.keys({ ...ops, ...OPERATORS })
    .sort()
    .join('|');
  return new RegExp(`${keys}|at ${opAtSpec} (?:${keys})`);
};
