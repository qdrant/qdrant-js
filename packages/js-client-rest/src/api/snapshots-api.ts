import {TypedFetch} from '@qdrant/openapi-typescript-fetch';
import {Client} from '../api-client.js';
import {components} from '../openapi/generated_schema.js';

export type SnapshotsApi = {
    createFullSnapshot: TypedFetch<{
        parameters: {
            query?: {
                wait?: boolean;
            };
        };
        responses: {
            200: {
                content: {
                    'application/json': {
                        time?: number;
                        status?: string;
                        result?: components['schemas']['SnapshotDescription'];
                    };
                };
            };
            202: {
                content: {
                    'application/json': {
                        time?: number;
                        status?: string;
                    };
                };
            };
            default: {
                content: {
                    'application/json': components['schemas']['ErrorResponse'];
                };
            };
            '4XX': {
                content: {
                    'application/json': components['schemas']['ErrorResponse'];
                };
            };
        };
    }>;

    createSnapshot: TypedFetch<{
        parameters: {
            query?: {
                wait?: boolean;
            };
            path: {
                collection_name: string;
            };
        };
        responses: {
            200: {
                content: {
                    'application/json': {
                        time?: number;
                        status?: string;
                        result?: components['schemas']['SnapshotDescription'];
                    };
                };
            };
            202: {
                content: {
                    'application/json': {
                        time?: number;
                        status?: string;
                    };
                };
            };
            default: {
                content: {
                    'application/json': components['schemas']['ErrorResponse'];
                };
            };
            '4XX': {
                content: {
                    'application/json': components['schemas']['ErrorResponse'];
                };
            };
        };
    }>;

    deleteFullSnapshot: TypedFetch<{
        parameters: {
            query?: {
                wait?: boolean;
            };
            path: {
                snapshot_name: string;
            };
        };
        responses: {
            200: {
                content: {
                    'application/json': {
                        time?: number;
                        status?: string;
                        result?: boolean;
                    };
                };
            };
            202: {
                content: {
                    'application/json': {
                        time?: number;
                        status?: string;
                    };
                };
            };
            default: {
                content: {
                    'application/json': components['schemas']['ErrorResponse'];
                };
            };
            '4XX': {
                content: {
                    'application/json': components['schemas']['ErrorResponse'];
                };
            };
        };
    }>;

    deleteSnapshot: TypedFetch<{
        parameters: {
            query?: {
                wait?: boolean;
            };
            path: {
                collection_name: string;
                snapshot_name: string;
            };
        };
        responses: {
            200: {
                content: {
                    'application/json': {
                        time?: number;
                        status?: string;
                        result?: boolean;
                    };
                };
            };
            202: {
                content: {
                    'application/json': {
                        time?: number;
                        status?: string;
                    };
                };
            };
            default: {
                content: {
                    'application/json': components['schemas']['ErrorResponse'];
                };
            };
            '4XX': {
                content: {
                    'application/json': components['schemas']['ErrorResponse'];
                };
            };
        };
    }>;

    getFullSnapshot: TypedFetch<{
        parameters: {
            path: {
                snapshot_name: string;
            };
        };
        responses: {
            200: {
                content: {
                    'application/octet-stream': string;
                };
            };
            default: {
                content: {
                    'application/json': components['schemas']['ErrorResponse'];
                };
            };
            '4XX': {
                content: {
                    'application/json': components['schemas']['ErrorResponse'];
                };
            };
        };
    }>;

    getSnapshot: TypedFetch<{
        parameters: {
            path: {
                collection_name: string;
                snapshot_name: string;
            };
        };
        responses: {
            200: {
                content: {
                    'application/octet-stream': string;
                };
            };
            default: {
                content: {
                    'application/json': components['schemas']['ErrorResponse'];
                };
            };
            '4XX': {
                content: {
                    'application/json': components['schemas']['ErrorResponse'];
                };
            };
        };
    }>;

    listFullSnapshots: TypedFetch<{
        responses: {
            200: {
                content: {
                    'application/json': {
                        usage?: components['schemas']['HardwareUsage'] | (Record<string, unknown> | null);
                        time?: number;
                        status?: string;
                        result?: components['schemas']['SnapshotDescription'][];
                    };
                };
            };
            default: {
                content: {
                    'application/json': components['schemas']['ErrorResponse'];
                };
            };
            '4XX': {
                content: {
                    'application/json': components['schemas']['ErrorResponse'];
                };
            };
        };
    }>;

    listSnapshots: TypedFetch<{
        parameters: {
            path: {
                collection_name: string;
            };
        };
        responses: {
            200: {
                content: {
                    'application/json': {
                        usage?: components['schemas']['HardwareUsage'] | (Record<string, unknown> | null);
                        time?: number;
                        status?: string;
                        result?: components['schemas']['SnapshotDescription'][];
                    };
                };
            };
            default: {
                content: {
                    'application/json': components['schemas']['ErrorResponse'];
                };
            };
            '4XX': {
                content: {
                    'application/json': components['schemas']['ErrorResponse'];
                };
            };
        };
    }>;

    recoverFromUploadedSnapshot: TypedFetch<{
        parameters: {
            query?: {
                wait?: boolean;
                priority?: components['schemas']['SnapshotPriority'];
                checksum?: string;
            };
            path: {
                collection_name: string;
            };
        };
        requestBody?: {
            content: {
                'multipart/form-data': {
                    snapshot?: string;
                };
            };
        };
        responses: {
            200: {
                content: {
                    'application/json': {
                        time?: number;
                        status?: string;
                        result?: boolean;
                    };
                };
            };
            202: {
                content: {
                    'application/json': {
                        time?: number;
                        status?: string;
                    };
                };
            };
            default: {
                content: {
                    'application/json': components['schemas']['ErrorResponse'];
                };
            };
            '4XX': {
                content: {
                    'application/json': components['schemas']['ErrorResponse'];
                };
            };
        };
    }>;

    recoverFromSnapshot: TypedFetch<{
        parameters: {
            query?: {
                wait?: boolean;
            };
            path: {
                collection_name: string;
            };
        };
        requestBody?: {
            content: {
                'application/json': components['schemas']['SnapshotRecover'];
            };
        };
        responses: {
            200: {
                content: {
                    'application/json': {
                        time?: number;
                        status?: string;
                        result?: boolean;
                    };
                };
            };
            202: {
                content: {
                    'application/json': {
                        time?: number;
                        status?: string;
                    };
                };
            };
            default: {
                content: {
                    'application/json': components['schemas']['ErrorResponse'];
                };
            };
            '4XX': {
                content: {
                    'application/json': components['schemas']['ErrorResponse'];
                };
            };
        };
    }>;

    recoverShardFromUploadedSnapshot: TypedFetch<{
        parameters: {
            query?: {
                wait?: boolean;
                priority?: components['schemas']['SnapshotPriority'];
                checksum?: string;
            };
            path: {
                collection_name: string;
                shard_id: number;
            };
        };
        requestBody?: {
            content: {
                'multipart/form-data': {
                    snapshot?: string;
                };
            };
        };
        responses: {
            200: {
                content: {
                    'application/json': {
                        time?: number;
                        status?: string;
                        result?: boolean;
                    };
                };
            };
            202: {
                content: {
                    'application/json': {
                        time?: number;
                        status?: string;
                    };
                };
            };
            default: {
                content: {
                    'application/json': components['schemas']['ErrorResponse'];
                };
            };
            '4XX': {
                content: {
                    'application/json': components['schemas']['ErrorResponse'];
                };
            };
        };
    }>;

    recoverShardFromSnapshot: TypedFetch<{
        parameters: {
            query?: {
                wait?: boolean;
            };
            path: {
                collection_name: string;
                shard_id: number;
            };
        };
        requestBody?: {
            content: {
                'application/json': components['schemas']['ShardSnapshotRecover'];
            };
        };
        responses: {
            200: {
                content: {
                    'application/json': {
                        time?: number;
                        status?: string;
                        result?: boolean;
                    };
                };
            };
            202: {
                content: {
                    'application/json': {
                        time?: number;
                        status?: string;
                    };
                };
            };
            default: {
                content: {
                    'application/json': components['schemas']['ErrorResponse'];
                };
            };
            '4XX': {
                content: {
                    'application/json': components['schemas']['ErrorResponse'];
                };
            };
        };
    }>;

    listShardSnapshots: TypedFetch<{
        parameters: {
            path: {
                collection_name: string;
                shard_id: number;
            };
        };
        responses: {
            200: {
                content: {
                    'application/json': {
                        usage?: components['schemas']['HardwareUsage'] | (Record<string, unknown> | null);
                        time?: number;
                        status?: string;
                        result?: components['schemas']['SnapshotDescription'][];
                    };
                };
            };
            default: {
                content: {
                    'application/json': components['schemas']['ErrorResponse'];
                };
            };
            '4XX': {
                content: {
                    'application/json': components['schemas']['ErrorResponse'];
                };
            };
        };
    }>;

    createShardSnapshot: TypedFetch<{
        parameters: {
            query?: {
                wait?: boolean;
            };
            path: {
                collection_name: string;
                shard_id: number;
            };
        };
        responses: {
            200: {
                content: {
                    'application/json': {
                        time?: number;
                        status?: string;
                        result?: components['schemas']['SnapshotDescription'];
                    };
                };
            };
            202: {
                content: {
                    'application/json': {
                        time?: number;
                        status?: string;
                    };
                };
            };
            default: {
                content: {
                    'application/json': components['schemas']['ErrorResponse'];
                };
            };
            '4XX': {
                content: {
                    'application/json': components['schemas']['ErrorResponse'];
                };
            };
        };
    }>;

    getShardSnapshot: TypedFetch<{
        parameters: {
            path: {
                collection_name: string;
                shard_id: number;
                snapshot_name: string;
            };
        };
        responses: {
            200: {
                content: {
                    'application/octet-stream': string;
                };
            };
            default: {
                content: {
                    'application/json': components['schemas']['ErrorResponse'];
                };
            };
            '4XX': {
                content: {
                    'application/json': components['schemas']['ErrorResponse'];
                };
            };
        };
    }>;

    deleteShardSnapshot: TypedFetch<{
        parameters: {
            query?: {
                wait?: boolean;
            };
            path: {
                collection_name: string;
                shard_id: number;
                snapshot_name: string;
            };
        };
        responses: {
            200: {
                content: {
                    'application/json': {
                        time?: number;
                        status?: string;
                        result?: boolean;
                    };
                };
            };
            202: {
                content: {
                    'application/json': {
                        time?: number;
                        status?: string;
                    };
                };
            };
            default: {
                content: {
                    'application/json': components['schemas']['ErrorResponse'];
                };
            };
            '4XX': {
                content: {
                    'application/json': components['schemas']['ErrorResponse'];
                };
            };
        };
    }>;
};

