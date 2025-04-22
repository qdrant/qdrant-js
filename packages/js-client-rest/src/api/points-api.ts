import {TypedFetch} from '@qdrant/openapi-typescript-fetch';
import {Client} from '../api-client.js';
import {components} from '../openapi/generated_schema.js';

export type PointsApi = {
    clearPayload: TypedFetch<{
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
                'application/json': components['schemas']['PointsSelector'];
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

    countPoints: TypedFetch<{
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
                'application/json': components['schemas']['CountRequest'];
            };
        };
        responses: {
            200: {
                content: {
                    'application/json': {
                        usage?: components['schemas']['HardwareUsage'] | (Record<string, unknown> | null);
                        time?: number;
                        status?: string;
                        result?: components['schemas']['CountResult'];
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

    deletePayload: TypedFetch<{
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
                'application/json': components['schemas']['DeletePayload'];
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

    deletePoints: TypedFetch<{
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
                'application/json': components['schemas']['PointsSelector'];
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

    updateVectors: TypedFetch<{
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
                'application/json': components['schemas']['UpdateVectors'];
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

    deleteVectors: TypedFetch<{
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
                'application/json': components['schemas']['DeleteVectors'];
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

    getPoint: TypedFetch<{
        parameters: {
            query?: {
                consistency?: components['schemas']['ReadConsistency'];
            };
            path: {
                collection_name: string;
                id: components['schemas']['ExtendedPointId'];
            };
        };
        responses: {
            200: {
                content: {
                    'application/json': {
                        usage?: components['schemas']['HardwareUsage'] | (Record<string, unknown> | null);
                        time?: number;
                        status?: string;
                        result?: components['schemas']['Record'];
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

    getPoints: TypedFetch<{
        parameters: {
            query?: {
                consistency?: components['schemas']['ReadConsistency'];
                timeout?: number;
            };
            path: {
                collection_name: string;
            };
        };
        requestBody?: {
            content: {
                'application/json': components['schemas']['PointRequest'];
            };
        };
        responses: {
            200: {
                content: {
                    'application/json': {
                        usage?: components['schemas']['HardwareUsage'] | (Record<string, unknown> | null);
                        time?: number;
                        status?: string;
                        result?: components['schemas']['Record'][];
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

    overwritePayload: TypedFetch<{
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
                'application/json': components['schemas']['SetPayload'];
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

    recommendBatchPoints: TypedFetch<{
        parameters: {
            query?: {
                consistency?: components['schemas']['ReadConsistency'];
                timeout?: number;
            };
            path: {
                collection_name: string;
            };
        };
        requestBody?: {
            content: {
                'application/json': components['schemas']['RecommendRequestBatch'];
            };
        };
        responses: {
            200: {
                content: {
                    'application/json': {
                        usage?: components['schemas']['HardwareUsage'] | (Record<string, unknown> | null);
                        time?: number;
                        status?: string;
                        result?: components['schemas']['ScoredPoint'][][];
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

    recommendPoints: TypedFetch<{
        parameters: {
            query?: {
                consistency?: components['schemas']['ReadConsistency'];
                timeout?: number;
            };
            path: {
                collection_name: string;
            };
        };
        requestBody?: {
            content: {
                'application/json': components['schemas']['RecommendRequest'];
            };
        };
        responses: {
            200: {
                content: {
                    'application/json': {
                        usage?: components['schemas']['HardwareUsage'] | (Record<string, unknown> | null);
                        time?: number;
                        status?: string;
                        result?: components['schemas']['ScoredPoint'][];
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

    searchPointGroups: TypedFetch<{
        parameters: {
            query?: {
                consistency?: components['schemas']['ReadConsistency'];
                timeout?: number;
            };
            path: {
                collection_name: string;
            };
        };
        requestBody?: {
            content: {
                'application/json': components['schemas']['SearchGroupsRequest'];
            };
        };
        responses: {
            200: {
                content: {
                    'application/json': {
                        usage?: components['schemas']['HardwareUsage'] | (Record<string, unknown> | null);
                        time?: number;
                        status?: string;
                        result?: components['schemas']['GroupsResult'];
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

    scrollPoints: TypedFetch<{
        parameters: {
            query?: {
                consistency?: components['schemas']['ReadConsistency'];
                timeout?: number;
            };
            path: {
                collection_name: string;
            };
        };
        requestBody?: {
            content: {
                'application/json': components['schemas']['ScrollRequest'];
            };
        };
        responses: {
            200: {
                content: {
                    'application/json': {
                        usage?: components['schemas']['HardwareUsage'] | (Record<string, unknown> | null);
                        time?: number;
                        status?: string;
                        result?: components['schemas']['ScrollResult'];
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

    searchBatchPoints: TypedFetch<{
        parameters: {
            query?: {
                consistency?: components['schemas']['ReadConsistency'];
                timeout?: number;
            };
            path: {
                collection_name: string;
            };
        };
        requestBody?: {
            content: {
                'application/json': components['schemas']['SearchRequestBatch'];
            };
        };
        responses: {
            200: {
                content: {
                    'application/json': {
                        usage?: components['schemas']['HardwareUsage'] | (Record<string, unknown> | null);
                        time?: number;
                        status?: string;
                        result?: components['schemas']['ScoredPoint'][][];
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

    searchPoints: TypedFetch<{
        parameters: {
            query?: {
                consistency?: components['schemas']['ReadConsistency'];
                timeout?: number;
            };
            path: {
                collection_name: string;
            };
        };
        requestBody?: {
            content: {
                'application/json': components['schemas']['SearchRequest'];
            };
        };
        responses: {
            200: {
                content: {
                    'application/json': {
                        usage?: components['schemas']['HardwareUsage'] | (Record<string, unknown> | null);
                        time?: number;
                        status?: string;
                        result?: components['schemas']['ScoredPoint'][];
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

    setPayload: TypedFetch<{
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
                'application/json': components['schemas']['SetPayload'];
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

    upsertPoints: TypedFetch<{
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
                'application/json': components['schemas']['PointInsertOperations'];
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

    recommendPointGroups: TypedFetch<{
        parameters: {
            query?: {
                consistency?: components['schemas']['ReadConsistency'];
                timeout?: number;
            };
            path: {
                collection_name: string;
            };
        };
        requestBody?: {
            content: {
                'application/json': components['schemas']['RecommendGroupsRequest'];
            };
        };
        responses: {
            200: {
                content: {
                    'application/json': {
                        usage?: components['schemas']['HardwareUsage'] | (Record<string, unknown> | null);
                        time?: number;
                        status?: string;
                        result?: components['schemas']['GroupsResult'];
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

    batchUpdate: TypedFetch<{
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
                'application/json': components['schemas']['UpdateOperations'];
            };
        };
        responses: {
            200: {
                content: {
                    'application/json': {
                        usage?: components['schemas']['HardwareUsage'] | (Record<string, unknown> | null);
                        time?: number;
                        status?: string;
                        result?: components['schemas']['UpdateResult'][];
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

    discoverPoints: TypedFetch<{
        parameters: {
            query?: {
                consistency?: components['schemas']['ReadConsistency'];
                timeout?: number;
            };
            path: {
                collection_name: string;
            };
        };
        requestBody?: {
            content: {
                'application/json': components['schemas']['DiscoverRequest'];
            };
        };
        responses: {
            200: {
                content: {
                    'application/json': {
                        usage?: components['schemas']['HardwareUsage'] | (Record<string, unknown> | null);
                        time?: number;
                        status?: string;
                        result?: components['schemas']['ScoredPoint'][];
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

    discoverBatchPoints: TypedFetch<{
        parameters: {
            query?: {
                consistency?: components['schemas']['ReadConsistency'];
                timeout?: number;
            };
            path: {
                collection_name: string;
            };
        };
        requestBody?: {
            content: {
                'application/json': components['schemas']['DiscoverRequestBatch'];
            };
        };
        responses: {
            200: {
                content: {
                    'application/json': {
                        usage?: components['schemas']['HardwareUsage'] | (Record<string, unknown> | null);
                        time?: number;
                        status?: string;
                        result?: components['schemas']['ScoredPoint'][][];
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

    queryPoints: TypedFetch<{
        parameters: {
            query?: {
                consistency?: components['schemas']['ReadConsistency'];
                timeout?: number;
            };
            path: {
                collection_name: string;
            };
        };
        requestBody?: {
            content: {
                'application/json': components['schemas']['QueryRequest'];
            };
        };
        responses: {
            200: {
                content: {
                    'application/json': {
                        usage?: components['schemas']['HardwareUsage'] | (Record<string, unknown> | null);
                        time?: number;
                        status?: string;
                        result?: components['schemas']['QueryResponse'];
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

    queryBatchPoints: TypedFetch<{
        parameters: {
            query?: {
                consistency?: components['schemas']['ReadConsistency'];
                timeout?: number;
            };
            path: {
                collection_name: string;
            };
        };
        requestBody?: {
            content: {
                'application/json': components['schemas']['QueryRequestBatch'];
            };
        };
        responses: {
            200: {
                content: {
                    'application/json': {
                        usage?: components['schemas']['HardwareUsage'] | (Record<string, unknown> | null);
                        time?: number;
                        status?: string;
                        result?: components['schemas']['QueryResponse'][];
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

    queryPointsGroups: TypedFetch<{
        parameters: {
            query?: {
                consistency?: components['schemas']['ReadConsistency'];
                timeout?: number;
            };
            path: {
                collection_name: string;
            };
        };
        requestBody?: {
            content: {
                'application/json': components['schemas']['QueryGroupsRequest'];
            };
        };
        responses: {
            200: {
                content: {
                    'application/json': {
                        usage?: components['schemas']['HardwareUsage'] | (Record<string, unknown> | null);
                        time?: number;
                        status?: string;
                        result?: components['schemas']['GroupsResult'];
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

    facet: TypedFetch<{
        parameters: {
            query?: {
                timeout?: number;
                consistency?: components['schemas']['ReadConsistency'];
            };
            path: {
                collection_name: string;
            };
        };
        requestBody?: {
            content: {
                'application/json': components['schemas']['FacetRequest'];
            };
        };
        responses: {
            200: {
                content: {
                    'application/json': {
                        usage?: components['schemas']['HardwareUsage'] | (Record<string, unknown> | null);
                        time?: number;
                        status?: string;
                        result?: components['schemas']['FacetResponse'];
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

    searchMatrixPairs: TypedFetch<{
        parameters: {
            query?: {
                consistency?: components['schemas']['ReadConsistency'];
                timeout?: number;
            };
            path: {
                collection_name: string;
            };
        };
        requestBody?: {
            content: {
                'application/json': components['schemas']['SearchMatrixRequest'];
            };
        };
        responses: {
            200: {
                content: {
                    'application/json': {
                        usage?: components['schemas']['HardwareUsage'] | (Record<string, unknown> | null);
                        time?: number;
                        status?: string;
                        result?: components['schemas']['SearchMatrixPairsResponse'];
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

    searchMatrixOffsets: TypedFetch<{
        parameters: {
            query?: {
                consistency?: components['schemas']['ReadConsistency'];
                timeout?: number;
            };
            path: {
                collection_name: string;
            };
        };
        requestBody?: {
            content: {
                'application/json': components['schemas']['SearchMatrixRequest'];
            };
        };
        responses: {
            200: {
                content: {
                    'application/json': {
                        usage?: components['schemas']['HardwareUsage'] | (Record<string, unknown> | null);
                        time?: number;
                        status?: string;
                        result?: components['schemas']['SearchMatrixOffsetsResponse'];
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

export function createPointsApi(client: Client): PointsApi {
    return {
        /**
         * Remove all payload for specified points
         */
        clearPayload: client
            .path('/collections/{collection_name}/points/payload/clear')
            .method('post')
            .create({ordering: true, wait: true}),

        /**
         * Count points which matches given filtering condition
         */
        countPoints: client.path('/collections/{collection_name}/points/count').method('post').create({timeout: true}),

        /**
         * Delete specified key payload for points
         */
        deletePayload: client
            .path('/collections/{collection_name}/points/payload/delete')
            .method('post')
            .create({wait: true, ordering: true}),

        /**
         * Delete points
         */
        deletePoints: client
            .path('/collections/{collection_name}/points/delete')
            .method('post')
            .create({wait: true, ordering: true}),

        /**
         * Update vectors
         */
        updateVectors: client
            .path('/collections/{collection_name}/points/vectors')
            .method('put')
            .create({wait: true, ordering: true}),

        /**
         * Delete vectors
         */
        deleteVectors: client
            .path('/collections/{collection_name}/points/vectors/delete')
            .method('post')
            .create({wait: true, ordering: true}),

        /**
         * Retrieve full information of single point by id
         */
        getPoint: client.path('/collections/{collection_name}/points/{id}').method('get').create(),

        /**
         * Retrieve multiple points by specified IDs
         */
        getPoints: client
            .path('/collections/{collection_name}/points')
            .method('post')
            .create({consistency: true, timeout: true}),

        /**
         * Replace full payload of points with new one
         */
        overwritePayload: client
            .path('/collections/{collection_name}/points/payload')
            .method('put')
            .create({wait: true, ordering: true}),

        /**
         * Look for the points which are closer to stored positive examples and at the same time further to negative examples.
         */
        recommendBatchPoints: client
            .path('/collections/{collection_name}/points/recommend/batch')
            .method('post')
            .create({consistency: true, timeout: true}),

        /**
         * Look for the points which are closer to stored positive examples and at the same time further to negative examples.
         */
        recommendPoints: client
            .path('/collections/{collection_name}/points/recommend')
            .method('post')
            .create({consistency: true, timeout: true}),

        /**
         * Search point groups
         */
        searchPointGroups: client
            .path('/collections/{collection_name}/points/search/groups')
            .method('post')
            .create({consistency: true, timeout: true}),

        /**
         * Scroll request - paginate over all points which matches given filtering condition
         */
        scrollPoints: client
            .path('/collections/{collection_name}/points/scroll')
            .method('post')
            .create({consistency: true, timeout: true}),

        /**
         * Retrieve by batch the closest points based on vector similarity and given filtering conditions
         */
        searchBatchPoints: client
            .path('/collections/{collection_name}/points/search/batch')
            .method('post')
            .create({consistency: true, timeout: true}),

        /**
         * Retrieve closest points based on vector similarity and given filtering conditions
         */
        searchPoints: client
            .path('/collections/{collection_name}/points/search')
            .method('post')
            .create({consistency: true, timeout: true}),

        /**
         * Set payload values for points
         */
        setPayload: client
            .path('/collections/{collection_name}/points/payload')
            .method('post')
            .create({wait: true, ordering: true}),

        /**
         * Perform insert + updates on points. If point with given ID already exists - it will be overwritten.
         */
        upsertPoints: client
            .path('/collections/{collection_name}/points')
            .method('put')
            .create({wait: true, ordering: true}),

        /**
         * Recommend point groups
         */
        recommendPointGroups: client
            .path('/collections/{collection_name}/points/recommend/groups')
            .method('post')
            .create({consistency: true, timeout: true}),

        /**
         * Apply a series of update operations for points, vectors and payloads
         */
        batchUpdate: client
            .path('/collections/{collection_name}/points/batch')
            .method('post')
            .create({wait: true, ordering: true}),

        /**
         * Discover points
         */
        discoverPoints: client
            .path('/collections/{collection_name}/points/discover')
            .method('post')
            .create({consistency: true, timeout: true}),

        /**
         * Discover batch points
         */
        discoverBatchPoints: client
            .path('/collections/{collection_name}/points/discover/batch')
            .method('post')
            .create({consistency: true, timeout: true}),

        /**
         * Query points
         */
        queryPoints: client
            .path('/collections/{collection_name}/points/query')
            .method('post')
            .create({consistency: true, timeout: true}),

        /**
         * Query points in batch
         */
        queryBatchPoints: client
            .path('/collections/{collection_name}/points/query/batch')
            .method('post')
            .create({consistency: true, timeout: true}),

        /**
         * Query points, grouped by a given payload field
         */
        queryPointsGroups: client
            .path('/collections/{collection_name}/points/query/groups')
            .method('post')
            .create({consistency: true, timeout: true}),

        /**
         * Facet a payload key with a given filter.
         */
        facet: client
            .path('/collections/{collection_name}/facet')
            .method('post')
            .create({consistency: true, timeout: true}),

        /**
         * Search points matrix distance pairs
         */
        searchMatrixPairs: client
            .path('/collections/{collection_name}/points/search/matrix/pairs')
            .method('post')
            .create({consistency: true, timeout: true}),

        /**
         * Search points matrix distance offsets
         */
        searchMatrixOffsets: client
            .path('/collections/{collection_name}/points/search/matrix/offsets')
            .method('post')
            .create({consistency: true, timeout: true}),
    } as const;
}
