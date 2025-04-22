import {TypedFetch} from '@qdrant/openapi-typescript-fetch';
import {Client} from '../api-client.js';
import {components} from '../openapi/generated_schema.js';

export type ShardsApi = {
    createShardKey: TypedFetch<{
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
                'application/json': components['schemas']['CreateShardingKey'];
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

    deleteShardKey: TypedFetch<{
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
                'application/json': components['schemas']['DropShardingKey'];
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

export function createShardsApi(client: Client): ShardsApi {
    return {
        /**
         * Create shard key
         */
        createShardKey: client.path('/collections/{collection_name}/shards').method('put').create({timeout: true}),

        /**
         * Delete shard key
         */
        deleteShardKey: client
            .path('/collections/{collection_name}/shards/delete')
            .method('post')
            .create({timeout: true}),
    } as const;
}
