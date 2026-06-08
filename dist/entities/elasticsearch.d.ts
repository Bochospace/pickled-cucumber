import { SetupFnArgs } from '../types';
import { Entity, EntityOptions } from './types';
interface Options<T, Tid extends keyof T> extends EntityOptions<T, Tid> {
    getRouting?: (record: T) => string | undefined;
    verbose?: true;
}
declare const create: <T, Tid extends keyof T>(indexUri: string, indexMapping: {
    properties: Record<string, unknown>;
}, idProperty: Tid, opts?: Options<T, Tid>) => Entity<T, Tid>;
export default create;
export declare const defineElasticSteps: (indexUri: string, { compare, getCtx, setCtx, Then, When }: SetupFnArgs) => void;
