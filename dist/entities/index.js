"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const assert = __importStar(require("assert"));
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
exports.default = setup;
//# sourceMappingURL=index.js.map