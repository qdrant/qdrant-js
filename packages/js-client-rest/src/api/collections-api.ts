import {TypedFetch} from '@qdrant/openapi-typescript-fetch';
import {Client} from '../api-client.js';
import {components} from '../openapi/generated_schema.js';

export type CollectionsApi = {
    collectionClusterInfo: TypedFetch<{
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
                        result?: components['schemas']['CollectionClusterInfo'];
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

    createCollection: TypedFetch<{
        parameters: {
            query?: {
                timeout?: number;
            };
            path: {
                collection_name: string;
            };
        };
        requestBody?: {
            content: {
                'application/json': components['schemas']['CreateCollection'];
            };
        };
        responses: {
            200: {
                content: {
                    'application/json': {
                        usage?: components['schemas']['HardwareUsage'] | (Record<string, unknown> | null);
                        time?: number;
                        status?: string;
                        result?: boolean;
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

    createFieldIndex: TypedFetch<{
        parameters: {
            query?: {
                wait?: boolean;
                ordering?: components['schemas']['WriteOrdering'];
            };
            path: {
                collection_name: string;
            };
        };
        requestBody?: {
            content: {
                'application/json': components['schemas']['CreateFieldIndex'];
            };
        };
        responses: {
            200: {
                content: {
                    'application/json': {
                        usage?: components['schemas']['HardwareUsage'] | (Record<string, unknown> | null);
                        time?: number;
                        status?: string;
                        result?: components['schemas']['UpdateResult'];
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

    deleteCollection: TypedFetch<{
        parameters: {
            query?: {
                timeout?: number;
            };
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
                        result?: boolean;
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

    deleteFieldIndex: TypedFetch<{
        parameters: {
            query?: {
                wait?: boolean;
                ordering?: components['schemas']['WriteOrdering'];
            };
            path: {
                collection_name: string;
                field_name: string;
            };
        };
        responses: {
            200: {
                content: {
                    'application/json': {
                        usage?: components['schemas']['HardwareUsage'] | (Record<string, unknown> | null);
                        time?: number;
                        status?: string;
                        result?: components['schemas']['UpdateResult'];
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

    deleteSnapshots: TypedFetch<{
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

    getCollection: TypedFetch<{
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
                        result?: components['schemas']['CollectionInfo'];
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

    getCollectionAliases: TypedFetch<{
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
                        result?: components['schemas']['CollectionsAliasesResponse'];
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

    getCollections: TypedFetch<{
        responses: {
            200: {
                content: {
                    'application/json': {
                        usage?: components['schemas']['HardwareUsage'] | (Record<string, unknown> | null);
                        time?: number;
                        status?: string;
                        result?: components['schemas']['CollectionsResponse'];
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

    getCollectionsAliases: TypedFetch<{
        responses: {
            200: {
                content: {
                    'application/json': {
                        usage?: components['schemas']['HardwareUsage'] | (Record<string, unknown> | null);
                        time?: number;
                        status?: string;
                        result?: components['schemas']['CollectionsAliasesResponse'];
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

    collectionExists: TypedFetch<{
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
                        result?: components['schemas']['CollectionExistence'];
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

    updateAliases: TypedFetch<{
        parameters: {
            query?: {
                timeout?: number;
            };
        };
        requestBody?: {
            content: {
                'application/json': components['schemas']['ChangeAliasesOperation'];
            };
        };
        responses: {
            200: {
                content: {
                    'application/json': {
                        usage?: components['schemas']['HardwareUsage'] | (Record<string, unknown> | null);
                        time?: number;
                        status?: string;
                        result?: boolean;
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

    updateCollection: TypedFetch<{
        parameters: {
            query?: {
                timeout?: number;
            };
            path: {
                collection_name: string;
            };
        };
        requestBody?: {
            content: {
                'application/json': components['schemas']['UpdateCollection'];
            };
        };
        responses: {
            200: {
                content: {
                    'application/json': {
                        usage?: components['schemas']['HardwareUsage'] | (Record<string, unknown> | null);
                        time?: number;
                        status?: string;
                        result?: boolean;
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

    updateCollectionCluster: TypedFetch<{
        parameters: {
            query?: {
                timeout?: number;
            };
            path: {
                collection_name: string;
            };
        };
        requestBody?: {
            content: {
                'application/json': components['schemas']['ClusterOperations'];
            };
        };
        responses: {
            200: {
                content: {
                    'application/json': {
                        usage?: components['schemas']['HardwareUsage'] | (Record<string, unknown> | null);
                        time?: number;
                        status?: string;
                        result?: boolean;
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

export function createCollectionsApi(client: Client): CollectionsApi {
    return {
        /**
         * Get cluster information for a collection
         */
        collectionClusterInfo: client.path('/collections/{collection_name}/cluster').method('get').create(),

        /**
         * Create new collection with given parameters
         */
        createCollection: client.path('/collections/{collection_name}').method('put').create({timeout: true}),

        /**
         * Create index for field in collection
         */
        createFieldIndex: client
            .path('/collections/{collection_name}/index')
            .method('put')
            .create({ordering: true, wait: true}),

        /**
         * Create new snapshot for a collection
         */
        createSnapshot: client.path('/collections/{collection_name}/snapshots').method('post').create({wait: true}),

        /**
         * Drop collection and all associated data
         */
        deleteCollection: client.path('/collections/{collection_name}').method('delete').create({timeout: true}),

        /**
         * Delete field index for collection
         */
        deleteFieldIndex: client
            .path('/collections/{collection_name}/index/{field_name}')
            .method('delete')
            .create({ordering: true, wait: true}),

        /**
         * Delete snapshot for a collection
         */
        deleteSnapshots: client
            .path('/collections/{collection_name}/snapshots/{snapshot_name}')
            .method('delete')
            .create({wait: true}),

        /**
         * Get detailed information about specified existing collection
         */
        getCollection: client.path('/collections/{collection_name}').method('get').create(),

        /**
         * Get list of all aliases for a collection
         */
        getCollectionAliases: client.path('/collections/{collection_name}/aliases').method('get').create(),

        /**
         * Get list name of all existing collections
         */
        getCollections: client.path('/collections').method('get').create(),

        /**
         * Get list of all existing collections aliases
         */
        getCollectionsAliases: client.path('/aliases').method('get').create(),

        /**
         * Check the existence of a collection
         */
        collectionExists: client.path('/collections/{collection_name}/exists').method('get').create(),

        /**
         * Download specified snapshot from a collection as a file
         * @todo Fetcher needs to handle Blob for file downloads
         */
        getSnapshot: client.path('/collections/{collection_name}/snapshots/{snapshot_name}').method('get').create(),

        /**
         * Get list of snapshots for a collection
         */
        listSnapshots: client.path('/collections/{collection_name}/snapshots').method('get').create(),

        updateAliases: client.path('/collections/aliases').method('post').create({timeout: true}),

        /**
         * Update parameters of the existing collection
         */
        updateCollection: client.path('/collections/{collection_name}').method('patch').create({timeout: true}),

        updateCollectionCluster: client
            .path('/collections/{collection_name}/cluster')
            .method('post')
            .create({timeout: true}),
    } as const;
}
