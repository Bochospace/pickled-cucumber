"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const setup = ({ compare, getCtx, Given, setCtx, Then }) => {
    Given('variable {variable} is', (id, payload) => setCtx(id, payload), {
        inline: true,
    });
    Given('variable {variable} results from expanding {variable} with', (target, source, replaces) => {
        const items = JSON.parse(replaces);
        const expanded = Object.keys(items).reduce((acc, k) => acc.replace(new RegExp(k, 'g'), items[k]), getCtx(source));
        setCtx(target, expanded);
    }, { inline: true });
    Then('the variable {variable} {op}', (varName, op, payload) => {
        compare(op, getCtx(varName), payload);
    }, { inline: true });
};
exports.default = setup;
//# sourceMappingURL=index.js.map