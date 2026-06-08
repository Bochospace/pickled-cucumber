import fetch from 'node-fetch';
import { HttpFn, Options } from './types';
type FetchFn = typeof fetch;
declare const wrap: (fetchFn: FetchFn, opts?: Options) => HttpFn;
export default wrap;
