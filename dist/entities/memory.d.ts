import { Entity } from './types';
declare const generate: <T, Tid extends keyof T>(idField: Tid, newId: () => T[Tid]) => Entity<T, Tid>;
export default generate;
