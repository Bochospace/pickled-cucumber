import { getDeep } from './util.js';
let ctx = {};
export const setCtx = (c) => (ctx = c);
export const getCtx = () => ctx;
export const getCtxItem = (key) => getDeep(ctx, key);
export const setCtxItem = (key, value) => {
    ctx[key] = value;
};
export const pushCtxItem = (key, value) => {
    const items = getCtxItem(key) || [];
    items.push(value);
    setCtxItem(key, items);
};
//# sourceMappingURL=context.js.map