import {createServer, Http2Server, ServerHttp2Session} from 'node:http2';
import {AddressInfo} from 'node:net';
import {Code, ConnectError, ConnectRouter} from '@connectrpc/connect';
import {connectNodeAdapter} from '@connectrpc/connect-node';
import {afterEach, describe, expect, test} from 'vitest';
import {createApis} from '../../src/api-client.js';
import {QdrantClientResourceExhaustedError} from '../../src/errors.js';
import {Qdrant} from '../../src/proto/qdrant_pb.js';

describe('apiClient', () => {
    let server: Http2Server | undefined;
    const sessions = new Set<ServerHttp2Session>();

    afterEach(async () => {
        const current = server;
        server = undefined;
        if (current) {
            // The client keeps its HTTP/2 session open, so close it to let the server shut down.
            sessions.forEach((session) => session.destroy());
            sessions.clear();
            await new Promise<void>((resolve) => current.close(() => resolve()));
        }
    });

    const startServer = async (error: ConnectError) => {
        const routes = (router: ConnectRouter) =>
            router.service(Qdrant, {
                healthCheck() {
                    throw error;
                },
            });
        const current = createServer(connectNodeAdapter({routes}));
        current.on('session', (session) => sessions.add(session));
        server = current;
        await new Promise<void>((resolve) => current.listen(0, '127.0.0.1', resolve));
        return `http://127.0.0.1:${(current.address() as AddressInfo).port}`;
    };

    test('resource exhausted with retry-after', async () => {
        const baseUrl = await startServer(
            new ConnectError('rate limited', Code.ResourceExhausted, {'retry-after': '15'}),
        );
        const apis = createApis(baseUrl, {timeout: Infinity, compression: false});

        const error = await apis.service.healthCheck({}).catch((e: unknown) => e);

        expect(error).toBeInstanceOf(QdrantClientResourceExhaustedError);
        expect(error).toMatchObject({code: Code.ResourceExhausted, retry_after: 15});
    });

    test('other errors are not QdrantClientResourceExhaustedError', async () => {
        const baseUrl = await startServer(new ConnectError('not found', Code.NotFound));
        const apis = createApis(baseUrl, {timeout: Infinity, compression: false});

        const error = await apis.service.healthCheck({}).catch((e: unknown) => e);

        expect(error).toBeInstanceOf(ConnectError);
        expect(error).toMatchObject({code: Code.NotFound});
        expect(error).not.toBeInstanceOf(QdrantClientResourceExhaustedError);
    });
});
