import {createClient} from '../../src/api-client.js';
import {QdrantClientTimeoutError, QdrantClientUnexpectedResponseError} from '../../src/errors.js';
import {vi, describe, test, expect, beforeEach, afterEach} from 'vitest';

describe('apiClient', () => {
    const headers = new Headers();
    headers.set('content-type', 'application/json');
    const createFetchResponse = (status: number) => ({
        headers,
        ok: true,
        status,
        json: () => new Promise((resolve) => resolve({})),
    });
    let originalFetch: typeof global.fetch;

    beforeEach(() => {
        originalFetch = global.fetch;
    });

    afterEach(() => {
        global.fetch = originalFetch;
    });

    test('status 200', async () => {
        global.fetch = vi.fn().mockResolvedValue(createFetchResponse(200));

        const client = createClient('http://my-domain.com', {
            timeout: Infinity,
            headers,
        });
        const telemetry = client.path('/telemetry').method('get').create();

        await expect(telemetry({})).resolves.toBeDefined();
    });

    test('status 400', async () => {
        global.fetch = vi.fn().mockResolvedValue(createFetchResponse(400));

        const client = createClient('http://my-domain.com', {
            timeout: Infinity,
            headers,
        });
        const telemetry = client.path('/telemetry').method('get').create();

        await expect(telemetry({})).rejects.toThrowError(QdrantClientUnexpectedResponseError);
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
});
