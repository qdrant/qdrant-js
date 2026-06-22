import {ApiError, Fetcher, Middleware} from '@qdrant/openapi-typescript-fetch';
import {paths} from './openapi/generated_schema.js';
import {createTransport} from './transport.js';
import {createNodeFetch} from './node-fetch.js';
import {
    QdrantClientResourceExhaustedError,
    QdrantClientTimeoutError,
    QdrantClientUnexpectedResponseError,
} from './errors.js';
import {RestArgs} from './types.js';
import {createClientApi} from './openapi/generated_api_client.js';
import {ClientApi} from './openapi/generated_client_type.js';
import {getContextHeaders} from './context-headers.js';

export type Client = ReturnType<typeof Fetcher.for<paths>>;

export function createApis(baseUrl: string, args: RestArgs): ClientApi {
    const client = createClient(baseUrl, args);
    return createClientApi(client);
}

export type OpenApiClient = ReturnType<typeof createApis>;

export function createClient(baseUrl: string, {headers, timeout, connections, fetch}: RestArgs): Client {
    const use: Middleware[] = [];
    use.push((url, init, next) => {
        const ctx = getContextHeaders();
        const entries = Object.entries(ctx);
        if (entries.length === 0) return next(url, init);
        const merged = new Headers(init.headers as HeadersInit);
        for (const [key, value] of entries) merged.set(key, value);
        return next(url, {...init, headers: merged});
    });
    if (Number.isFinite(timeout)) {
        use.push(async (url, init, next) => {
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), timeout);
            try {
                return await next(url, Object.assign(init, {signal: controller.signal}));
            } catch (e) {
                if (e instanceof Error && e.name === 'AbortError') {
                    throw new QdrantClientTimeoutError(e.message);
                }
                throw e;
            } finally {
                clearTimeout(id);
            }
        });
    }

    use.push(async (url, init, next) => {
        let response;
        try {
            response = await next(url, init);

            if (response.status === 200 || response.status === 201) {
                return response;
            }
        } catch (error) {
            if (error instanceof ApiError && error.status === 429) {
                const retryAfterHeader = error.headers.get('retry-after')?.[0];
                if (retryAfterHeader) {
                    throw new QdrantClientResourceExhaustedError(error.message, retryAfterHeader);
                }
            }
            throw error;
        }

        throw QdrantClientUnexpectedResponseError.forResponse(response);
    });

    // Terminal middleware: performs the actual request. Must be last so its
    // `next` sits closest to the transport and the middlewares above can wrap it.
    //
    // Fetch selection (kept as a ternary at the call site so the `undici` branch
    // is tree-shaken from browser bundles, where `process` becomes `undefined`):
    //   A. a caller-supplied `fetch`;
    //   B. on Node, undici's fetch + Agent from the same package (fixes #134);
    //   C. otherwise, the global `fetch` (handled inside `createTransport`).
    const fetchImpl =
        fetch ??
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        (typeof process !== 'undefined' && process.versions?.node ? createNodeFetch(connections) : undefined);
    use.push(createTransport(fetchImpl));

    const client = Fetcher.for<paths>();
    client.configure({
        baseUrl,
        init: {
            headers,
        },
        use,
    });

    return client;
}
