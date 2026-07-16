const kindOrder = {
    Given: 1,
    Then: 3,
    When: 2,
};
const orderSteps = (a, b) => a.kind === b.kind
    ? a.name <= b.name
        ? -1
        : 1
    : kindOrder[a.kind] <= kindOrder[b.kind]
        ? -1
        : 1;
export default (steps) => [...steps]
    .sort(orderSteps)
    .map((s) => `${s.kind} ${s.name}\n`)
    .join('');
//# sourceMappingURL=printer.js.map