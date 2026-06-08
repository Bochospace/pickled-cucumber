"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const op = {
    arity: 'unary',
    description: `checks that 'a' is truthy`,
    exec: (actual) => actual ? { error: 'is not falsey', unary: true } : undefined,
    name: ['does not exist', 'do not exist'],
};
exports.default = op;
//# sourceMappingURL=does-not-exist.js.map