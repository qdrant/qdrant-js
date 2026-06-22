import {createApis, createClient} from '../../src/api-client.js';
import {QdrantClientTimeoutError, QdrantClientUnexpectedResponseError} from '../../src/errors.js';
import {vi, describe, test, expect} from 'vitest';

describe('apiClient', () => {
    const headers = new Headers();
    headers.set('content-type', 'application/json');
    const createFetchResponse = (status: number) => ({
        headers,
        url: '',
        ok: true,
        status,
        statusText: '',
        json: () => new Promise((resolve) => resolve({error_message: 'response error'})),
        text: () => new Promise((resolve) => resolve(JSON.stringify({error_message: 'response error'}))),
    });

    test('status 200', async () => {
        const fetch = vi.fn().mockResolvedValue(createFetchResponse(200));

        const apis = createApis('http://my-domain.com', {
            timeout: Infinity,
            headers,
            fetch,
        });

        await expect(apis.collectionExists({collection_name: 'my-collection'})).resolves.toMatchObject({
            data: {error_message: 'response error'},
        });

        expect(fetch).toBeCalledWith(
            expect.stringMatching('http://my-domain.com/collections/my-collection/exists'),
            expect.objectContaining({
                method: 'GET',
            }),
        );
    });

    test('status 400', async () => {
        const fetch = vi.fn().mockResolvedValue(createFetchResponse(400));

        const client = createClient('http://my-domain.com', {
            timeout: Infinity,
            headers,
            fetch,
        });
        const telemetry = client.path('/telemetry').method('get').create();

        await expect(telemetry({})).rejects.toThrowError(QdrantClientUnexpectedResponseError);
    });

    test('signal abort: timeout', async () => {
        const err = new Error();
        err.name = 'AbortError';
        const fetch = vi.fn().mockRejectedValue(err);

        const client = createClient('http://my-domain.com', {
            timeout: 0,
            headers,
            fetch,
        });
        const telemetry = client.path('/telemetry').method('get').create();

        await expect(telemetry({})).rejects.toThrowError(QdrantClientTimeoutError);
    });

    test('injected fetch is used and no dispatcher is set on init', async () => {
        const fetch = vi.fn().mockResolvedValue(createFetchResponse(200));

        const apis = createApis('http://my-domain.com', {
            timeout: Infinity,
            headers,
            fetch,
        });

        await apis.collectionExists({collection_name: 'my-collection'});

        expect(fetch).toHaveBeenCalledTimes(1);
        const calls = fetch.mock.calls as unknown as [string, Record<string, unknown>][];
        expect(calls[0][1]).not.toHaveProperty('dispatcher');
    });
});
