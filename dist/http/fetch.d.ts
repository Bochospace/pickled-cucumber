import fetch from 'node-fetch';
import { HttpFn, Options } from './types.js';
type FetchFn = typeof fetch;
declare const wrap: (fetchFn: FetchFn, opts?: Options) => HttpFn;
export default wrap;
