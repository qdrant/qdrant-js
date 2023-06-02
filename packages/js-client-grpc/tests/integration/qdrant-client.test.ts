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

    test('signal abort: timeout', async () => {
        const client = new QdrantClient({timeout: 0});

        try {
            await expect(client.api('service').healthCheck({})).rejects.toThrowError(ConnectError);
        } catch (e) {
            expect((e as ConnectError).code).toBe(ConnectErrorCode.Canceled);
        }
    });

    test('Qdrant service check', async () => {
        const {QDRANT_URL, QDRANT_API_KEY} = process.env;
        const client = new QdrantClient({
            url: QDRANT_URL,
            apiKey: QDRANT_API_KEY,
        });

        await expect(client.api('service').healthCheck({})).resolves.toMatchObject({
            title: 'qdrant - vector search engine',
            version: expect.stringMatching(semverRegEx) as unknown,
        });
    });

    test('cleanup if collection exists', async () => {
        const response = await client.api('collections').delete({collection_name: collectionName});
        expect(response.result).toBeTypeOf('boolean');
    });

    test('create collection', async () => {
        const response = await client.api('collections').create({
            collection_name: collectionName,
            vectors_config: {config: {case: 'params', value: {size: 4n, distance: Distance.Dot}}},
            optimizers_config: {default_segment_number: 2n},
            replication_factor: 2,
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
                        case: 'create_alias',
                        value: {collection_name: collectionName, alias_name: `${collectionName}_alias`},
                    },
                },
            ],
        });
        expect(response.result).toBe(true);
    });

    test('create indexes', async () => {
        let updateResult = (
            await client.api('points').createFieldIndex({
                collection_name: collectionName,
                field_name: 'city',
                field_type: FieldType.FieldTypeKeyword,
            })
        ).result!;
        expect(updateResult).toMatchObject<PlainMessage<typeof updateResult>>({
            operation_id: expect.any(BigInt) as bigint,
            status: UpdateStatus.Acknowledged,
        });

        updateResult = (
            await client.api('points').createFieldIndex({
                collection_name: collectionName,
                field_name: 'count',
                field_type: FieldType.FieldTypeInteger,
            })
        ).result!;
        expect(updateResult).toMatchObject<PlainMessage<typeof updateResult>>({
            operation_id: expect.any(BigInt) as bigint,
            status: UpdateStatus.Acknowledged,
        });

        updateResult = (
            await client.api('points').createFieldIndex({
                collection_name: collectionName,
                field_name: 'coords',
                field_type: FieldType.FieldTypeGeo,
                wait: true,
            })
        ).result!;
        expect(updateResult).toMatchObject<PlainMessage<typeof updateResult>>({
            operation_id: expect.any(BigInt) as bigint,
            status: UpdateStatus.Completed,
        });
    });

    test('get collection', async () => {
        await expect(client.api('collections').get({collection_name: collectionName})).resolves.toHaveProperty(
            'result',
        );
    });

    test('insert points', async () => {
        const updateResult = (
            await client.api('points').upsert({
                collection_name: collectionName,
                wait: true,
                points: [
                    {
                        id: {
                            point_id_options: {case: 'num', value: 1n},
                        },
                        vectors: {
                            vectors_options: {case: 'vector', value: {data: [0.05, 0.61, 0.76, 0.74]}},
                        },
                        payload: {
                            city: {
                                kind: {case: 'string_value', value: 'Berlin'},
                            },
                            country: {
                                kind: {case: 'string_value', value: 'Germany'},
                            },
                            count: {
                                kind: {case: 'integer_value', value: 1000000n},
                            },
                            square: {
                                kind: {case: 'double_value', value: 12.5},
                            },
                            coords: {
                                kind: {
                                    case: 'struct_value',
                                    value: {
                                        fields: {
                                            lat: {
                                                kind: {case: 'double_value', value: 1.0},
                                            },
                                            lon: {
                                                kind: {case: 'double_value', value: 2.0},
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    {
                        id: {
                            point_id_options: {case: 'num', value: 2n},
                        },
                        vectors: {
                            vectors_options: {case: 'vector', value: {data: [0.19, 0.81, 0.75, 0.11]}},
                        },
                        payload: {
                            city: {
                                kind: {
                                    case: 'list_value',
                                    value: {
                                        values: [
                                            {kind: {case: 'string_value', value: 'Berlin'}},
                                            {kind: {case: 'string_value', value: 'London'}},
                                        ],
                                    },
                                },
                            },
                        },
                    },
                    {
                        id: {
                            point_id_options: {case: 'num', value: 3n},
                        },
                        vectors: {
                            vectors_options: {case: 'vector', value: {data: [0.36, 0.55, 0.47, 0.94]}},
                        },
                        payload: {
                            city: {
                                kind: {
                                    case: 'list_value',
                                    value: {
                                        values: [
                                            {kind: {case: 'string_value', value: 'Berlin'}},
                                            {kind: {case: 'string_value', value: 'Moscow'}},
                                        ],
                                    },
                                },
                            },
                        },
                    },
                    {
                        id: {
                            point_id_options: {case: 'num', value: 4n},
                        },
                        vectors: {
                            vectors_options: {case: 'vector', value: {data: [0.18, 0.01, 0.85, 0.8]}},
                        },
                        payload: {
                            city: {
                                kind: {
                                    case: 'list_value',
                                    value: {
                                        values: [
                                            {kind: {case: 'string_value', value: 'London'}},
                                            {kind: {case: 'string_value', value: 'Moscow'}},
                                        ],
                                    },
                                },
                            },
                        },
                    },
                    {
                        id: {
                            point_id_options: {case: 'uuid', value: '98a9a4b1-4ef2-46fb-8315-a97d874fe1d7'},
                        },
                        vectors: {
                            vectors_options: {case: 'vector', value: {data: [0.24, 0.18, 0.22, 0.44]}},
                        },
                        payload: {
                            count: {
                                kind: {
                                    case: 'list_value',
                                    value: {
                                        values: [{kind: {case: 'integer_value', value: 0n}}],
                                    },
                                },
                            },
                        },
                    },
                    {
                        id: {
                            point_id_options: {case: 'uuid', value: '98a9a4b1-4ef2-46fb-8315-a97d874fe1d7'},
                        },
                        vectors: {
                            vectors_options: {case: 'vector', value: {data: [0.24, 0.18, 0.22, 0.44]}},
                        },
                        payload: {
                            count: {
                                kind: {
                                    case: 'list_value',
                                    value: {
                                        values: [{kind: {case: 'integer_value', value: 0n}}],
                                    },
                                },
                            },
                        },
                    },
                    {
                        id: {
                            point_id_options: {case: 'uuid', value: 'f0e09527-b096-42a8-94e9-ea94d342b925'},
                        },
                        vectors: {
                            vectors_options: {case: 'vector', value: {data: [0.35, 0.08, 0.11, 0.44]}},
                        },
                        payload: {
                            count: {
                                kind: {
                                    case: 'list_value',
                                    value: {
                                        values: [{kind: {case: 'integer_value', value: 0n}}],
                                    },
                                },
                            },
                        },
                    },
                ],
            })
        ).result!;
        expect(updateResult).toMatchObject<PlainMessage<typeof updateResult>>({
            operation_id: expect.any(BigInt) as bigint,
            status: UpdateStatus.Completed,
        });
    });

    test('retrieve point', async () => {
        const points = (
            await client.api('points').get({
                collection_name: collectionName,
                ids: [
                    {
                        point_id_options: {case: 'num', value: 2n},
                    },
                ],
                with_payload: {
                    selector_options: {case: 'enable', value: true},
                },
            })
        ).result;
        expect(points[0].toJson()).toMatchObject({
            id: {
                num: '2',
            },
            payload: {
                city: {
                    list_value: {
                        values: [
                            {
                                string_value: 'Berlin',
                            },
                            {
                                string_value: 'London',
                            },
                        ],
                    },
                },
            },
        });
    });

    test('retrieve points', async () => {
        const points = (
            await client.api('points').get({
                collection_name: collectionName,
                ids: [
                    {
                        point_id_options: {case: 'num', value: 1n},
                    },
                    {
                        point_id_options: {case: 'num', value: 2n},
                    },
                ],
            })
        ).result;
        expect(points).toHaveLength(2);
    });

    test('retrieve all points', async () => {
        const result = (await client.api('collections').get({collection_name: collectionName})).result!;
        expect(result.toJson(), 'check failed - 6 points expected').toMatchObject({
            vectors_count: '6',
        });
    });

    test('search points', async () => {
        const result = (
            await client
                .api('points')
                .search(
                    SearchPoints.fromJson({collection_name: collectionName, vector: [0.2, 0.1, 0.9, 0.7], limit: 3}),
                )
        ).result;
        expect(result).toHaveLength(3);
    });

    test('search points filter', async () => {
        const result = (
            await client.api('points').search({
                collection_name: collectionName,
                filter: {
                    should: [
                        {
                            condition_one_of: {
                                case: 'field',
                                value: {
                                    key: 'city',
                                    match: {
                                        match_value: {case: 'keyword', value: 'London'},
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
                collection_name: collectionName,
                search_points: [
                    {
                        collection_name: collectionName,
                        vector: [0.2, 0.1, 0.9, 0.7],
                        limit: 3n,
                        with_payload: {selector_options: {case: 'enable', value: true}},
                    },
                    {
                        collection_name: collectionName,
                        vector: [0.2, 0.1, 0.9, 0.7],
                        limit: 3n,
                        with_payload: {selector_options: {case: 'enable', value: true}},
                    },
                ],
            })
        ).result;
        expect(result).toHaveLength(2);
    });
});
