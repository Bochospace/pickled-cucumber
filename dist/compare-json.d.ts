import { CompareResult, OperatorMap } from './operators/types.js';
declare function compareJson(ops: OperatorMap, opName: string, actual: unknown, expected: string): CompareResult;
export default compareJson;
