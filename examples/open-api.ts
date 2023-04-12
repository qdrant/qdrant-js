import {maybe} from '@sevinf/maybe';
import {QdrantClient} from '../src/qdrant-client.js';
import {Transport, createPromiseClient} from '@bufbuild/connect';
import {createGrpcTransport} from '@bufbuild/connect-node';
import {Qdrant} from '../src/proto/qdrant_connect.js';
import {Collections} from '../src/proto/collections_service_connect.js';
import {ListCollectionsRequest} from '../src/proto/collections_pb.js';

process.on('uncaughtException', (e) => {
    console.log(e);
});
process.on('unhandledRejection', (e, promise) => {
    console.log(String(e), String(promise));
});
// Listen to Ctr + C and exit
process.once('SIGINT', () => {
    process.exit(130);
});

async function main(): Promise<number> {
    const apiKey = maybe(process.env.QDRANT_API_KEY).orThrow();
    const url = maybe(process.env.QDRANT_URL).orThrow();

    // An instance of the client to issue requests to Open API endpoints
    const client = new QdrantClient({
        url,
        apiKey,
    });
    const result = await client.api('service').telemetry({anonymize: true});

    console.log(result);

    return 0;
}

main()
    .then((code) => {
        if (code !== 0) {
            process.exit(code);
        }
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
