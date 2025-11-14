import {Code, ConnectError, createClient, Interceptor, Client, Transport} from '@connectrpc/connect';
import {compressionGzip, createGrpcTransport} from '@connectrpc/connect-node';
import {Collections} from './proto/collections_service_pb.js';
import {Points} from './proto/points_service_pb.js';
import {Snapshots} from './proto/snapshots_service_pb.js';
import {Qdrant} from './proto/qdrant_pb.js';
import {PACKAGE_VERSION} from './client-version.js';
import {QdrantClientResourceExhaustedError} from './errors.js';

type Clients = {
    collections: Client<typeof Collections>;
    points: Client<typeof Points>;
    snapshots: Client<typeof Snapshots>;
    service: Client<typeof Qdrant>;
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
                collections = createClient(Collections, transport);
            }
            return collections;
        },
        get points() {
            if (!points) {
                points = createClient(Points, transport);
            }
            return points;
        },
        get snapshots() {
            if (!snapshots) {
                snapshots = createClient(Snapshots, transport);
            }
            return snapshots;
        },
        get service() {
            if (!service) {
                service = createClient(Qdrant, transport);
            }
            return service;
        },
    } satisfies Clients;
}

export function createApis(baseUrl: string, {timeout, apiKey}: {timeout: number; apiKey?: string}): GrpcClients {
    const interceptors: Interceptor[] = [
        (next) => (req) => {
            req.header.set('user-agent', 'qdrant-js/' + String(PACKAGE_VERSION));
            return next(req);
        },
        (next) => (req) =>
            next(req).catch((error) => {
                if (error instanceof ConnectError && error.code === Code.ResourceExhausted) {
                    const retryAfterHeader = error.metadata.get('retry-after')?.[0];
                    if (retryAfterHeader) {
                        throw new QdrantClientResourceExhaustedError(error.rawMessage, retryAfterHeader);
                    }
                }
                throw error;
            }),
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
        useBinaryFormat: true,
        sendCompression: compressionGzip,
        acceptCompression: [compressionGzip],
        interceptors,
    });

    return createClients(transport);
}
