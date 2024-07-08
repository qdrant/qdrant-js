import {test, describe, expect} from 'vitest';
import {QdrantClient} from '../../src/qdrant-client.js';
import {
    PlainMessage,
    Distance,
    FieldType,
    SearchPoints,
    UpdateStatus,
    ConnectError,
    ConnectErrorCode,
} from '../../src/index.js';

describe('QdrantClient', () => {
    const semverRegEx =
        /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
    const client = new QdrantClient();
    const collectionName = 'test_collection';
    const bigInt = BigInt(String(Number.MAX_SAFE_INTEGER + 2));

    test('signal abort: timeout', async () => {
        const client = new QdrantClient({timeout: 0});

        try {
            await expect(client.api('service').healthCheck({})).rejects.toThrowError(ConnectError);
        } catch (e) {
            expect((e as ConnectError).code).toBe(ConnectErrorCode.Canceled);
        }
    });

    test('Qdrant service check', async () => {
        await expect(client.api('service').healthCheck({})).resolves.toMatchObject({
            title: 'qdrant - vector search engine',
            version: expect.stringMatching(semverRegEx) as unknown,
        });
    });

    test('cleanup if collection exists', async () => {
        const response = await client.api('collections').delete({collectionName});
        expect(response.result).toBeTypeOf('boolean');
    });

    test('create collection', async () => {
        const response = await client.api('collections').create({
            collectionName,
            vectorsConfig: {config: {case: 'params', value: {size: 4n, distance: Distance.Dot}}},
            optimizersConfig: {defaultSegmentNumber: 2n},
            replicationFactor: 2,
        });
        expect(response.result).toBe(true);
    });

    test('list collections', async () => {
        expect((await client.api('collections').list({})).toJson()).toMatchObject({
            collections: [{name: collectionName}],
        });
    });

    test('create collection alias', async () => {
        const response = await client.api('collections').updateAliases({
            actions: [
                {
                    action: {
                        case: 'createAlias',
                        value: {collectionName, aliasName: `${collectionName}_alias`},
                    },
                },
            ],
        });
        expect(response.result).toBe(true);
    });

    test('create indexes', async () => {
        let updateResult = (
            await client.api('points').createFieldIndex({
                collectionName,
                fieldName: 'city',
                fieldType: FieldType.FieldTypeKeyword,
            })
        ).result!;
        expect(updateResult).toMatchObject<PlainMessage<typeof updateResult>>({
            operationId: expect.any(BigInt) as bigint,
            status: UpdateStatus.Acknowledged,
        });

        updateResult = (
            await client.api('points').createFieldIndex({
                collectionName,
                fieldName: 'count',
                fieldType: FieldType.FieldTypeInteger,
            })
        ).result!;
        expect(updateResult).toMatchObject<PlainMessage<typeof updateResult>>({
            operationId: expect.any(BigInt) as bigint,
            status: UpdateStatus.Acknowledged,
        });

        updateResult = (
            await client.api('points').createFieldIndex({
                collectionName,
                fieldName: 'coords',
                fieldType: FieldType.FieldTypeGeo,
                wait: true,
            })
        ).result!;
        expect(updateResult).toMatchObject<PlainMessage<typeof updateResult>>({
            operationId: expect.any(BigInt) as bigint,
            status: UpdateStatus.Completed,
        });
    });

    test('get collection', async () => {
        await expect(client.api('collections').get({collectionName})).resolves.toHaveProperty('result');
    });

    test('insert points', async () => {
        const updateResult = (
            await client.api('points').upsert({
                collectionName,
                wait: true,
                points: [
                    {
                        id: {
                            pointIdOptions: {case: 'num', value: 1n},
                        },
                        vectors: {
                            vectorsOptions: {case: 'vector', value: {data: [0.05, 0.61, 0.76, 0.74]}},
                        },
                        payload: {
                            city: {
                                kind: {case: 'stringValue', value: 'Berlin'},
                            },
                            country: {
                                kind: {case: 'stringValue', value: 'Germany'},
                            },
                            count: {
                                kind: {case: 'integerValue', value: 1000000n},
                            },
                            square: {
                                kind: {case: 'doubleValue', value: 12.5},
                            },
                            coords: {
                                kind: {
                                    case: 'structValue',
                                    value: {
                                        fields: {
                                            lat: {
                                                kind: {case: 'doubleValue', value: 1.0},
                                            },
                                            lon: {
                                                kind: {case: 'doubleValue', value: 2.0},
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    {
                        id: {
                            pointIdOptions: {case: 'num', value: 2n},
                        },
                        vectors: {
                            vectorsOptions: {case: 'vector', value: {data: [0.19, 0.81, 0.75, 0.11]}},
                        },
                        payload: {
                            city: {
                                kind: {
                                    case: 'listValue',
                                    value: {
                                        values: [
                                            {kind: {case: 'stringValue', value: 'Berlin'}},
                                            {kind: {case: 'stringValue', value: 'London'}},
                                        ],
                                    },
                                },
                            },
                        },
                    },
                    {
                        id: {
                            pointIdOptions: {case: 'num', value: 3n},
                        },
                        vectors: {
                            vectorsOptions: {case: 'vector', value: {data: [0.36, 0.55, 0.47, 0.94]}},
                        },
                        payload: {
                            city: {
                                kind: {
                                    case: 'listValue',
                                    value: {
                                        values: [
                                            {kind: {case: 'stringValue', value: 'Berlin'}},
                                            {kind: {case: 'stringValue', value: 'Moscow'}},
                                        ],
                                    },
                                },
                            },
                        },
                    },
                    {
                        id: {
                            pointIdOptions: {case: 'num', value: 4n},
                        },
                        vectors: {
                            vectorsOptions: {case: 'vector', value: {data: [0.18, 0.01, 0.85, 0.8]}},
                        },
                        payload: {
                            city: {
                                kind: {
                                    case: 'listValue',
                                    value: {
                                        values: [
                                            {kind: {case: 'stringValue', value: 'London'}},
                                            {kind: {case: 'stringValue', value: 'Moscow'}},
                                        ],
                                    },
                                },
                            },
                        },
                    },
                    {
                        id: {
                            pointIdOptions: {case: 'num', value: bigInt},
                        },
                        vectors: {
                            vectorsOptions: {case: 'vector', value: {data: [0.18, 0.01, 0.85, 0.8]}},
                        },
                    },
                    {
                        id: {
                            pointIdOptions: {case: 'uuid', value: '98a9a4b1-4ef2-46fb-8315-a97d874fe1d7'},
                        },
                        vectors: {
                            vectorsOptions: {case: 'vector', value: {data: [0.24, 0.18, 0.22, 0.44]}},
                        },
                        payload: {
                            count: {
                                kind: {
                                    case: 'listValue',
                                    value: {
                                        values: [{kind: {case: 'integerValue', value: 0n}}],
                                    },
                                },
                            },
                        },
                    },
                    {
                        id: {
                            pointIdOptions: {case: 'uuid', value: '98a9a4b1-4ef2-46fb-8315-a97d874fe1d7'},
                        },
                        vectors: {
                            vectorsOptions: {case: 'vector', value: {data: [0.24, 0.18, 0.22, 0.44]}},
                        },
                        payload: {
                            count: {
                                kind: {
                                    case: 'listValue',
                                    value: {
                                        values: [{kind: {case: 'integerValue', value: 0n}}],
                                    },
                                },
                            },
                        },
                    },
                    {
                        id: {
                            pointIdOptions: {case: 'uuid', value: 'f0e09527-b096-42a8-94e9-ea94d342b925'},
                        },
                        vectors: {
                            vectorsOptions: {case: 'vector', value: {data: [0.35, 0.08, 0.11, 0.44]}},
                        },
                        payload: {
                            count: {
                                kind: {
                                    case: 'listValue',
                                    value: {
                                        values: [{kind: {case: 'integerValue', value: 0n}}],
                                    },
                                },
                            },
                        },
                    },
                ],
            })
        ).result!;
        expect(updateResult).toMatchObject<PlainMessage<typeof updateResult>>({
            operationId: expect.any(BigInt) as bigint,
            status: UpdateStatus.Completed,
        });
    });

    test('retrieve point', async () => {
        const points = (
            await client.api('points').get({
                collectionName,
                ids: [
                    {
                        pointIdOptions: {case: 'num', value: 2n},
                    },
                ],
                withPayload: {
                    selectorOptions: {case: 'enable', value: true},
                },
            })
        ).result;
        expect(points[0].toJson()).toMatchObject({
            id: {
                num: '2',
            },
            payload: {
                city: {
                    listValue: {
                        values: [
                            {
                                stringValue: 'Berlin',
                            },
                            {
                                stringValue: 'London',
                            },
                        ],
                    },
                },
            },
        });
    });

    test('retrieve point by uint64 id (BigInt)', async () => {
        const points = (
            await client.api('points').get({
                collectionName,
                ids: [
                    {
                        pointIdOptions: {case: 'num', value: bigInt},
                    },
                ],
            })
        ).result;
        expect(points[0].toJson()).toMatchObject({
            id: {
                num: bigInt.toString(),
            },
        });
    });

    test('retrieve points', async () => {
        const points = (
            await client.api('points').get({
                collectionName,
                ids: [
                    {
                        pointIdOptions: {case: 'num', value: 1n},
                    },
                    {
                        pointIdOptions: {case: 'num', value: 2n},
                    },
                ],
            })
        ).result;
        expect(points).toHaveLength(2);
    });

    test('retrieve all points', async () => {
        const result = (await client.api('collections').get({collectionName})).result!;
        expect(result.toJson(), 'check failed - 7 points expected').toMatchObject({
            pointsCount: '7',
        });
    });

    test('search points', async () => {
        const result = (
            await client
                .api('points')
                .search(SearchPoints.fromJson({collectionName, vector: [0.2, 0.1, 0.9, 0.7], limit: 3}))
        ).result;
        expect(result).toHaveLength(3);
    });

    test('search points filter', async () => {
        const result = (
            await client.api('points').search({
                collectionName,
                filter: {
                    should: [
                        {
                            conditionOneOf: {
                                case: 'field',
                                value: {
                                    key: 'city',
                                    match: {
                                        matchValue: {case: 'keyword', value: 'London'},
                                    },
                                },
                            },
                        },
                    ],
                },
                vector: [0.2, 0.1, 0.9, 0.7],
                limit: 3n,
            })
        ).result;
        expect(result).toHaveLength(2);
    });

    test('search points batch', async () => {
        const result = (
            await client.api('points').searchBatch({
                collectionName,
                searchPoints: [
                    {
                        collectionName,
                        vector: [0.2, 0.1, 0.9, 0.7],
                        limit: 3n,
                        withPayload: {selectorOptions: {case: 'enable', value: true}},
                    },
                    {
                        collectionName,
                        vector: [0.2, 0.1, 0.9, 0.7],
                        limit: 3n,
                        withPayload: {selectorOptions: {case: 'enable', value: true}},
                    },
                ],
            })
        ).result;
        expect(result).toHaveLength(2);
    });

    test('query points filter', async () => {
        const result = (
            await client.api('points').query({
                collectionName,
                filter: {
                    should: [
                        {
                            conditionOneOf: {
                                case: 'field',
                                value: {
                                    key: 'city',
                                    match: {
                                        matchValue: {case: 'keyword', value: 'London'},
                                    },
                                },
                            },
                        },
                    ],
                },
                limit: 3n,
                query: {
                    variant: {
                        case: 'nearest',
                        value: {
                            variant: {
                                case: 'dense',
                                value: {
                                    data: [0.2, 0.1, 0.9, 0.7],
                                },
                            },
                        },
                    },
                },
            })
        ).result;
        expect(result).toHaveLength(2);
    });
});
