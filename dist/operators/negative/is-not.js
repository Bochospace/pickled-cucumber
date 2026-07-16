import { recursiveMatch } from '../../util.js';
const op = {
    arity: 'binary',
    description: `checks that 'a' does not deep equal 'b'`,
    exec: (actual, expected) => {
        if (expected === 'null' && actual !== null)
            return undefined;
        const isUndef = expected === 'undefined';
        const expectedJson = isUndef ? undefined : JSON.parse(expected);
        const errorPath = recursiveMatch(actual, expectedJson);
        return errorPath !== undefined
            ? undefined
            : {
                assertEquals: true,
                error: 'is',
                expected: expectedJson,
                path: errorPath,
            };
    },
    name: "isn't",
};
export default op;
//# sourceMappingURL=is-not.js.map