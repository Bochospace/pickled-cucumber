const isId = (idOrObject) => typeof idOrObject !== 'object';
export const getId = (idProperty, idOrObject) => (isId(idOrObject) ? idOrObject : idOrObject[idProperty]);
//# sourceMappingURL=util.js.map