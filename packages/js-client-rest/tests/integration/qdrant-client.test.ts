import {test, describe, expect} from 'vitest';
import semver from 'semver';
import {QdrantClient} from '../../src/qdrant-client.js';
import {components} from '../../src/openapi/generated_schema.js';

describe('QdrantClient', () => {
    const semverRegEx =
        /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
    const client = new QdrantClient();
    const collectionName = 'test_collection';
    const bigInt = BigInt(String(Number.MAX_SAFE_INTEGER + 2)) as unknown as number;
    const maxSafeInteger = Number.MAX_SAFE_INTEGER;
    const supportsJSONBigInt = semver.satisfies(process.versions.node, '>=21');

    test('Qdrant service check', async () => {
        const {data} = await client.api().telemetry({});
        expect(data).toMatchObject({
            time: expect.any(Number) as unknown,
            status: 'ok',
            result: {
                app: {
                    name: 'qdrant',
                    version: expect.stringMatching(semverRegEx) as unknown,
                },
            },
        });
    });

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

    test('list collections', async () => {
        expect(await client.getCollections()).toEqual({
            collections: [{name: collectionName}],
        });
    });

    test('create collection alias', async () => {
        expect(
            await client.updateCollectionAliases({
                actions: [{create_alias: {alias_name: `${collectionName}_alias`, collection_name: collectionName}}],
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
                {id: maxSafeInteger, vector: [0.19, 0.81, 0.75, 0.11]},
                {id: '98a9a4b1-4ef2-46fb-8315-a97d874fe1d7', vector: [0.24, 0.18, 0.22, 0.44], payload: {count: [0]}},
                {id: 'f0e09527-b096-42a8-94e9-ea94d342b925', vector: [0.35, 0.08, 0.11, 0.44]},
            ].concat(supportsJSONBigInt ? [{id: bigInt, vector: [0.19, 0.81, 0.75, 0.11]}] : []),
        });
        expect(result).toMatchObject<typeof result>({operation_id: expect.any(Number) as number, status: 'completed'});
    });

    test('retrieve point', async () => {
        const result = (await client.api().getPoint({collection_name: collectionName, id: 2})).data.result!;
        expect(result).toMatchObject<typeof result>({
            id: 2,
            payload: {city: ['Berlin', 'London']},
            vector: [0.19, 0.81, 0.75, 0.11],
        });
    });

    test.skipIf(!supportsJSONBigInt)('retrieve point by uint64 id (BigInt)', async () => {
        const result = (await client.api().getPoint({collection_name: collectionName, id: bigInt})).data.result!;
        expect(result).toMatchObject<typeof result>({
            id: bigInt,
            vector: [0.19, 0.81, 0.75, 0.11],
        });
    });

    test('retrieve points', async () => {
        const result = await client.retrieve(collectionName, {ids: [1, 2]});
        expect(result).toHaveLength(2);
    });

    test('retrieve all points', async () => {
        const result = await client.getCollection(collectionName);
        expect(result, 'check failed - 6 points expected').toMatchObject<Pick<typeof result, 'points_count'>>({
            points_count: 7 + (supportsJSONBigInt ? 1 : 0),
        });
    });

    test('search points', async () => {
        const result = await client.search(collectionName, {
            vector: [0.2, 0.1, 0.9, 0.7],
            limit: 3,
        });
        expect(result).toHaveLength(3);
    });

    test('upsert with timeout', async () => {
        const result = await client.upsert(collectionName, {
            wait: true,
            timeout: 10,
            points: [
                {
                    id: 5,
                    vector: [0.05, 0.61, 0.76, 0.74],
                    payload: {
                        city: 'Berlin',
                        country: 'Germany',
                        count: 1000000,
                        square: 12.5,
                        coords: {lat: 1.0, lon: 2.0},
                    },
                },
            ],
        });
        expect(result).toMatchObject<typeof result>({operation_id: expect.any(Number) as number, status: 'completed'});
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

    test('query nearest points', async () => {
        const result = await client.query(collectionName, {
            query: {
                nearest: [0.2, 0.1, 0.9, 0.7],
            },
            limit: 3,
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
            with_payload: true,
            with_vector: true,
        });
        expect(result.points).toHaveLength(2);
    });

    test('query points with formula scoring', async () => {
        // First, let's add some points with tag payloads
        await client.upsert(collectionName, {
            wait: true,
            points: [
                {
                    id: 100,
                    vector: [0.4, 0.6, 0.3, 0.7],
                    payload: {tag: 'h1'},
                },
                {
                    id: 101,
                    vector: [0.4, 0.6, 0.3, 0.7],
                    payload: {tag: 'p'},
                },
                {
                    id: 102,
                    vector: [0.4, 0.6, 0.3, 0.7],
                    payload: {tag: 'li'},
                },
            ],
        });

        const result = await client.query(collectionName, {
            prefetch: {
                query: [0.2, 0.8, 0.1, 0.9],
                limit: 50,
            },
            query: {
                formula: {
                    sum: [
                        '$score',
                        {
                            mult: [
                                0.5,
                                {
                                    key: 'tag',
                                    match: {any: ['h1', 'h2', 'h3', 'h4']},
                                },
                            ],
                        },
                        {
                            mult: [
                                0.25,
                                {
                                    key: 'tag',
                                    match: {any: ['p', 'li']},
                                },
                            ],
                        },
                    ],
                },
            },
        });

        expect(result.points).toBeDefined();
        expect(result.points.length).toBeGreaterThan(0);

        // Verify that points with h1 tag have higher scores than p/li tags
        const h1Point = result.points.find((p: components['schemas']['ScoredPoint']) => p.payload?.tag === 'h1');
        const pPoint = result.points.find((p: components['schemas']['ScoredPoint']) => p.payload?.tag === 'p');
        const liPoint = result.points.find((p: components['schemas']['ScoredPoint']) => p.payload?.tag === 'li');

        if (h1Point && pPoint) {
            expect(h1Point.score).toBeGreaterThan(pPoint.score);
        }
        if (h1Point && liPoint) {
            expect(h1Point.score).toBeGreaterThan(liPoint.score);
        }
    });

    test('batch query nearest points', async () => {
        const result = await client.queryBatch(collectionName, {
            searches: [
                {
                    query: {
                        nearest: [0.2, 0.1, 0.9, 0.7],
                    },
                    limit: 3,
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
                },
            ],
        });
        console.log(result);
        expect(result[0].points).toHaveLength(2);
    });
});
