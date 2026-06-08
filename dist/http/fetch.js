"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
const wrap = (fetchFn, opts = {}) => async (originalReq) => {
    const req = await (0, common_1.mapRequest)(originalReq, opts);
    const fetchRes = await fetchFn(req.path, {
        body: req.body ? JSON.stringify(req.body) : undefined,
        headers: req.headers,
        method: req.method,
    });
    const fetchHeaders = fetchRes.headers.raw();
    const res = {
        headers: Object.keys(fetchHeaders).reduce((acc, k) => {
            acc[k] = fetchHeaders[k] && fetchHeaders[k][0];
            return acc;
        }, {}),
        status: fetchRes.status,
        text: await fetchRes.text(),
    };
    return res;
};
exports.default = wrap;
//# sourceMappingURL=fetch.js.map