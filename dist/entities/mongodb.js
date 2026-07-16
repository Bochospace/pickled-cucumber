import { getId } from './util.js';
const create = (getDb, collectionName, idProperty, opts = {}) => {
    const entity = {
        create: async (attrs) => {
            const db = await getDb();
            const collection = await db.collection(collectionName);
            const record = opts.onCreate
                ? await opts.onCreate(attrs)
                : attrs || {};
            await collection.insertOne(record);
            return record;
        },
        delete: async (idOrObject) => {
            const db = await getDb();
            const collection = await db.collection(collectionName);
            return collection.deleteOne({
                [idProperty]: getId(idProperty, idOrObject),
            });
        },
        findBy: async (criteria) => {
            if (!criteria || typeof criteria !== 'object') {
                throw new Error('MongoEntity::findBy: criteria must be an object');
            }
            const db = await getDb();
            const collection = await db.collection(collectionName);
            return collection.findOne(criteria);
        },
        find: async (criteria) => {
            if (!criteria || typeof criteria !== 'object') {
                throw new Error('MongoEntity::find: criteria must be an object');
            }
            const db = await getDb();
            const collection = await db.collection(collectionName);
            return collection.find(criteria).toArray();
        },
        findById: (idOrObject) => entity.findBy({
            [idProperty]: getId(idProperty, idOrObject),
        }),
        update: async (idOrObject, attrs) => {
            const db = await getDb();
            const collection = await db.collection(collectionName);
            const id = getId(idProperty, idOrObject);
            const record = opts.onUpdate
                ? await opts.onUpdate(attrs, id, entity)
                : attrs;
            const recordChanges = { $set: record };
            const changes = opts.onUpdateChanges
                ? opts.onUpdateChanges(recordChanges)
                : recordChanges;
            const criteria = { [idProperty]: id };
            await collection.updateOne(criteria, changes);
            return (await entity.findBy(criteria));
        },
    };
    return entity;
};
export default create;
//# sourceMappingURL=mongodb.js.map