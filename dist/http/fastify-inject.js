import { mapRequest } from './common.js';
const resolveApp = (app) => typeof app === 'function' ? app() : app;
const flattenHeaders = (headers) => Object.keys(headers).reduce((acc, k) => {
    const value = headers[k];
    if (typeof value === 'string')
        acc[k] = value;
    else if (Array.isArray(value))
        acc[k] = value.join(', ');
    else if (typeof value === 'number')
        acc[k] = String(value);
    return acc;
}, {});
const wrap = (app, opts = {}) => async (originalReq) => {
    const req = await mapRequest(originalReq, opts);
    const injectRes = await resolveApp(app).inject({
        headers: req.headers,
        method: req.method,
        payload: req.body ? JSON.stringify(req.body) : undefined,
        url: req.path,
    });
    const res = {
        headers: flattenHeaders(injectRes.headers),
        status: injectRes.statusCode,
        text: injectRes.payload,
    };
    return res;
};
export default wrap;
//# sourceMappingURL=fastify-inject.js.map