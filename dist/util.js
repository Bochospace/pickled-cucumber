export const getString = (actual) => typeof actual === 'string'
    ? actual
    : actual === undefined || actual === null
        ? JSON.stringify('')
        : JSON.stringify(actual);
// Checks `a` and `b` and returns `undefined` if they match (i.e. they are
// deep equal) or the path where they differ.
export function recursiveMatch(a, b, path = '', partial = false, // if true, allow `a` to have more keys than `b`
absentSatisfiesNull = true) {
    // 1) Match if both values are identical references of equivalent primitives
    if (a === b)
        return undefined;
    // 2) Match `partial`
    if (partial) {
        // `b` does not constrain `a` (this key is not in `b`, but can be in `a`)
        if (b === undefined)
            return undefined;
        // JSON cannot model `undefined`, so if `b` constraints to `null`, we accept
        // `undefined` in `a`. Callers that assert presence opt out and fall through
        // to (3), where the differing `typeof` reports the path.
        if (a === undefined && b === null && absentSatisfiesNull)
            return undefined;
    }
    // 3) Fail if both values have different types
    if (typeof a !== typeof b)
        return path;
    // 3.5) Fail if exactly one side is `null`: `typeof null` is `'object'`, so a
    // `null` would otherwise reach the object branch and be compared as
    // `Object.keys({ ...a, ...b })` — empty for a `null`, a `Date` or a `{}`, so
    // the match succeeds vacuously; against a populated object it throws.
    if (a === null || b === null)
        return path;
    // 4) Handle arrays
    if (Array.isArray(a) || Array.isArray(b)) {
        // Fail if one is an array and the other is not, or when the arrays have
        // different sizes
        if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length)
            return path;
        // Recurse and return the first element that fails, if any
        return a
            .map((va, i) => recursiveMatch(va, b[i], path ? `${path}.${i}` : `${i}`, partial, absentSatisfiesNull))
            .find((path) => path !== undefined);
    }
    // 5) Fail if the values are not objects because, they are not arrays (2) and
    // are not identical (1).
    if (typeof a !== 'object')
        return path;
    // 6) Both values are objects, they should have the same keys and matching
    // values
    const aObject = a;
    const bObject = b;
    return Object.keys({ ...aObject, ...bObject })
        .map((k) => recursiveMatch(aObject[k], bObject[k], path ? `${path}.${k}` : k, partial, absentSatisfiesNull))
        .find((path) => path !== undefined);
}
const IDX_REGEX = /(.*)\[(\d+)\]$/;
// eslint-disable-next-line
const getProp = (o, prop) => {
    const [name, index] = (prop.match(IDX_REGEX) || []).slice(1);
    return name ? o[name][Number(index)] : index ? o[Number(index)] : o[prop];
};
const getPathSegments = (path) => (path.match(/"[^"]*"|[^.]+/g) || []).map((k) => k.replace(/^"(.*)"$/, '$1'));
export const getDeep = (o, path) => path === undefined
    ? undefined
    : getPathSegments(path).reduce((acc, k) => acc === undefined || acc === null ? undefined : getProp(acc, k), o);
// Both key operators must reject the same two shapes before filtering: a key
// list that is not an array (`.filter` throws on it), and an actual that cannot
// hold keys. `typeof null === 'object'`, and reading a string or a number as an
// empty object leaves `does not have keys` finding nothing missing, so it passes
// whatever the data is.
export const getKeyListError = (actual, keys) => !Array.isArray(keys)
    ? 'cannot be compared against a non-array key list'
    : actual === null || typeof actual !== 'object'
        ? 'is not an object'
        : undefined;
export const stringToRegexp = (str) => {
    const [flags] = (str.match(/\/([gimuy]+)$/) || []).slice(1);
    const expectedString = str
        .replace(/^\/(.*)\/[gimuy]*$/, '$1')
        .replace(/^"(.*)"$/, '$1');
    return new RegExp(expectedString, flags);
};
//# sourceMappingURL=util.js.map