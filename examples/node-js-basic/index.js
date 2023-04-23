let { QdrantClient } = require('@qdrant/js-client-rest');
const assert = require('assert');


let client = new QdrantClient({ url: 'http://127.0.0.1:6333' });

let collectionName = 'test_collection';

const run = async () => {

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

    assert(collectionInfo.points_count === 6);

    let points = await client.retrieve(collectionName, {
        ids: [1, 2]
    });


    // Convert into map
    let idToPoints = points.reduce((acc, point) => {
        acc[point.id] = point;
        return acc;
    }, {});


    assert(idToPoints[1].id === 1);
    assert(idToPoints[1].payload.city === "Berlin");
    assert(idToPoints[1].payload.count === 1000000);
    assert(idToPoints[1].payload.coords.lat === 1.0);
    assert(idToPoints[1].payload.coords.lon === 2.0);

    assert(idToPoints[2].id === 2);
    assert(idToPoints[2].payload.city[0] === "Berlin");
    assert(idToPoints[2].payload.city[1] === "London");


    // -------- Search ----------------
    let query_vector = [0.2, 0.1, 0.9, 0.7];


    let res1 = await client.search(collectionName, {
        vector: query_vector,
        limit: 3,
    });

    assert(res1.length === 3);

    let resBatch = await client.searchBatch(collectionName, {
        searches: [
            {
                vector: query_vector,
                limit: 3,
            },
            {
                vector: query_vector,
                limit: 3,
            }
        ]
    });

    assert(resBatch.length === 2);
    assert(resBatch[0].length === 3);
    assert(resBatch[1].length === 3);


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


    let res1Ids = res1.map((point) => point.id);
    let res2Ids = res2.map((point) => point.id);

    assert(res1Ids.length === 3);
    assert(res2Ids.length === 3);

    assert(res1Ids[0] != res2Ids[0]);
}

run().then(() => {
    console.log('done');
}).catch((err) => {
    console.error(err);
});
