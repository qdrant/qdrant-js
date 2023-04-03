import {maybe} from '@sevinf/maybe';
import {Transport, createPromiseClient} from '@bufbuild/connect';
import {createGrpcTransport} from '@bufbuild/connect-node';
import {Qdrant} from '../src/proto/qdrant_connect.js';

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

    const client = createPromiseClient(Qdrant, transport);
    const result = await client.healthCheck({}, {headers});

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
