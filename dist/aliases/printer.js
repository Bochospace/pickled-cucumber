"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
exports.default = (aliases) => {
    const all = { ...index_1.default, ...aliases };
    const items = Object.keys(all)
        .sort()
        .map((k) => ({ expr: all[k].source, key: `{${k}}:` }));
    const maxKeyLen = items
        .map((i) => i.key.length)
        .reduce((a, b) => Math.max(a, b), 0);
    return items.map((i) => `${i.key.padEnd(maxKeyLen)} ${i.expr}\n`).join('');
};
//# sourceMappingURL=printer.js.map