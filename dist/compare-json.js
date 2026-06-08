"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const operators_1 = __importStar(require("./operators"));
const util_1 = require("./util");
const atRegExp = new RegExp(`^at (${operators_1.opAtSpec}) (.*)$`);
function compareJson(ops, opName, actual, expected) {
    const [atPath, atOp] = (atRegExp.exec(opName) || []).slice(1);
    const op = atOp || opName;
    const operator = ops[op] || operators_1.default[op];
    if (!operator)
        throw new Error(`Unknown operator: ${op}`);
    const actualValue = atPath ? (0, util_1.getDeep)(actual, atPath) : actual;
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
exports.default = compareJson;
//# sourceMappingURL=compare-json.js.map