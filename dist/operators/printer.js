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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.printError = void 0;
const assert = __importStar(require("assert"));
const index_1 = __importDefault(require("./index"));
exports.default = (ops) => {
    const all = { ...index_1.default, ...ops };
    const items = Object.keys(all)
        .sort()
        .map((k) => {
        const op = all[k];
        return op.arity === 'unary'
            ? { prefix: `a ${k} any:`, suffix: op.description }
            : { prefix: `a ${k} b:`, suffix: op.description };
    });
    const maxPrefixLen = items
        .map((i) => i.prefix.length)
        .reduce((a, b) => Math.max(a, b), 0);
    return items
        .map((i) => `${i.prefix.padEnd(maxPrefixLen)} ${i.suffix}\n`)
        .join('');
};
const prettyJson = (o, p = '') => `${JSON.stringify(o, undefined, 2)}`.replace(/\n/g, `\n${p}`);
const assertValue = (v) => v === undefined ? 'undefined' : JSON.stringify(v);
const printValue = (o) => typeof o === 'object' ? JSON.stringify(o) : `${o}`;
const printError = ({ actual, assertEquals, error, expected, full, path, subError, unary, }) => {
    const errorPath = subError ? subError.path : path;
    const at = errorPath ? ` (at ${errorPath})` : '';
    const actualValue = subError ? subError.actual : actual;
    const expectedValue = subError ? subError.expected : expected;
    const padd = '    ';
    const fullActual = full || (subError && actual);
    const errorMessage = subError ? 'is not' : error;
    const message = `
  Error${at}:
    ${JSON.stringify(actualValue)} ${errorMessage}${!unary ? ` ${printValue(expectedValue)}` : ''}
  \n\n
  Actual${at}:
    ${prettyJson(actualValue, padd)}
  Expected:
    ${prettyJson(expectedValue, padd)}

  ${fullActual
        ? `
  Full actual object:
    ${prettyJson(fullActual, padd)}
  `
        : ''}
  `;
    if (assertEquals) {
        assert.equal(assertValue(actualValue), assertValue(expectedValue), message);
    }
    assert.fail(message);
};
exports.printError = printError;
//# sourceMappingURL=printer.js.map