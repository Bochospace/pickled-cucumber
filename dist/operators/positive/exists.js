const op = {
    arity: 'unary',
    description: `checks that 'a' is truthy`,
    exec: (actual) => actual ? undefined : { error: 'is not truthy', unary: true },
    name: 'exists',
};
export default op;
//# sourceMappingURL=exists.js.map