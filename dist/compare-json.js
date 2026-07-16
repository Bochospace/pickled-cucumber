import DEFAULT_OPS, { opAtSpec } from './operators/index.js';
import { getDeep } from './util.js';
const atRegExp = new RegExp(`^at (${opAtSpec}) (.*)$`);
function compareJson(ops, opName, actual, expected) {
    const [atPath, atOp] = (atRegExp.exec(opName) || []).slice(1);
    const op = atOp || opName;
    const operator = ops[op] || DEFAULT_OPS[op];
    if (!operator)
        throw new Error(`Unknown operator: ${op}`);
    const actualValue = atPath ? getDeep(actual, atPath) : actual;
    const result = operator.exec(actualValue, expected);
    if (result === undefined)
        return undefined;
    const error = {
        ...result,
        actual: actualValue,
        op,
    };
    if (!atPath)
        return error;
    // `at` scoped operator
    return {
        ...error,
        full: actual,
        path: [atPath, result.path].filter((p) => !!p).join('.'),
    };
}
export default compareJson;
//# sourceMappingURL=compare-json.js.map