import { Aliases, Context } from '../types.js';
import { Step, StepFn, StepKind, StepOptions } from './types.js';
declare const _default: (aliases: Aliases, getCtx: () => Context) => (kind: StepKind, regexpString: string, fn: StepFn, opt?: StepOptions) => Step[];
export default _default;
