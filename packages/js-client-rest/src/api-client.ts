import {ApiError, Fetcher, Middleware} from '@qdrant/openapi-typescript-fetch';
import {paths} from './openapi/generated_schema.js';
import {createDispatcher} from './dispatcher.js';
import {createClusterApi} from './api/cluster-api.js';
import {createCollectionsApi} from './api/collections-api.js';
import {createPointsApi} from './api/points-api.js';
import {createServiceApi} from './api/service-api.js';
import {createSnapshotsApi} from './api/snapshots-api.js';
import {createShardsApi} from './api/shards-api.js';
import {
    QdrantClientResourceExhaustedError,
    QdrantClientTimeoutError,
    QdrantClientUnexpectedResponseError,
} from './errors.js';
import {RestArgs} from './types.js';

export type Client = ReturnType<typeof Fetcher.for<paths>>;

export function createApis(baseUrl: string, args: RestArgs) {
    const client = createClient(baseUrl, args);

    return {
        cluster: createClusterApi(client),
        collections: createCollectionsApi(client),
        points: createPointsApi(client),
        service: createServiceApi(client),
        snapshots: createSnapshotsApi(client),
        shards: createShardsApi(client),
    } as const;
}

export type OpenApiClient = ReturnType<typeof createApis>;

export function createClient(baseUrl: string, {headers, timeout, connections}: RestArgs): Client {
    const use: Middleware[] = [];
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
                    const retryAfterSeconds = Number(retryAfterHeader);
                    if (!isNaN(retryAfterSeconds)) {
                        throw new QdrantClientResourceExhaustedError(retryAfterSeconds);
                    }
                }
            }
            throw error;
        }

        throw QdrantClientUnexpectedResponseError.forResponse(response);
    });

    const client = Fetcher.for<paths>();
    // Configure client with 'undici' agent which is used in Node 18+
    client.configure({
        baseUrl,
        init: {
            headers,
            dispatcher:
                typeof process !== 'undefined' &&
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                process.versions?.node
                    ? createDispatcher(connections)
                    : undefined,
        },
        use,
    });

    return client;
}
