import {paths} from './openapi/generated_schema.js';
import {createClusterApi} from './api/cluster-api.js';
import {createCollectionsApi} from './api/collections-api.js';
import {createPointsApi} from './api/points-api.js';
import {createServiceApi} from './api/service-api.js';
import {createSnapshotsApi} from './api/snapshots-api.js';
import {QdrantClientTimeoutError, QdrantClientUnexpectedResponseError} from './errors.js';
import {RestArgs} from './types.js';
import {Fetcher, Middleware} from 'openapi-typescript-fetch';

export type Client = ReturnType<typeof Fetcher.for<paths>>;

export function createApis(baseUrl: string, args: RestArgs) {
    const client = createClient(baseUrl, args);

    return {
        cluster: createClusterApi(client),
        collections: createCollectionsApi(client),
        points: createPointsApi(client),
        service: createServiceApi(client),
        snapshots: createSnapshotsApi(client),
    } as const;
}

export type OpenApiClient = ReturnType<typeof createApis>;

export function createClient(baseUrl: string, {headers, timeout}: RestArgs): Client {
    const use: Middleware[] = [];
    if (Number.isFinite(timeout)) {
        use.push(async (url, init, next) => {
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), timeout);
            try {
                return await next(url, {...init, signal: controller.signal});
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
        const response = await next(url, init);
        if (response.status === 200 || response.status === 201) {
            return response;
        }
        throw QdrantClientUnexpectedResponseError.forResponse(response);
    });

    const client = Fetcher.for<paths>();
    client.configure({baseUrl, init: {headers}, use});

    return client;
}
