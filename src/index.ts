import {QdrantClient} from './qdrant-client.js';
import {Transport, createPromiseClient} from '@bufbuild/connect';
import {createGrpcTransport} from '@bufbuild/connect-node';
import {Qdrant} from './proto/qdrant_connect.js';
import {Collections} from './proto/collections_service_connect.js';
import {ListCollectionsRequest} from './proto/collections_pb.js';

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
    const apiKey = process.env.API_KEY;
    if (typeof apiKey !== 'string') {
        throw new Error('Please specify env API_KEY');
    }

    const client = new QdrantClient({
        url: 'https://dae09be3-9fe1-496a-a28d-5e3a2279c530.us-east-1-0.aws.cloud.qdrant.io:6333',
        apiKey,
    });
    const result = await client.api('service').telemetry({});

    console.log(result);

    const headers = new Headers();
    headers.set('api-key', apiKey);
    // A transport for clients using the gRPC protocol with Node.js `http2` module
    const transport: Transport = createGrpcTransport({
        baseUrl: 'https://dae09be3-9fe1-496a-a28d-5e3a2279c530.us-east-1-0.aws.cloud.qdrant.io:6334',
        httpVersion: '2',
    });

    const grpcClient1 = createPromiseClient(Qdrant, transport);
    const res1 = await grpcClient1.healthCheck({}, {headers});

    console.log(res1);

    const grpcClient2 = createPromiseClient(Collections, transport);
    const res2 = await grpcClient2.list(new ListCollectionsRequest(), {headers});

    console.log(res2);

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
