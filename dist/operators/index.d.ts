import { OperatorMap } from './types.js';
declare const OPERATORS: OperatorMap;
export default OPERATORS;
export declare const opAtSpec = "[\\w.\\[\\]\\$\\{\\}/\\\\\"-]+";
export declare const getOpSpec: (ops?: OperatorMap) => RegExp;
