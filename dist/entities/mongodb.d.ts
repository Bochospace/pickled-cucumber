import { Entity, EntityOptions } from './types';
type Criteria<T, Tid extends keyof T> = {
    [id: string]: T[Tid];
} | Partial<T>;
type FindCursor<T> = {
    toArray(): Promise<T[]>;
};
interface Changes<T> {
    $push?: {
        [k in keyof T]?: T[k][];
    };
    $set?: Partial<T>;
    $unset?: {
        [k in keyof T]?: 1;
    };
}
type Void = Promise<void>;
interface MongoClient {
    collection: <T, Tid extends keyof T>(s: string) => Promise<{
        deleteOne: (criteria: Criteria<T, Tid>) => Void;
        insertOne: (o: T) => Void;
        findOne: (criteria: Criteria<T, Tid>) => Promise<T | null>;
        find: (criteria: Criteria<T, Tid>) => FindCursor<T>;
        updateOne: (Criteria: Criteria<T, Tid>, changes: Changes<T>) => Void;
    }>;
}
interface Options<T, Tid extends keyof T> extends EntityOptions<T, Tid> {
    onUpdateChanges?: (changes: Changes<T>) => Changes<T>;
}
declare const create: <T, Tid extends keyof T>(getDb: () => Promise<MongoClient>, collectionName: string, idProperty: Tid, opts?: Options<T, Tid>) => Entity<T, Tid>;
export default create;
