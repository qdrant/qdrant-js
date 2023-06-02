import {Transport, Interceptor, createPromiseClient, PromiseClient} from '@bufbuild/connect';
import {createGrpcTransport, compressionGzip} from '@bufbuild/connect-node';
import {Collections} from './proto/collections_service_connect.js';
import {Points} from './proto/points_service_connect.js';
import {Snapshots} from './proto/snapshots_service_connect.js';
import {Qdrant} from './proto/qdrant_connect.js';

type Clients = {
    collections: PromiseClient<typeof Collections>;
    points: PromiseClient<typeof Points>;
    snapshots: PromiseClient<typeof Snapshots>;
    service: PromiseClient<typeof Qdrant>;
};

export type GrpcClients = Readonly<Clients>;

function createClients(transport: Transport) {
    let collections: Clients['collections'] | undefined;
    let points: Clients['points'] | undefined;
    let snapshots: Clients['snapshots'] | undefined;
    let service: Clients['service'] | undefined;
    return {
        get collections() {
            if (!collections) {
                collections = createPromiseClient(Collections, transport);
            }
            return collections;
        },
        get points() {
            if (!points) {
                points = createPromiseClient(Points, transport);
            }
            return points;
        },
        get snapshots() {
            if (!snapshots) {
                snapshots = createPromiseClient(Snapshots, transport);
            }
            return snapshots;
        },
        get service() {
            if (!service) {
                service = createPromiseClient(Qdrant, transport);
            }
            return service;
        },
    } satisfies Clients;
}

export function createApis(baseUrl: string, {timeout, apiKey}: {timeout: number; apiKey?: string}): GrpcClients {
    const interceptors: Interceptor[] = [
        (next) => (req) => {
            req.header.set('user-agent', 'qdrant-js');
            return next(req);
        },
    ];
    if (apiKey !== undefined) {
        interceptors.push((next) => (req) => {
            req.header.set('api-key', apiKey);
            return next(req);
        });
    }
    if (Number.isFinite(timeout)) {
        interceptors.push((next) => async (req) => {
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), timeout);

            try {
                return await next(Object.assign(req, {signal: controller.signal}));
            } finally {
                clearTimeout(id);
            }
        });
    }

    const transport = createGrpcTransport({
        baseUrl,
        httpVersion: '2',
        keepSessionAlive: true,
        useBinaryFormat: true,
        sendCompression: compressionGzip,
        acceptCompression: [compressionGzip],
        interceptors,
    });

    return createClients(transport);
}
