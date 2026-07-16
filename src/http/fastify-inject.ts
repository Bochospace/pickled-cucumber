import { mapRequest } from './common.js';
import { Headers, HttpFn, Options, Response } from './types.js';

// Structural subset of a light-my-request response (what Fastify's `inject`
// resolves to). Kept local so the adapter does not depend on `fastify` or
// `light-my-request` being installed.
interface InjectResponse {
  headers: Record<string, string | string[] | number | undefined>;
  payload: string;
  statusCode: number;
}

interface Injectable {
  inject: (opts: {
    headers?: Headers;
    method: string;
    payload?: string;
    url: string;
  }) => Promise<InjectResponse>;
}

// The app is usually built lazily (e.g. in a `BeforeAll` hook), so a getter is
// accepted in addition to a ready instance.
type AppOrGetter = Injectable | (() => Injectable);

const resolveApp = (app: AppOrGetter): Injectable =>
  typeof app === 'function' ? app() : app;

const flattenHeaders = (headers: InjectResponse['headers']): Headers =>
  Object.keys(headers).reduce((acc, k) => {
    const value = headers[k];
    if (typeof value === 'string') acc[k] = value;
    else if (Array.isArray(value)) acc[k] = value.join(', ');
    else if (typeof value === 'number') acc[k] = String(value);
    return acc;
  }, {} as Headers);

const wrap = (app: AppOrGetter, opts: Options = {}): HttpFn => async (
  originalReq,
) => {
  const req = await mapRequest(originalReq, opts);

  const injectRes = await resolveApp(app).inject({
    headers: req.headers,
    method: req.method,
    payload: req.body ? JSON.stringify(req.body) : undefined,
    url: req.path,
  });

  const res: Response = {
    headers: flattenHeaders(injectRes.headers),
    status: injectRes.statusCode,
    text: injectRes.payload,
  };

  return res;
};

export default wrap;
