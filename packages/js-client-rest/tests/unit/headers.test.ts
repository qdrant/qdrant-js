import {afterEach, expect, test, vi} from 'vitest';
import {QdrantClient} from '../../src/qdrant-client.js';

afterEach(() => vi.restoreAllMocks());

test.each([
    {name: 'zero', value: 0, expected: '0'},
    {name: 'empty string', value: '', expected: ''},
    {name: 'number', value: 42, expected: '42'},
    {name: 'string', value: 'value', expected: 'value'},
    {name: 'array', value: ['a', 'b'], expected: 'a,b'},
    {name: 'undefined', value: undefined, expected: null},
])('custom header: $name', async ({value, expected}) => {
    const fetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(JSON.stringify({result: {collections: []}, status: 'ok', time: 0}), {
            headers: {'content-type': 'application/json'},
        }),
    );
    const client = new QdrantClient({
        checkCompatibility: false,
        headers: {'x-custom': value},
    });

    try {
        await client.getCollections();
        expect(fetch).toHaveBeenCalledTimes(1);
        const headers = new Headers(fetch.mock.calls[0][1]?.headers);
        expect(headers.get('x-custom')).toBe(expected);
    } finally {
        await fetch.mock.calls[0]?.[1]?.dispatcher?.close();
    }
});
