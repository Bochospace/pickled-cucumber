import * as assert from 'assert';
const setup = (entities, { compare, getCtx, Given, onTearDown, setCtx, Then }) => {
    if (!Object.keys(entities).length)
        return;
    Given('an? {entity}(?: {variable})?', async (entity, varName, payload) => {
        const record = await entities[entity].create(payload && JSON.parse(payload));
        setCtx(varName, record);
        if (!process.env.KEEP_DATA) {
            onTearDown(() => entities[entity].delete(record));
        }
    }, { optional: 'with' });
    Given('{entity} {variable} also has', async (entity, varName, payload) => {
        const record = getCtx(varName);
        const changes = JSON.parse(payload);
        const changedRecord = await entities[entity].update(record, changes);
        setCtx(varName, changedRecord);
    }, { inline: true });
    Then('the document for {entity} {variable} {op}', async (entity, varName, op, payload) => {
        const doc = await entities[entity].findById(getCtx(varName));
        compare(op, doc, payload);
        setCtx('$last-doc', doc);
    }, { inline: true });
    Then('the document for the {entity} with (\\{.*\\}) {op}', async (entity, query, op, payload) => {
        const doc = await entities[entity].findBy(JSON.parse(query));
        compare(op, doc, payload);
        setCtx('$last-doc', doc);
    }, { inline: true });
    Then('the documents for the {entity} with (\\{.*\\}) {op}', async (entity, query, op, payload) => {
        const docs = await entities[entity].find(JSON.parse(query));
        compare(op, docs, payload);
    }, { inline: true });
    Then('that document {op}', (op, payload) => compare(op, getCtx('$last-doc'), payload), { inline: true });
    Then('the {entity} {variable} was deleted', async (entity, varName) => assert.equal(await entities[entity].findById(getCtx(varName)), null));
    Then('store the document for the {entity} with (\\{.*\\}) in {variable}', async (entity, query, varName) => {
        const doc = await entities[entity].findBy(JSON.parse(query));
        setCtx(varName, doc);
    });
    Then('store the document for {entity} {variable} in {variable}', async (entity, varName, targetVar) => {
        const doc = await entities[entity].findById(getCtx(varName));
        setCtx(targetVar, doc);
    });
};
export default setup;
//# sourceMappingURL=index.js.map