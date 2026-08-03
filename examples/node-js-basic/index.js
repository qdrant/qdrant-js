import {QdrantClient} from '@qdrant/qdrant-js';

async function main() {
    const collectionName = 'test_collection';

    const client = new QdrantClient({url: 'http://127.0.0.1:6333'});

    const response = await client.getCollections();

    const collectionNames = response.collections.map((collection) => collection.name);

    if (collectionNames.includes(collectionName)) {
        await client.deleteCollection(collectionName);
    }

    await client.createCollection(collectionName, {
        vectors: {
            size: 4,
            distance: 'Cosine',
        },
        optimizers_config: {
            default_segment_number: 2,
        },
        replication_factor: 2,
    });

    //  -------- Create payload indexes -------------

    await client.createPayloadIndex(collectionName, {
        field_name: 'city',
        field_schema: 'keyword',
        wait: true,
    });

    await client.createPayloadIndex(collectionName, {
        field_name: 'count',
        field_schema: 'integer',
        wait: true,
    });

    await client.createPayloadIndex(collectionName, {
        field_name: 'coords',
        field_schema: 'geo',
        wait: true,
    });

    //  -------- Add points -------------

    await client.upsert(collectionName, {
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

    const collectionInfo = await client.getCollection(collectionName);
    console.log('number of points:', collectionInfo.points_count);
    // prints: number of points: 6

    const points = await client.retrieve(collectionName, {
        ids: [1, 2],
    });

    console.log('points: ', points);
    // prints:
    // points:  [
    //     {
    //       id: 1,
    //       payload: {
    //         city: 'Berlin',
    //         coords: [Object],
    //         count: 1000000,
    //         country: 'Germany',
    //         square: 12.5
    //       },
    //       vector: null
    //     },
    //     { id: 2, payload: { city: [Array] }, vector: null }
    //   ]

    // -------- Query ----------------
    const queryVector = [0.2, 0.1, 0.9, 0.7];

    const res1 = await client.query(collectionName, {
        query: queryVector,
        limit: 3,
    });

    console.log('query result: ', res1.points);
    // prints:
    // query result:  [
    //   { id: 4, version: 7, score: 0.99248314 },
    //   { id: 1, version: 7, score: 0.89463294 },
    //   {
    //     id: '98a9a4b1-4ef2-46fb-8315-a97d874fe1d7',
    //     version: 7,
    //     score: 0.8543979
    //   }
    // ]

    const resBatch = await client.queryBatch(collectionName, {
        searches: [
            {
                query: queryVector,
                limit: 1,
            },
            {
                query: queryVector,
                limit: 2,
            },
        ],
    });

    const batchPoints = resBatch.map(({points}) => points);

    console.log('query batch result: ', batchPoints);
    // prints:
    // query batch result:  [
    //   [ { id: 4, version: 7, score: 0.99248314 } ],
    //   [
    //     { id: 4, version: 7, score: 0.99248314 },
    //     { id: 1, version: 7, score: 0.89463294 }
    //   ]
    // ]

    // -------- Query filters ----------------

    const res2 = await client.query(collectionName, {
        query: queryVector,
        limit: 3,
        filter: {
            must: [
                {
                    key: 'city',
                    match: {
                        value: 'Berlin',
                    },
                },
            ],
        },
    });

    console.log('query result with filter: ', res2.points);
    // prints:
    // query result with filter:  [
    //   { id: 1, version: 7, score: 0.89463294 },
    //   { id: 3, version: 7, score: 0.83872515 },
    //   { id: 2, version: 7, score: 0.66603535 }
    // ]

    return 0;
}

main()
    .then((code) => {
        process.exit(code);
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
