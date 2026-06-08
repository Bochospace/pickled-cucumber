"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushCtxItem = exports.setCtxItem = exports.getCtxItem = exports.getCtx = exports.setCtx = void 0;
const util_1 = require("./util");
let ctx = {};
const setCtx = (c) => (ctx = c);
exports.setCtx = setCtx;
const getCtx = () => ctx;
exports.getCtx = getCtx;
const getCtxItem = (key) => (0, util_1.getDeep)(ctx, key);
exports.getCtxItem = getCtxItem;
const setCtxItem = (key, value) => {
    ctx[key] = value;
};
exports.setCtxItem = setCtxItem;
const pushCtxItem = (key, value) => {
    const items = (0, exports.getCtxItem)(key) || [];
    items.push(value);
    (0, exports.setCtxItem)(key, items);
};
exports.pushCtxItem = pushCtxItem;
//# sourceMappingURL=context.js.map