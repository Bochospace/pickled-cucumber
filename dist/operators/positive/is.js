import { recursiveMatch } from '../../util.js';
const op = {
    arity: 'binary',
    description: `checks that 'a' deep equals 'b'`,
    exec: (actual, expected) => {
        const isUndef = expected === 'undefined';
        const expectedJson = isUndef ? undefined : JSON.parse(expected);
        const errorPath = recursiveMatch(actual, expectedJson);
        return errorPath === undefined
            ? undefined
            : {
                assertEquals: true,
                error: 'is not',
                expected: expectedJson,
                path: errorPath,
            };
    },
    name: 'is',
};
export default op;
//# sourceMappingURL=is.js.map