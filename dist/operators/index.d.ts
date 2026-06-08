import { OperatorMap } from './types';
declare const OPERATORS: OperatorMap;
export default OPERATORS;
export declare const opAtSpec = "[\\w.\\[\\]\\$\\{\\}/\\\\\"-]+";
export declare const getOpSpec: (ops?: OperatorMap) => RegExp;
