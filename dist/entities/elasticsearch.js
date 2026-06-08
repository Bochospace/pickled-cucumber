"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineElasticSteps = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const util_1 = require("./util");
const request = async (method, path, body) => {
    const res = await (0, node_fetch_1.default)(path, {
        body: body !== undefined ? JSON.stringify(body) : undefined,
        headers: body ? { 'content-type': 'application/json' } : undefined,
        method,
    });
    if (!res.ok) {
        throw {
            body,
            error: await res.text(),
            method,
            path,
            status: res.status,
        };
    }
    return await res.json();
};
const create = (indexUri, indexMapping, idProperty, opts = {}) => {
    let indexExists = false;
    const ensureIndex = async () => {
        await request('GET', indexUri).catch(async () => {
            await request('PUT', `${indexUri}`, {
                mappings: indexMapping,
            });
        });
        indexExists = true;
    };
    // Refresh the index so that all operations performed since the last refresh
    // are available for search.
    // See https://www.elastic.co/guide/en/elasticsearch/reference/6.8/indices-refresh.html
    const refresh = () => request('POST', `${indexUri}/_refresh`);
    // eslint-disable-next-line @typescript-eslint/ban-types
    const search = async (criteria) => {
        // We need to call refresh here to account for the "subject under test" code
        // updating the index. When running our test-side queries we want to make
        // sure we are seeing the latest index to prevent race conditions. This can
        // be improved further if we detect that we just refreshed in the previous
        // step but that detection is proving difficult to implement consistently.
        await refresh();
        const docs = await request('POST', `${indexUri}/_search`, criteria);
        return docs.hits.hits;
    };
    // eslint-disable-next-line @typescript-eslint/ban-types
    const searchOne = async (criteria) => (await search(criteria))[0];
    const getSource = (doc) => doc && doc._source;
    const getSources = (docs) => docs.map((doc) => doc._source);
    const getById = (idOrObject) => searchOne({ query: { term: { _id: `${(0, util_1.getId)(idProperty, idOrObject)}` } } });
    const getRecordUri = (routing, record) => {
        const uri = routing ? `${indexUri}/${routing}` : indexUri;
        return `${uri}/_doc/${(0, util_1.getId)(idProperty, record)}`;
    };
    const entity = {
        create: async (attrs) => {
            if (!indexExists) {
                await ensureIndex();
            }
            const record = opts.onCreate
                ? await opts.onCreate(attrs)
                : attrs || {};
            const routing = opts.getRouting && opts.getRouting(record);
            await request('PUT', getRecordUri(routing, record), record);
            await refresh();
            return record;
        },
        delete: async (idOrObject) => {
            const doc = await getById(idOrObject);
            if (!doc)
                return;
            await request('DELETE', getRecordUri(doc._routing, doc._source));
            await refresh();
        },
        find: async (criteria) => getSources(await search(criteria)),
        findBy: async (criteria) => getSource(await searchOne(criteria)),
        findById: async (idOrObject) => getSource(await getById(idOrObject)),
        update: async (idOrObject, attrs) => {
            const id = (0, util_1.getId)(idProperty, idOrObject);
            const record = (await entity.findById(idOrObject)) || {};
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const recordWithAttrs = { ...record, ...attrs };
            const recordWithChanges = opts.onUpdate
                ? await opts.onUpdate(recordWithAttrs, id, entity)
                : recordWithAttrs;
            await entity.create(recordWithChanges);
            await refresh();
            return recordWithChanges;
        },
    };
    return entity;
};
exports.default = create;
const defineElasticSteps = (indexUri, { compare, getCtx, setCtx, Then, When }) => {
    When('searching for', async (payload) => {
        await request('POST', `${indexUri}/_refresh`);
        setCtx('$search-results', await request('POST', `${indexUri}/_search`, JSON.parse(payload)));
    }, { inline: true });
    Then('the search results {op}', async (op, payload) => compare(op, getCtx('$search-results'), payload), { inline: true });
};
exports.defineElasticSteps = defineElasticSteps;
//# sourceMappingURL=elasticsearch.js.map