import {ApiError, Middleware} from '@qdrant/openapi-typescript-fetch';
import {FetchFn} from './types.js';

/**
 * bigint-aware JSON reviver, mirrored from `@qdrant/openapi-typescript-fetch`'s
 * internal `fetcher.ts`. We re-implement the response parsing in our own
 * terminal middleware (see `createTransport`), so we must keep the same
 * large-integer handling: integers that don't fit into a safe JS number are
 * parsed from their raw source text into a `bigint`. Only active on runtimes
 * that support the JSON source-text access proposal (`JSON.rawJSON`).
 */
type JsonReviver = (this: unknown, key: string, value: unknown) => unknown;

const bigintReviver: JsonReviver | undefined =
    'rawJSON' in JSON
        ? function (_key, val, context?: {source: string}) {
              if (typeof val === 'number' && Number.isInteger(val) && !Number.isSafeInteger(val) && context) {
                  try {
                      return BigInt(context.source);
                  } catch {
                      return val;
                  }
              }
              return val;
          }
        : undefined;

/** Parse a `fetch` Response body the same way `@qdrant/openapi-typescript-fetch` does. */
async function getResponseData(response: Response): Promise<unknown> {
    if (response.status === 204) {
        return undefined;
    }
    const contentType = response.headers.get('content-type');
    const responseText = await response.text();
    if (contentType?.includes('application/json')) {
        return JSON.parse(responseText, bigintReviver);
    }
    try {
        return JSON.parse(responseText, bigintReviver);
    } catch {
        return responseText;
    }
}

/**
 * A terminal middleware that performs the actual request with `fetchImpl` and
 * builds the `ApiResponse` expected by `@qdrant/openapi-typescript-fetch`.
 *
 * It intentionally ignores `next`: by handling the request here we bypass the
 * library's own call to the *global* `fetch`. That's what lets us drive the
 * request through a fetch implementation that matches our dispatcher (see
 * `createNodeFetch`) and avoids the "two undici in one process" mismatch (#134).
 *
 * `fetchImpl` defaults to the platform's global `fetch` (browser / edge / a Node
 * runtime without undici), so the only thing the caller must decide is whether
 * to override it.
 */
export function createTransport(fetchImpl?: FetchFn): Middleware {
    const doFetch: FetchFn = fetchImpl ?? ((url, init) => globalThis.fetch(url, init));
    return async (url, init) => {
        const response = await doFetch(url, init);
        const data = await getResponseData(response);
        const result = {
            headers: response.headers,
            url: response.url,
            ok: response.ok,
            status: response.status,
            statusText: response.statusText,
            data,
        };
        if (result.ok) {
            return result;
        }
        throw new ApiError(result);
    };
}
