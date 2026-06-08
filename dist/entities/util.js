"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getId = void 0;
const isId = (idOrObject) => typeof idOrObject !== 'object';
const getId = (idProperty, idOrObject) => (isId(idOrObject) ? idOrObject : idOrObject[idProperty]);
exports.getId = getId;
//# sourceMappingURL=util.js.map