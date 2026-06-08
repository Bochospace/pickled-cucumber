import { SetupFnArgs } from '../types';
import { HttpFn } from './types';
declare const setup: (httpFn: HttpFn, { compare, getCtx, Given, setCtx, Then, When }: SetupFnArgs) => void;
export default setup;
