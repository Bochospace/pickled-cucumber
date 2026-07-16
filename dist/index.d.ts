import { Step } from './steps/types.js';
import { Options as BaseOptions, SetupFnArgs } from './types.js';
export { getVariables } from './aliases/index.js';
export type Options = BaseOptions;
export type SetupFn = (args: SetupFnArgs) => void;
declare const setup: (fn: SetupFn, options?: Options) => Step[];
export default setup;
