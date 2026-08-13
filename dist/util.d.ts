export declare const getString: (actual: unknown) => string;
export declare function recursiveMatch(a: unknown, b: unknown, path?: string, partial?: boolean, // if true, allow `a` to have more keys than `b`
absentSatisfiesNull?: boolean): string | undefined;
export declare const getDeep: (o: unknown, path: string) => unknown | undefined;
export declare const getKeyListError: (actual: unknown, keys: unknown) => string | undefined;
export declare const stringToRegexp: (str: string) => RegExp;
