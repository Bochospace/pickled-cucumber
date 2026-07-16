import { IdOrObject } from './types.js';
export declare const getId: <T, Tid extends keyof T>(idProperty: Tid, idOrObject: IdOrObject<T, Tid>) => T[Tid];
