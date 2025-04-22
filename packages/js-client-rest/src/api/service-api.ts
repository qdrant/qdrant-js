import {TypedFetch} from '@qdrant/openapi-typescript-fetch';
import {Client} from '../api-client.js';
import {components} from '../openapi/generated_schema.js';

export type ServiceApi = {
    getLocks: TypedFetch<{
        responses: {
            200: {
                content: {
                    'application/json': {
                        usage?: components['schemas']['HardwareUsage'] | (Record<string, unknown> | null);
                        time?: number;
                        status?: string;
                        result?: components['schemas']['LocksOption'];
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

    metrics: TypedFetch<{
        parameters: {
            query?: {
                anonymize?: boolean;
            };
        };
        responses: {
            200: {
                content: {
                    'text/plain': string;
                };
            };
            '4XX': never;
        };
    }>;

    postLocks: TypedFetch<{
        requestBody?: {
            content: {
                'application/json': components['schemas']['LocksOption'];
            };
        };
        responses: {
            200: {
                content: {
                    'application/json': {
                        usage?: components['schemas']['HardwareUsage'] | (Record<string, unknown> | null);
                        time?: number;
                        status?: string;
                        result?: components['schemas']['LocksOption'];
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

    telemetry: TypedFetch<{
        parameters: {
            query?: {
                anonymize?: boolean;
                details_level?: number;
            };
        };
        responses: {
            200: {
                content: {
                    'application/json': {
                        usage?: components['schemas']['HardwareUsage'] | (Record<string, unknown> | null);
                        time?: number;
                        status?: string;
                        result?: components['schemas']['TelemetryData'];
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

    healthz: TypedFetch<{
        responses: {
            200: {
                content: {
                    'text/plain': string;
                };
            };
            '4XX': never;
        };
    }>;

    livez: TypedFetch<{
        responses: {
            200: {
                content: {
                    'text/plain': string;
                };
            };
            '4XX': never;
        };
    }>;

    readyz: TypedFetch<{
        responses: {
            200: {
                content: {
                    'text/plain': string;
                };
            };
            '4XX': never;
        };
    }>;

    root: TypedFetch<{
        responses: {
            200: {
                content: {
                    'application/json': components['schemas']['VersionInfo'];
                };
            };
            '4XX': never;
        };
    }>;

    getIssues: TypedFetch<{
        responses: {
            200: {
                content: {
                    'application/json': Record<string, never>;
                };
            };
            '4XX': never;
        };
    }>;

    clearIssues: TypedFetch<{
        responses: {
            200: {
                content: {
                    'application/json': boolean;
                };
            };
            '4XX': never;
        };
    }>;
};

export function createServiceApi(client: Client): ServiceApi {
    return {
        /**
         * Get lock options. If write is locked, all write operations and collection creation are forbidden
         */
        getLocks: client.path('/locks').method('get').create(),

        /**
         * Collect metrics data including app info, collections info, cluster info and statistics
         */
        metrics: client.path('/metrics').method('get').create(),

        /**
         * Set lock options. If write is locked, all write operations and collection creation are forbidden. Returns previous lock options
         */
        postLocks: client.path('/locks').method('post').create(),

        /**
         * Collect telemetry data including app info, system info, collections info, cluster info, configs and statistics
         */
        telemetry: client.path('/telemetry').method('get').create(),

        /**
         * An endpoint for health checking used in Kubernetes.
         */
        healthz: client.path('/healthz').method('get').create(),

        /**
         * An endpoint for health checking used in Kubernetes.
         */
        livez: client.path('/livez').method('get').create(),

        /**
         * An endpoint for health checking used in Kubernetes.
         */
        readyz: client.path('/readyz').method('get').create(),

        /**
         * Returns information about the running Qdrant instance.
         */
        root: client.path('/').method('get').create(),

        /**
         * Get issues
         */
        getIssues: client.path('/issues').method('get').create(),

        /**
         * Clear issues
         */
        clearIssues: client.path('/issues').method('delete').create(),
    } as const;
}
