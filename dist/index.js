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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVariables = void 0;
const cucumber_1 = require("@cucumber/cucumber");
const printer_1 = __importDefault(require("./aliases/printer"));
const compare_json_1 = __importDefault(require("./compare-json"));
const context_1 = require("./context");
const entities_1 = __importDefault(require("./entities"));
const elasticsearch_1 = require("./entities/elasticsearch");
const http_1 = __importDefault(require("./http"));
const misc_1 = __importDefault(require("./misc"));
const operators_1 = require("./operators");
const printer_2 = __importStar(require("./operators/printer"));
const constructor_1 = __importDefault(require("./steps/constructor"));
const printer_3 = __importDefault(require("./steps/printer"));
var aliases_1 = require("./aliases");
Object.defineProperty(exports, "getVariables", { enumerable: true, get: function () { return aliases_1.getVariables; } });
const setup = (fn, options = {}) => {
    // Force unhandleded promise rejections to fail (warning => error)
    process.on('unhandledRejection', (up) => {
        throw up;
    });
    // Tear down
    const { aliases = {}, elasticSearchIndexUri, entities = {}, http, operators = {}, timeout, usage, } = options;
    const getTearDown = () => (0, context_1.getCtxItem)('$tearDown');
    if (!process.env.KEEP_DATA) {
        (0, cucumber_1.After)(async () => {
            await Promise.all(getTearDown()
                .reverse()
                .map((fn) => fn()));
        });
    }
    (0, cucumber_1.setDefaultTimeout)(timeout || Number(process.env.TEST_TIMEOUT || '10') * 1000);
    (0, cucumber_1.Before)(($scenario) => {
        // Execute before initial context hook
        const customCtx = (options.initialContext && options.initialContext()) || {};
        (0, context_1.setCtx)({
            random: Date.now(),
            ...customCtx,
            $scenario,
            $tearDown: [],
        });
        // Execute after initial context hook
    });
    const entityNames = Object.keys(entities);
    const hasEntities = !!entityNames.length;
    const effectiveAliases = {
        ...aliases,
        op: (0, operators_1.getOpSpec)(operators),
    };
    if (hasEntities) {
        effectiveAliases['entity'] = new RegExp(entityNames.join('|'));
    }
    const createStep = (0, constructor_1.default)(effectiveAliases, context_1.getCtx);
    const steps = [];
    const step = (kind) => (...args) => {
        steps.push(...createStep(kind, ...args));
        return steps;
    };
    const args = {
        After: cucumber_1.After,
        AfterAll: cucumber_1.AfterAll,
        AfterStep: cucumber_1.AfterStep,
        Before: cucumber_1.Before,
        BeforeStep: cucumber_1.BeforeStep,
        BeforeAll: cucumber_1.BeforeAll,
        compare: (op, a, e) => {
            const error = (0, compare_json_1.default)(operators, op, a, e);
            if (error !== undefined)
                (0, printer_2.printError)(error);
        },
        getCtx: context_1.getCtxItem,
        Given: step('Given'),
        onTearDown: (fn) => getTearDown().push(fn),
        pushCtx: context_1.pushCtxItem,
        setCtx: context_1.setCtxItem,
        Then: step('Then'),
        When: step('When'),
    };
    (0, misc_1.default)(args);
    if (hasEntities)
        (0, entities_1.default)(entities, args);
    if (elasticSearchIndexUri)
        (0, elasticsearch_1.defineElasticSteps)(elasticSearchIndexUri, args);
    if (http)
        (0, http_1.default)(http, args);
    fn(args);
    if (usage) {
        console.log('Step reference');
        console.log('--------------');
        console.log((0, printer_3.default)(steps));
        console.log();
        console.log('Operators');
        console.log('---------');
        console.log((0, printer_2.default)(operators));
        console.log();
        console.log('Aliases');
        console.log('-------');
        console.log((0, printer_1.default)(effectiveAliases));
        console.log();
        console.log('Variables');
        console.log('---------');
        console.log(`
    \${varName}          => expands to the value bound to varName
    \${varName.propName} => expands to the propName property of varName
    \${varName[0].name}  => expands to the name of the first item of varName
    `.replace(/^\s+/gm, ''));
    }
    steps.forEach((s) => {
        switch (s.kind) {
            case 'Given':
                return (0, cucumber_1.Given)(s.regexp, s.fn);
            case 'Then':
                return (0, cucumber_1.Then)(s.regexp, s.fn);
            case 'When':
                return (0, cucumber_1.When)(s.regexp, s.fn);
        }
    });
    return steps;
};
exports.default = setup;
//# sourceMappingURL=index.js.map