export function createSnapshotsApi(client: Client): SnapshotsApi {
    return {
        /**
         * Create new snapshot of the whole storage
         */
        createFullSnapshot: client.path('/snapshots').method('post').create({wait: true}),

        /**
         * Create new snapshot for a collection
         */
        createSnapshot: client.path('/collections/{collection_name}/snapshots').method('post').create({wait: true}),

        /**
         * Delete snapshot of the whole storage
         */
        deleteFullSnapshot: client.path('/snapshots/{snapshot_name}').method('delete').create({wait: true}),

        /**
         * Delete snapshot for a collection
         */
        deleteSnapshot: client
            .path('/collections/{collection_name}/snapshots/{snapshot_name}')
            .method('delete')
            .create({wait: true}),

        /**
         * Download specified snapshot of the whole storage as a file
         * @todo Fetcher needs to handle Blob for file downloads
         */
        getFullSnapshot: client.path('/snapshots/{snapshot_name}').method('get').create(),

        /**
         * Download specified snapshot from a collection as a file
         * @todo Fetcher needs to handle Blob for file downloads
         */
        getSnapshot: client.path('/collections/{collection_name}/snapshots/{snapshot_name}').method('get').create(),

        /**
         * Get list of snapshots of the whole storage
         */
        listFullSnapshots: client.path('/snapshots').method('get').create(),

        /**
         * Get list of snapshots for a collection
         */
        listSnapshots: client.path('/collections/{collection_name}/snapshots').method('get').create(),

        /**
         * Recover local collection data from an uploaded snapshot. This will overwrite any data, stored on this node, for the collection. If collection does not exist - it will be created.
         */
        recoverFromUploadedSnapshot: client
            .path('/collections/{collection_name}/snapshots/upload')
            .method('post')
            .create({wait: true, priority: true, checksum: true}),

        /**
         * Recover local collection data from a snapshot. This will overwrite any data, stored on this node, for the collection. If collection does not exist - it will be created
         */
        recoverFromSnapshot: client
            .path('/collections/{collection_name}/snapshots/recover')
            .method('put')
            .create({wait: true}),

        /**
         * Recover shard of a local collection from an uploaded snapshot. This will overwrite any data, stored on this node, for the collection shard
         */
        recoverShardFromUploadedSnapshot: client
            .path('/collections/{collection_name}/shards/{shard_id}/snapshots/upload')
            .method('post')
            .create({wait: true, priority: true, checksum: true}),

        /**
         * Recover shard of a local collection data from a snapshot. This will overwrite any data, stored in this shard, for the collection
         */
        recoverShardFromSnapshot: client
            .path('/collections/{collection_name}/shards/{shard_id}/snapshots/recover')
            .method('put')
            .create({wait: true}),

        /**
         * Get list of snapshots for a shard of a collection
         */
        listShardSnapshots: client
            .path('/collections/{collection_name}/shards/{shard_id}/snapshots')
            .method('get')
            .create(),

        /**
         * Create new snapshot of a shard for a collection
         */
        createShardSnapshot: client
            .path('/collections/{collection_name}/shards/{shard_id}/snapshots')
            .method('post')
            .create({wait: true}),

        /**
         * Download specified snapshot of a shard from a collection as a file
         */
        getShardSnapshot: client
            .path('/collections/{collection_name}/shards/{shard_id}/snapshots/{snapshot_name}')
            .method('get')
            .create(),

        /**
         * Delete snapshot of a shard for a collection
         */
        deleteShardSnapshot: client
            .path('/collections/{collection_name}/shards/{shard_id}/snapshots/{snapshot_name}')
            .method('delete')
            .create({wait: true}),
    } as const;
}
