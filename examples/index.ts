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
    const apiKey = process.env.API_KEY;
    const url = process.env.URL;
    if (typeof apiKey !== 'string' || typeof url !== 'string') {
        throw new Error('Please specify env API_KEY and URL');
    }

    const client = new QdrantClient({
        url,
        apiKey,
    });
    const result = await client.api('service').telemetry({anonymize: true});

    console.log(result);

    const headers = new Headers();
    headers.set('api-key', apiKey);
    // A transport for clients using the gRPC protocol with Node.js `http2` module
    const transport: Transport = createGrpcTransport({
        baseUrl: url,
        httpVersion: '2',
        nodeOptions: {
            port: 6334,
        },
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
