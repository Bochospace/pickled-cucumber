"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const json5_1 = __importDefault(require("json5"));
const aliases_1 = __importDefault(require("../aliases"));
const util_1 = require("../util");
const PARSER_MAP = {
    json: json5_1.default.parse,
};
const getDeepString = (ctx, path) => {
    const v = (0, util_1.getDeep)(ctx, path);
    return typeof v === 'string' ? v : JSON.stringify(v);
};
// For each key `var` in `ctx`, replaces all occurrences of `${var}` in `str`
// with `ctx[var]` .
const expand = (ctx) => (str) => str &&
    str
        .toString()
        .replace(/\$\{([^}]+)\}/g, (_, path) => getDeepString(ctx, path));
const replaceAll = (s, find, replace) => s.split(find).join(replace);
// Resolve shorthand expressions into actual regexps
const resolveRegExp = (aliases, regexpString) => Object.keys(aliases).reduce((acc, k) => replaceAll(acc, `{${k}}`, `(${aliases[k].source})`), regexpString);
// Creates a proxy of fn that calls `expand` on every argument
const proxyFnFor = (getCtx, fn, argCount, parserFn) => {
    // this will convert the variadic args to a fixed-length function
    // which is used internally to run the actual step definition
    const proxyFn = (...args) => {
        // reverse the args list handle the `payload` arg
        const ex = expand(getCtx());
        const [errorFn, ...fnArgs] = args.reverse();
        const [tail, ...head] = fnArgs.map(ex);
        const parse = parserFn ? parserFn : (x) => x;
        const proxyArgs = [...head.reverse(), parse(tail), errorFn];
        return fn.call(null, ...proxyArgs.slice(0, argCount));
    };
    // we are using this internally to differenciate the function kind
    // this makes the 'proxyFn' mimic a N-args function just fine
    Object.defineProperty(proxyFn, 'length', { get: () => argCount });
    return proxyFn;
};
// Generates a cucumber step, with some additional features:
//
// - the `regexp` string is transformed to replace some shorthand expressions
//   (e.g. `{int}` => `\d+`, etc) and to add boundary anchors (`^$`).
//
// - every step argument is passed through `expand` to replace variable
//   expansion expressions (e.g. `${varName}`) with the corresponding value in
//   the test context (obtained through a call to `getCtx()`).
//
// - setting `opt.inline` to `true`, will generate two versions of the step, one
//   that takes the last argument inline, and one that takes it as a docstring
//   (i.e. in the next line, surrounded by `"""`).
//
// - setting `opt.optional to `true` or a string, will generate an additional
//   version of the step that does not include the last argument. Also, when
//   `optional` is a string, that string is appended to all other version of
//    this step. Note that setting `optional` implies `inline`
//
// - setting `opt.parser` will automatically add a payload parser before sending
//   the payload to your step definition handler; currently 'json' is available
exports.default = (aliases, getCtx) => (kind, regexpString, fn, opt = {}) => {
    // Generate a proxy of fn that calls `expand` on every argument
    const proxyFn = proxyFnFor(getCtx, fn, fn.length, opt.parser ? PARSER_MAP[opt.parser] : undefined);
    const allAliases = { ...aliases_1.default, ...aliases };
    const rawRegExp = resolveRegExp(allAliases, regexpString);
    const suffix = opt.optional && opt.optional !== true ? ` ${opt.optional}` : '';
    const steps = [];
    if (opt.optional) {
        // Generate a step without suffix or last argument
        const proxyFnWithoutLastArg = proxyFnFor(getCtx, fn, fn.length - 1 - (suffix.match(/(\([^)]*\))/g) || []).length);
        steps.push({
            fn: proxyFnWithoutLastArg,
            kind,
            name: regexpString,
            regexp: new RegExp(`^${rawRegExp}$`),
        });
    }
    if (suffix || !opt.optional) {
        // Generate the normal step
        steps.push({
            fn: proxyFn,
            kind,
            name: `${regexpString}${suffix}`,
            regexp: new RegExp(`^${rawRegExp}${suffix}$`),
        });
    }
    if (opt.inline || opt.optional) {
        // Generate a step the accepts the last argument inline
        steps.push({
            fn: proxyFn,
            kind,
            name: `${regexpString}${suffix} (.+)`,
            regexp: new RegExp(`^${rawRegExp}${suffix} (.+)$`),
        });
    }
    return steps;
};
//# sourceMappingURL=constructor.js.map