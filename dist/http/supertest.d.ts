import { Headers, HttpFn, Options } from './types.js';
interface SuperTestResponse {
    headers: Headers;
    on: (e: 'data' | 'end', f: (chunk: string) => void) => void;
    setEncoding: (e: 'binary') => void;
    statusCode: number;
    body: string;
}
type ParseFn = (res: SuperTestResponse, cb: (error: unknown, text: string) => void) => void;
interface SuperTestRequest {
    send: (payload: unknown) => SuperTestRequest;
    set: (headerName: string, headerValue: string) => SuperTestRequest;
    buffer: (b: true) => SuperTestRequest;
    parse: (fn: ParseFn) => SuperTestRequest;
    end: (cb: (err: Error | null, res: SuperTestResponse) => void) => void;
}
type SuperTestFn = (path: string) => SuperTestRequest;
type SuperTest = {
    delete: SuperTestFn;
    get: SuperTestFn;
    patch: SuperTestFn;
    post: SuperTestFn;
    put: SuperTestFn;
};
declare const wrap: (superTest: SuperTest, opts?: Options) => HttpFn;
export default wrap;
