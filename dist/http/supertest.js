"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const common_1 = require("./common");
const binaryParser = (res, callback) => {
    res.setEncoding('binary');
    let text = '';
    res.on('data', (chunk) => {
        text += chunk;
    });
    res.on('end', () => callback(null, text));
};
const applyHeaders = (headers, req) => Object.keys(headers)
    .reduce((acc, k) => (headers[k] ? acc.set(k, headers[k]) : acc), req)
    .buffer(true)
    .parse(binaryParser);
const wrap = (superTest, opts = {}) => async (originalReq) => {
    const req = await (0, common_1.mapRequest)(originalReq, opts);
    const k = req.method.toLowerCase();
    const reqMethod = superTest[k](req.path);
    const reqPayload = req.body ? reqMethod.send(req.body) : reqMethod;
    const reqObject = req.headers
        ? applyHeaders(req.headers, reqPayload)
        : reqPayload;
    const resObject = await (0, util_1.promisify)(reqObject.end.bind(reqObject))();
    const res = {
        headers: resObject.headers,
        status: resObject.statusCode,
        text: resObject.body,
    };
    return res;
};
exports.default = wrap;
//# sourceMappingURL=supertest.js.map