"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const op = {
    arity: 'unary',
    description: `checks that 'a' is truthy`,
    exec: (actual) => actual ? undefined : { error: 'is not truthy', unary: true },
    name: 'exists',
};
exports.default = op;
//# sourceMappingURL=exists.js.map