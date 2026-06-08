"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generate = (idField, newId) => {
    const entities = [];
    const isObj = (v) => typeof v === 'object' &&
        v !== null &&
        idField in v;
    const entityMethods = {
        create: async (record) => {
            const e = { ...record, [idField]: newId() };
            entities.push(e);
            return e;
        },
        delete: async (id) => {
            const entity = await entityMethods.findById(id);
            if (!entity)
                return;
            entities.splice(entities.findIndex((e) => e === entity, 1));
        },
        // eslint-disable-next-line @typescript-eslint/ban-types
        find: async (record) => {
            const entries = Object.entries(record);
            return entities.filter((e) => entries.every((pair) => e[pair[0]] === pair[1]) ||
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (idField in record && e[idField] === record[idField]));
        },
        // eslint-disable-next-line @typescript-eslint/ban-types
        findBy: async (record) => {
            const entries = Object.entries(record);
            return entities.find((e) => entries.every((pair) => e[pair[0]] === pair[1]) ||
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (idField in record && e[idField] === record[idField]));
        },
        findById: async (record) => {
            const id = isObj(record) ? record[idField] : record;
            return entityMethods.findBy({ [idField]: id });
        },
        update: async (record, update) => {
            const entity = await entityMethods.findById(record);
            if (entity === null || entity === undefined) {
                throw new Error('Trying to update inexistent record');
            }
            return Object.assign(entity, update);
        },
    };
    return entityMethods;
};
exports.default = generate;
//# sourceMappingURL=memory.js.map