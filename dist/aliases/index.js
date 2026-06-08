"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVariables = void 0;
const aliases = {
    any: /.*/,
    boolean: /true|false/,
    int: /\d+/,
    variable: /[\w._-]+/,
    variables: /[\w._-]+(?:,\s*[\w._-]+|\s+and\s+[\w._-]+)*/,
    word: /\S+/,
};
const getVariables = (s) => s.split(/,\s*|\s+and\s+/);
exports.getVariables = getVariables;
exports.default = aliases;
//# sourceMappingURL=index.js.map