let { QdrantClient } = require('@qdrant/js-client-rest');


async function main() {

    let collectionName = 'test_collection';

    let client = new QdrantClient({ url: 'http://127.0.0.1:6333' });

    let response = await client.getCollections();

    let collectionNames = response.collections.map((collection) => collection.name);

    if (collectionNames.includes(collectionName)) {
        await client.deleteCollection(collectionName);
    }

    await client.createCollection(
        collectionName,
        {
            vectors: {
                size: 4,
                distance: 'Cosine'
            },
            optimizers_config: {
                default_segment_number: 2,
            },
            replication_factor: 2,
        }
    );


    //  -------- Create payload indexes -------------

    await client.createPayloadIndex(collectionName, {
        field_name: "city",
        field_schema: "keyword",
        wait: true
    });


    await client.createPayloadIndex(collectionName, {
        field_name: "count",
        field_schema: "integer",
        wait: true
    });

    await client.createPayloadIndex(collectionName, {
        field_name: "coords",
        field_schema: "geo",
        wait: true
    });

    //  -------- Add points -------------

    await client.upsert(
        collectionName,
        {
            wait: true,
            points: [
                {
                    "id": 1,
                    "vector": [0.05, 0.61, 0.76, 0.74],
                    "payload": {
                        "city": "Berlin",
                        "country": "Germany",
                        "count": 1000000,
                        "square": 12.5,
                        "coords": { "lat": 1.0, "lon": 2.0 }
                    }
                },
                { "id": 2, "vector": [0.19, 0.81, 0.75, 0.11], "payload": { "city": ["Berlin", "London"] } },
                { "id": 3, "vector": [0.36, 0.55, 0.47, 0.94], "payload": { "city": ["Berlin", "Moscow"] } },
                { "id": 4, "vector": [0.18, 0.01, 0.85, 0.80], "payload": { "city": ["London", "Moscow"] } },
                { "id": "98a9a4b1-4ef2-46fb-8315-a97d874fe1d7", "vector": [0.24, 0.18, 0.22, 0.44], "payload": { "count": [0] } },
                { "id": "f0e09527-b096-42a8-94e9-ea94d342b925", "vector": [0.35, 0.08, 0.11, 0.44] }
            ]
        }
    );

    let collectionInfo = await client.getCollection(collectionName);
    console.log(collectionInfo.points_count)
    // prints: 6

    let points = await client.retrieve(collectionName, {
        ids: [1, 2]
    });


    console.log("points: ", points);
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



    // -------- Search ----------------
    let query_vector = [0.2, 0.1, 0.9, 0.7];


    let res1 = await client.search(collectionName, {
        vector: query_vector,
        limit: 3,
    });

    console.log("search result: ", res1);
    // prints:
    // search result:  [
    // {
    //     id: 4,
    //     version: 3,
    //     score: 0.99248314,
    //     payload: { city: [Array] },
    //     vector: null
    // },
    // {
    //     id: 1,
    //     version: 3,
    //     score: 0.89463294,
    //     payload: {
    //         city: 'Berlin',
    //         coords: [Object],
    //         count: 1000000,
    //         country: 'Germany',
    //         square: 12.5
    //     },
    //     vector: null
    // },
    // {
    //     id: '98a9a4b1-4ef2-46fb-8315-a97d874fe1d7',
    //     version: 3,
    //     score: 0.8543979,
    //     payload: { count: [Array] },
    //     vector: null
    // }
    // ]



    let resBatch = await client.searchBatch(collectionName, {
        searches: [
            {
                vector: query_vector,
                limit: 1,
            },
            {
                vector: query_vector,
                limit: 2,
            }
        ]
    });

    console.log("search batch result: ", resBatch);

    // prints:
    // search batch result:  [
    //     [
    //         {
    //             id: 4,
    //             version: 3,
    //             score: 0.99248314,
    //             payload: null,
    //             vector: null
    //         }
    //     ],
    //     [
    //         {
    //             id: 4,
    //             version: 3,
    //             score: 0.99248314,
    //             payload: null,
    //             vector: null
    //         },
    //         {
    //             id: 1,
    //             version: 3,
    //             score: 0.89463294,
    //             payload: null,
    //             vector: null
    //         }
    //     ]
    // ]



    // -------- Search filters ----------------

    let res2 = await client.search(collectionName, {
        vector: query_vector,
        limit: 3,
        filter: {
            must: [
                {
                    "key": "city",
                    "match": {
                        "value": "Berlin"
                    }
                }
            ]
        }
    });

    console.log("search result with filter: ", res2);
    // prints:
    // search result with filter:  [
    //     {
    //       id: 1,
    //       version: 3,
    //       score: 0.89463294,
    //       payload: {
    //         city: 'Berlin',
    //         coords: [Object],
    //         count: 1000000,
    //         country: 'Germany',
    //         square: 12.5
    //       },
    //       vector: null
    //     },
    //     {
    //       id: 3,
    //       version: 3,
    //       score: 0.83872515,
    //       payload: { city: [Array] },
    //       vector: null
    //     },
    //     {
    //       id: 2,
    //       version: 3,
    //       score: 0.66603535,
    //       payload: { city: [Array] },
    //       vector: null
    //     }
    // ]
}

main()
    .then(() => {
        console.log('done');
    }).catch((err) => {
        console.error(err);
    });
