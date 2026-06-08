"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOpSpec = exports.opAtSpec = void 0;
const does_not_contain_1 = __importDefault(require("./negative/does-not-contain"));
const does_not_exist_1 = __importDefault(require("./negative/does-not-exist"));
const does_not_have_keys_1 = __importDefault(require("./negative/does-not-have-keys"));
const does_not_match_1 = __importDefault(require("./negative/does-not-match"));
const is_not_1 = __importDefault(require("./negative/is-not"));
const approximates_1 = __importDefault(require("./positive/approximates"));
const contains_1 = __importDefault(require("./positive/contains"));
const exists_1 = __importDefault(require("./positive/exists"));
const has_keys_1 = __importDefault(require("./positive/has-keys"));
const includes_1 = __importDefault(require("./positive/includes"));
const is_1 = __importDefault(require("./positive/is"));
const matches_1 = __importDefault(require("./positive/matches"));
const starts_with_1 = __importDefault(require("./positive/starts-with"));
const OPERATORS = [
    contains_1.default,
    does_not_contain_1.default,
    does_not_exist_1.default,
    does_not_have_keys_1.default,
    does_not_match_1.default,
    exists_1.default,
    has_keys_1.default,
    includes_1.default,
    is_1.default,
    is_not_1.default,
    matches_1.default,
    starts_with_1.default,
    approximates_1.default,
].reduce((acc, op) => {
    if (typeof op.name === 'string')
        acc[op.name] = op;
    else
        op.name.forEach((name) => (acc[name] = op));
    return acc;
}, {});
exports.default = OPERATORS;
exports.opAtSpec = '[\\w.\\[\\]\\$\\{\\}/\\\\"-]+';
const getOpSpec = (ops = {}) => {
    const keys = Object.keys({ ...ops, ...OPERATORS })
        .sort()
        .join('|');
    return new RegExp(`${keys}|at ${exports.opAtSpec} (?:${keys})`);
};
exports.getOpSpec = getOpSpec;
//# sourceMappingURL=index.js.map