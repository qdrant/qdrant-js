import {test, describe, expect} from 'vitest';
import {QdrantClient} from '../../src/qdrant-client.js';

describe('QdrantClient', () => {
    const DIM = 100;
    const client = new QdrantClient();
    const collectionName = 'test_collection';

    test('cleanup if collection exists', async () => {
        expect(await client.deleteCollection(collectionName)).toBeTypeOf('boolean');
    });

    test('create collection', async () => {
        expect(
            await client.createCollection(collectionName, {
                vectors: {size: 4, distance: 'Dot'},
                optimizers_config: {default_segment_number: 2},
                replication_factor: 2,
            }),
        ).toBe(true);
    });

    test('create indexes', async () => {
        let result = await client.createPayloadIndex(collectionName, {field_name: 'city', field_schema: 'keyword'});
        expect(result).toMatchObject<typeof result>({
            operation_id: expect.any(Number) as number,
            status: 'acknowledged',
        });

        result = await client.createPayloadIndex(collectionName, {field_name: 'count', field_schema: 'integer'});
        expect(result).toMatchObject<typeof result>({
            operation_id: expect.any(Number) as number,
            status: 'acknowledged',
        });

        result = await client.createPayloadIndex(collectionName, {
            field_name: 'coords',
            field_schema: 'geo',
            wait: true,
        });
        expect(result).toMatchObject<typeof result>({operation_id: expect.any(Number) as number, status: 'completed'});
    });

    test('get collection', async () => {
        await expect(client.getCollection(collectionName)).resolves.toBeDefined();
    });

    test('insert points', async () => {
        const result = await client.upsert(collectionName, {
            wait: true,
            points: [
                {
                    id: 1,
                    vector: [0.05, 0.61, 0.76, 0.74],
                    payload: {
                        city: 'Berlin',
                        country: 'Germany',
                        count: 1000000,
                        square: 12.5,
                        coords: {lat: 1.0, lon: 2.0},
                    },
                },
                {id: 2, vector: [0.19, 0.81, 0.75, 0.11], payload: {city: ['Berlin', 'London']}},
                {id: 3, vector: [0.36, 0.55, 0.47, 0.94], payload: {city: ['Berlin', 'Moscow']}},
                {id: 4, vector: [0.18, 0.01, 0.85, 0.8], payload: {city: ['London', 'Moscow']}},
                {id: '98a9a4b1-4ef2-46fb-8315-a97d874fe1d7', vector: [0.24, 0.18, 0.22, 0.44], payload: {count: [0]}},
                {id: 'f0e09527-b096-42a8-94e9-ea94d342b925', vector: [0.35, 0.08, 0.11, 0.44]},
            ],
        });
        expect(result).toMatchObject<typeof result>({operation_id: expect.any(Number) as number, status: 'completed'});
    });

    test('retrieve point', async () => {
        const result = await client.api('points').getPoint({collection_name: collectionName, id: 2});
        expect(result.data.result).toBeDefined();
    });

    test('retrieve points', async () => {
        const result = await client.retrieve(collectionName, {ids: [1, 2]});
        expect(result).toHaveLength(2);
    });

    test('retrieve all points', async () => {
        const result = await client.getCollection(collectionName);
        expect(result, 'check failed - 6 points expected').toMatchObject<Pick<typeof result, 'vectors_count'>>({
            vectors_count: 6,
        });
    });

    test('search points', async () => {
        const result = await client.search(collectionName, {
            vector: [0.2, 0.1, 0.9, 0.7],
            limit: 3,
        });
        expect(result).toHaveLength(3);
    });

    test('search points filter', async () => {
        const result = await client.search(collectionName, {
            filter: {
                should: [
                    {
                        key: 'city',
                        match: {
                            value: 'London',
                        },
                    },
                ],
            },
            vector: [0.2, 0.1, 0.9, 0.7],
            limit: 3,
        });
        expect(result).toHaveLength(2);
    });

    test('search points batch', async () => {
        const result = await client.searchBatch(collectionName, {
            searches: [
                {
                    vector: [0.2, 0.1, 0.9, 0.7],
                    limit: 3,
                    with_payload: true,
                },
                {
                    vector: [0.2, 0.1, 0.9, 0.7],
                    limit: 3,
                    with_payload: true,
                },
            ],
        });
        expect(result).toHaveLength(2);
    });

    test('locks', async () => {
        expect(await client.recreateCollection(collectionName, {vectors: {size: DIM, distance: 'Dot'}})).toBeDefined();

        const reason = 'testing reason';
        expect(await client.lockStorage(reason)).toBeDefined();

        // Try creating a single point when the lock is in place
        try {
            await expect(
                client.upsert(collectionName, {
                    points: [
                        {
                            id: 123,
                            payload: {test: 'value'},
                            vector: Array.from({length: DIM}, () => Math.random()),
                        },
                    ],
                    wait: true,
                }),
                'Should not be able to insert a point when storage is locked',
            ).rejects.toThrow();
        } catch (err) {
            expect(String(err), 'Should error due to lock (testing reason) in place').toBe('testing reason');
        }

        const result = await client.getLocks();
        expect(result).toMatchObject<typeof result>({write: true, error_message: reason});

        await client.unlockStorage();

        // should be fine now
        expect(
            await client.upsert(collectionName, {
                points: [
                    {
                        id: 123,
                        payload: {test: 'value'},
                        vector: Array.from({length: DIM}, () => Math.random()),
                    },
                ],
                wait: true,
            }),
        ).toBeDefined();
    });
});
