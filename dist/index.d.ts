import { Step } from './steps/types';
import { Options as BaseOptions, SetupFnArgs } from './types';
export { getVariables } from './aliases';
export type Options = BaseOptions;
export type SetupFn = (args: SetupFnArgs) => void;
declare const setup: (fn: SetupFn, options?: Options) => Step[];
export default setup;
