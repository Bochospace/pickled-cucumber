"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const assert = __importStar(require("assert"));
const http_1 = require("http");
const url_1 = require("url");
const util_1 = require("../util");
const setup = (httpFn, { compare, getCtx, Given, setCtx, Then, When }) => {
    const getHeaders = () => getCtx('$req-headers');
    const getResponse = () => getCtx('$res');
    const getResponseBody = (raw) => raw ? getResponse().text : JSON.parse(getResponse().text || '{}');
    Given('the request header {word} is "{any}"', (name, value) => {
        const headers = getHeaders() || {};
        headers[name] = value;
        setCtx('$req-headers', headers);
    });
    When('(GET|POST|PUT|PATCH|DELETE|OPTIONS) {word}(?: as {variable})?', async (method, path, varName, payload) => {
        const credentials = varName && getCtx(varName);
        const req = {
            body: payload ? JSON.parse(payload) : undefined,
            credentials,
            headers: getHeaders(),
            method: method,
            path,
        };
        const res = await httpFn(req);
        setCtx('$req', req);
        setCtx('$res', res);
    }, { optional: 'with payload' });
    const withStatusCode = (status) => `${status} (${http_1.STATUS_CODES[status] || 'Unknown'})`;
    const assertStatus = (status) => {
        const res = getResponse();
        assert.equal(withStatusCode(res.status), withStatusCode(Number(status)), `
      Unexpected API response:
      ${res.status}
      ${res.text}
      `);
    };
    const assertPayload = (raw, op, payload) => compare(op, getResponseBody(raw), payload);
    Then('the response is {int}', (status) => assertStatus(Number(status)));
    Then('the( raw)? response payload {op}', (raw, op, payload) => assertPayload(!!raw, op, payload), { inline: true });
    Then('the response text {op}', (op, payload) => compare(op, getResponse().text, payload), { inline: true });
    Then('the response headers {op}', (op, payload) => compare(op, getResponse().headers, payload), { inline: true });
    Then('the response is {int} and the( raw)? payload {op}', (status, raw, op, payload) => {
        assertStatus(Number(status));
        assertPayload(!!raw, op, payload);
    }, { inline: true });
    Then('store the( raw)? response payload in {variable}', (raw, id) => setCtx(id, getResponseBody(!!raw)));
    Then('store the response payload at ([\\w_.-]+) in {variable}', (path, id) => setCtx(id, (0, util_1.getDeep)(getResponseBody(false), path)));
    Then('extract the response location query string argument (.+) into {variable}', (arg, id) => setCtx(id, new url_1.URL(getResponse().headers.location).searchParams.get(arg)));
};
exports.default = setup;
//# sourceMappingURL=index.js.map