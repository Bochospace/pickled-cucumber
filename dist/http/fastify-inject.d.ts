import { Headers, HttpFn, Options } from './types.js';
interface InjectResponse {
    headers: Record<string, string | string[] | number | undefined>;
    payload: string;
    statusCode: number;
}
interface Injectable {
    inject: (opts: {
        headers?: Headers;
        method: string;
        payload?: string;
        url: string;
    }) => Promise<InjectResponse>;
}
type AppOrGetter = Injectable | (() => Injectable);
declare const wrap: (app: AppOrGetter, opts?: Options) => HttpFn;
export default wrap;
