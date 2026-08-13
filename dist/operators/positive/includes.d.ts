import { Operator } from '../types.js';
interface IncludesOptions {
    absentSatisfiesNull?: boolean;
}
export declare const createIncludes: ({ absentSatisfiesNull, }?: IncludesOptions) => Operator;
declare const _default: Operator;
export default _default;
