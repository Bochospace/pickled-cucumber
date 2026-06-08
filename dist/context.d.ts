import { Context } from './types';
export declare const setCtx: (c: Context) => Context;
export declare const getCtx: () => Context;
export declare const getCtxItem: <T>(key: string) => T;
export declare const setCtxItem: <T>(key: string, value: T) => void;
export declare const pushCtxItem: <T>(key: string, value: T) => void;
