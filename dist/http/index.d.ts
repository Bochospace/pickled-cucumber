import { SetupFnArgs } from '../types.js';
import { HttpFn } from './types.js';
declare const setup: (httpFn: HttpFn, { compare, getCtx, Given, setCtx, Then, When }: SetupFnArgs) => void;
export default setup;
