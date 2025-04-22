import {TypedFetch} from '@qdrant/openapi-typescript-fetch';
import {Client} from '../api-client.js';
import {components} from '../openapi/generated_schema.js';

export type ClusterApi = {
    clusterStatus: TypedFetch<{
        responses: {
            200: {
                content: {
                    'application/json': {
                        usage?: components['schemas']['HardwareUsage'] | (Record<string, unknown> | null);
                        time?: number;
                        status?: string;
                        result?: components['schemas']['ClusterStatus'];
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

    recoverCurrentPeer: TypedFetch<{
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

    removePeer: TypedFetch<{
        parameters: {
            query?: {
                force?: boolean;
            };
            path: {
                peer_id: number;
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

export function createClusterApi(client: Client): ClusterApi {
    return {
        /**
         * Get information about the current state and composition of the cluster
         */
        clusterStatus: client.path('/cluster').method('get').create(),

        /**
         * Get cluster information for a collection
         */
        collectionClusterInfo: client.path('/collections/{collection_name}/cluster').method('get').create(),

        recoverCurrentPeer: client.path('/cluster/recover').method('post').create(),

        /**
         * Tries to remove peer from the cluster. Will return an error if peer has shards on it.
         */
        removePeer: client.path('/cluster/peer/{peer_id}').method('delete').create({force: true}),

        updateCollectionCluster: client
            .path('/collections/{collection_name}/cluster')
            .method('post')
            .create({timeout: true}),
    } as const;
}
