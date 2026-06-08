import { CompareError, OperatorMap } from './types';
declare const _default: (ops: OperatorMap) => string;
export default _default;
export declare const printError: ({ actual, assertEquals, error, expected, full, path, subError, unary, }: CompareError) => string;
