import {ApiError} from '@qdrant/openapi-typescript-fetch';
import {createApis, createClient} from '../../src/api-client.js';
import {QdrantClientResourceExhaustedError, QdrantClientTimeoutError} from '../../src/errors.js';
import {createFetcher} from '../../src/fetcher.js';
import {vi, describe, test, expect, beforeEach, afterEach} from 'vitest';

describe('apiClient', () => {
    const createFetchResponse = (status: number, body: unknown = {error_message: 'response error'}) => ({
        headers: new Headers([['content-type', 'application/json']]),
        ok: status >= 200 && status < 300,
        status,
        statusText: status === 200 ? 'OK' : status === 429 ? 'Too Many Requests' : 'Bad Request',
        url: 'http://my-domain.com/test',
        json: () => new Promise((resolve) => resolve(body)),
        text: () => new Promise((resolve) => resolve(JSON.stringify(body))),
    });
    const headers = new Headers([['content-type', 'application/json']]);
    let originalFetch: typeof global.fetch;

    beforeEach(() => {
        originalFetch = global.fetch;
    });

    afterEach(() => {
        global.fetch = originalFetch;
    });

    test('status 200', async () => {
        global.fetch = vi.fn().mockResolvedValue(createFetchResponse(200));

        const apis = createApis('http://my-domain.com', {
            timeout: Infinity,
            headers,
        });

        await expect(apis.collectionExists({collection_name: 'my-collection'})).resolves.toMatchObject({
            data: {error_message: 'response error'},
        });

        expect(global.fetch).toBeCalledWith(
            expect.stringMatching('http://my-domain.com/collections/my-collection/exists'),
            expect.objectContaining({
                method: 'GET',
            }),
        );

        const [, init] = vi.mocked(global.fetch).mock.calls[0] ?? [];
        expect(init).not.toHaveProperty('dispatcher');
    });

    test('status 400', async () => {
        global.fetch = vi.fn().mockResolvedValue(createFetchResponse(400));

        const client = createClient('http://my-domain.com', {
            timeout: Infinity,
            headers,
        });
        const telemetry = client.path('/telemetry').method('get').create();

        await expect(telemetry({})).rejects.toThrowError(ApiError);
    });

    test('status 429 preserves full retry-after value', async () => {
        const response = createFetchResponse(429);
        response.headers.set('retry-after', '10');
        global.fetch = vi.fn().mockResolvedValue(response);

        const client = createClient('http://my-domain.com', {
            timeout: Infinity,
            headers,
        });
        const telemetry = client.path('/telemetry').method('get').create();

        await expect(telemetry({})).rejects.toMatchObject({
            retry_after: 10,
        } satisfies Partial<QdrantClientResourceExhaustedError>);
    });

    test('signal abort: timeout', async () => {
        const err = new Error();
        err.name = 'AbortError';
        global.fetch = vi.fn().mockRejectedValue(err);

        const client = createClient('http://my-domain.com', {
            timeout: 0,
            headers,
        });
        const telemetry = client.path('/telemetry').method('get').create();

        await expect(telemetry({})).rejects.toThrowError(QdrantClientTimeoutError);
    });

    test('uses injected fetch implementation when provided', async () => {
        const customFetch = vi.fn().mockResolvedValue(createFetchResponse(200));
        global.fetch = vi.fn().mockResolvedValue(createFetchResponse(400));

        const apis = createApis('http://my-domain.com', {
            timeout: Infinity,
            headers,
            fetch: customFetch,
        });

        await expect(apis.collectionExists({collection_name: 'my-collection'})).resolves.toMatchObject({
            data: {error_message: 'response error'},
        });

        expect(customFetch).toHaveBeenCalledOnce();
        expect(global.fetch).not.toHaveBeenCalled();
    });

    test('preserves FormData request bodies', async () => {
        const client = createFetcher<{
            '/snapshots/upload': {
                post: unknown;
            };
        }>();
        const formData = new FormData();
        formData.set('snapshot', new Blob(['snapshot']));
        const customFetch = vi.fn().mockResolvedValue(createFetchResponse(200, {result: true}));
        client.configure({
            baseUrl: 'http://my-domain.com',
            fetch: customFetch,
        });
        const uploadSnapshot = client.path('/snapshots/upload').method('post').create();

        await uploadSnapshot(formData as never);

        const calls = customFetch.mock.calls as Array<[string, RequestInit]>;
        const call = calls[0];
        expect(call).toBeDefined();
        const init = call?.[1];
        expect(init?.body).toBe(formData);
    });

    test('parses large JSON integers as bigint when runtime support is available', async () => {
        const customFetch = vi.fn().mockResolvedValue({
            headers: new Headers([['content-type', 'application/json']]),
            ok: true,
            status: 200,
            statusText: 'OK',
            url: 'http://my-domain.com/test',
            text: () => Promise.resolve('{"value":9223372036854775807}'),
        });

        const apis = createApis('http://my-domain.com', {
            timeout: Infinity,
            headers,
            fetch: customFetch,
        });

        await expect(apis.collectionExists({collection_name: 'my-collection'})).resolves.toMatchObject({
            data: {value: BigInt('9223372036854775807')},
        });
    });
});
