/**
 * HAND-MAINTAINED COMPANION TO `generated_schema.ts`.
 *
 * Qdrant v1.19 stopped documenting the deprecated search/recommend/discover REST endpoints in its
 * OpenAPI spec (qdrant/qdrant#9982), so `openapi-typescript` no longer emits them. The actix
 * handlers are still registered server-side and keep serving traffic unchanged — removing them is
 * an announced follow-up, "once clients have had a release with the deprecation warning".
 *
 * So the client keeps supporting these endpoints, and this file holds the definitions the generator
 * used to emit, copied verbatim from the Qdrant v1.18 output. It is frozen: new APIs belong in the
 * generated files, and this one goes away when Qdrant drops the routes.
 */

import {components} from './generated_schema.js';

type Schemas = components['schemas'];

export interface deprecatedComponents {
    schemas: {
        SearchRequest: {
            /** @description Specify in which shards to look for the points, if not specified - look in all shards */
            shard_key?: Schemas['ShardKeySelector'] | (Record<string, unknown> | null);
            vector: deprecatedComponents['schemas']['NamedVectorStruct'];
            /** @description Look only for points which satisfies this conditions */
            filter?: Schemas['Filter'] | (Record<string, unknown> | null);
            /** @description Additional search params */
            params?: Schemas['SearchParams'] | (Record<string, unknown> | null);
            /**
             * Format: uint
             * @description Max number of result to return
             */
            limit: number;
            /**
             * Format: uint
             * @description Offset of the first result to return. May be used to paginate results. Note: large offset values may cause performance issues.
             */
            offset?: number | null;
            /** @description Select which payload to return with the response. Default is false. */
            with_payload?: Schemas['WithPayloadInterface'] | (Record<string, unknown> | null);
            /**
             * @description Options for specifying which vectors to include into response. Default is false.
             * @default null
             */
            with_vector?: Schemas['WithVector'] | (Record<string, unknown> | null);
            /**
             * Format: float
             * @description Define a minimal score threshold for the result. If defined, less similar results will not be returned. Score of the returned result might be higher or smaller than the threshold depending on the Distance function used. E.g. for cosine similarity only higher scores will be returned.
             */
            score_threshold?: number | null;
        };
        SearchRequestBatch: {
            searches: deprecatedComponents['schemas']['SearchRequest'][];
        };
        SearchGroupsRequest: {
            /** @description Specify in which shards to look for the points, if not specified - look in all shards */
            shard_key?: Schemas['ShardKeySelector'] | (Record<string, unknown> | null);
            vector: deprecatedComponents['schemas']['NamedVectorStruct'];
            /** @description Look only for points which satisfies this conditions */
            filter?: Schemas['Filter'] | (Record<string, unknown> | null);
            /** @description Additional search params */
            params?: Schemas['SearchParams'] | (Record<string, unknown> | null);
            /** @description Select which payload to return with the response. Default is false. */
            with_payload?: Schemas['WithPayloadInterface'] | (Record<string, unknown> | null);
            /**
             * @description Options for specifying which vectors to include into response. Default is false.
             * @default null
             */
            with_vector?: Schemas['WithVector'] | (Record<string, unknown> | null);
            /**
             * Format: float
             * @description Define a minimal score threshold for the result. If defined, less similar results will not be returned. Score of the returned result might be higher or smaller than the threshold depending on the Distance function used. E.g. for cosine similarity only higher scores will be returned.
             */
            score_threshold?: number | null;
            /** @description Payload field to group by, must be a string or number field. If the field contains more than 1 value, all values will be used for grouping. One point can be in multiple groups. */
            group_by: string;
            /**
             * Format: uint32
             * @description Maximum amount of points to return per group
             */
            group_size: number;
            /**
             * Format: uint32
             * @description Maximum amount of groups to return
             */
            limit: number;
            /** @description Look for points in another collection using the group ids */
            with_lookup?: Schemas['WithLookupInterface'] | (Record<string, unknown> | null);
        };
        RecommendRequest: {
            /** @description Specify in which shards to look for the points, if not specified - look in all shards */
            shard_key?: Schemas['ShardKeySelector'] | (Record<string, unknown> | null);
            /**
             * @description Look for vectors closest to those
             * @default []
             */
            positive?: deprecatedComponents['schemas']['RecommendExample'][];
            /**
             * @description Try to avoid vectors like this
             * @default []
             */
            negative?: deprecatedComponents['schemas']['RecommendExample'][];
            /** @description How to use positive and negative examples to find the results */
            strategy?: Schemas['RecommendStrategy'] | (Record<string, unknown> | null);
            /** @description Look only for points which satisfies this conditions */
            filter?: Schemas['Filter'] | (Record<string, unknown> | null);
            /** @description Additional search params */
            params?: Schemas['SearchParams'] | (Record<string, unknown> | null);
            /**
             * Format: uint
             * @description Max number of result to return
             */
            limit: number;
            /**
             * Format: uint
             * @description Offset of the first result to return. May be used to paginate results. Note: large offset values may cause performance issues.
             */
            offset?: number | null;
            /** @description Select which payload to return with the response. Default is false. */
            with_payload?: Schemas['WithPayloadInterface'] | (Record<string, unknown> | null);
            /**
             * @description Options for specifying which vectors to include into response. Default is false.
             * @default null
             */
            with_vector?: Schemas['WithVector'] | (Record<string, unknown> | null);
            /**
             * Format: float
             * @description Define a minimal score threshold for the result. If defined, less similar results will not be returned. Score of the returned result might be higher or smaller than the threshold depending on the Distance function used. E.g. for cosine similarity only higher scores will be returned.
             */
            score_threshold?: number | null;
            /**
             * @description Define which vector to use for recommendation, if not specified - try to use default vector
             * @default null
             */
            using?: deprecatedComponents['schemas']['UsingVector'] | (Record<string, unknown> | null);
            /**
             * @description The location used to lookup vectors. If not specified - use current collection. Note: the other collection should have the same vector size as the current collection
             * @default null
             */
            lookup_from?: Schemas['LookupLocation'] | (Record<string, unknown> | null);
        };
        RecommendRequestBatch: {
            searches: deprecatedComponents['schemas']['RecommendRequest'][];
        };
        RecommendGroupsRequest: {
            /** @description Specify in which shards to look for the points, if not specified - look in all shards */
            shard_key?: Schemas['ShardKeySelector'] | (Record<string, unknown> | null);
            /**
             * @description Look for vectors closest to those
             * @default []
             */
            positive?: deprecatedComponents['schemas']['RecommendExample'][];
            /**
             * @description Try to avoid vectors like this
             * @default []
             */
            negative?: deprecatedComponents['schemas']['RecommendExample'][];
            /**
             * @description How to use positive and negative examples to find the results
             * @default null
             */
            strategy?: Schemas['RecommendStrategy'] | (Record<string, unknown> | null);
            /** @description Look only for points which satisfies this conditions */
            filter?: Schemas['Filter'] | (Record<string, unknown> | null);
            /** @description Additional search params */
            params?: Schemas['SearchParams'] | (Record<string, unknown> | null);
            /** @description Select which payload to return with the response. Default is false. */
            with_payload?: Schemas['WithPayloadInterface'] | (Record<string, unknown> | null);
            /**
             * @description Options for specifying which vectors to include into response. Default is false.
             * @default null
             */
            with_vector?: Schemas['WithVector'] | (Record<string, unknown> | null);
            /**
             * Format: float
             * @description Define a minimal score threshold for the result. If defined, less similar results will not be returned. Score of the returned result might be higher or smaller than the threshold depending on the Distance function used. E.g. for cosine similarity only higher scores will be returned.
             */
            score_threshold?: number | null;
            /**
             * @description Define which vector to use for recommendation, if not specified - try to use default vector
             * @default null
             */
            using?: deprecatedComponents['schemas']['UsingVector'] | (Record<string, unknown> | null);
            /**
             * @description The location used to lookup vectors. If not specified - use current collection. Note: the other collection should have the same vector size as the current collection
             * @default null
             */
            lookup_from?: Schemas['LookupLocation'] | (Record<string, unknown> | null);
            /** @description Payload field to group by, must be a string or number field. If the field contains more than 1 value, all values will be used for grouping. One point can be in multiple groups. */
            group_by: string;
            /**
             * Format: uint32
             * @description Maximum amount of points to return per group
             */
            group_size: number;
            /**
             * Format: uint32
             * @description Maximum amount of groups to return
             */
            limit: number;
            /** @description Look for points in another collection using the group ids */
            with_lookup?: Schemas['WithLookupInterface'] | (Record<string, unknown> | null);
        };
        DiscoverRequest: {
            /** @description Specify in which shards to look for the points, if not specified - look in all shards */
            shard_key?: Schemas['ShardKeySelector'] | (Record<string, unknown> | null);
            /**
             * @description Look for vectors closest to this.
             *
             * When using the target (with or without context), the integer part of the score represents the rank with respect to the context, while the decimal part of the score relates to the distance to the target.
             */
            target?: deprecatedComponents['schemas']['RecommendExample'] | (Record<string, unknown> | null);
            /**
             * @description Pairs of { positive, negative } examples to constrain the search.
             *
             * When using only the context (without a target), a special search - called context search - is performed where pairs of points are used to generate a loss that guides the search towards the zone where most positive examples overlap. This means that the score minimizes the scenario of finding a point closer to a negative than to a positive part of a pair.
             *
             * Since the score of a context relates to loss, the maximum score a point can get is 0.0, and it becomes normal that many points can have a score of 0.0.
             *
             * For discovery search (when including a target), the context part of the score for each pair is calculated +1 if the point is closer to a positive than to a negative part of a pair, and -1 otherwise.
             */
            context?: deprecatedComponents['schemas']['ContextExamplePair'][] | null;
            /** @description Look only for points which satisfies this conditions */
            filter?: Schemas['Filter'] | (Record<string, unknown> | null);
            /** @description Additional search params */
            params?: Schemas['SearchParams'] | (Record<string, unknown> | null);
            /**
             * Format: uint
             * @description Max number of result to return
             */
            limit: number;
            /**
             * Format: uint
             * @description Offset of the first result to return. May be used to paginate results. Note: large offset values may cause performance issues.
             */
            offset?: number | null;
            /** @description Select which payload to return with the response. Default is false. */
            with_payload?: Schemas['WithPayloadInterface'] | (Record<string, unknown> | null);
            /** @description Options for specifying which vectors to include into response. Default is false. */
            with_vector?: Schemas['WithVector'] | (Record<string, unknown> | null);
            /**
             * @description Define which vector to use for recommendation, if not specified - try to use default vector
             * @default null
             */
            using?: deprecatedComponents['schemas']['UsingVector'] | (Record<string, unknown> | null);
            /**
             * @description The location used to lookup vectors. If not specified - use current collection. Note: the other collection should have the same vector size as the current collection
             * @default null
             */
            lookup_from?: Schemas['LookupLocation'] | (Record<string, unknown> | null);
        };
        DiscoverRequestBatch: {
            searches: deprecatedComponents['schemas']['DiscoverRequest'][];
        };
        NamedVector: {
            /** @description Name of vector data */
            name: string;
            /** @description Vector data */
            vector: number[];
        };
        NamedSparseVector: {
            /** @description Name of vector data */
            name: string;
            vector: Schemas['SparseVector'];
        };
        NamedVectorStruct:
            | number[]
            | deprecatedComponents['schemas']['NamedVector']
            | deprecatedComponents['schemas']['NamedSparseVector'];
        RecommendExample: Schemas['ExtendedPointId'] | number[] | Schemas['SparseVector'];
        ContextExamplePair: {
            positive: deprecatedComponents['schemas']['RecommendExample'];
            negative: deprecatedComponents['schemas']['RecommendExample'];
        };
        UsingVector: string;
    };
}

type DeprecatedSchemas = deprecatedComponents['schemas'];

/** Query parameters and response envelope shared by all the endpoints below. */
interface DeprecatedOperation<RequestBody, Result> {
    parameters: {
        query?: {
            /** @description Define read consistency guarantees for the operation */
            consistency?: Schemas['ReadConsistency'];
            /** @description If set, overrides global timeout for this request. Unit is seconds. */
            timeout?: number;
        };
        path: {
            /** @description Name of the collection to search in */
            collection_name: string;
        };
    };
    requestBody?: {
        content: {
            'application/json': RequestBody;
        };
    };
    responses: {
        /** @description successful operation */
        200: {
            content: {
                'application/json': {
                    usage?: Schemas['Usage'] | (Record<string, unknown> | null);
                    time?: number;
                    status?: string;
                    result?: Result;
                };
            };
        };
        /** @description error */
        default: {
            content: {
                'application/json': Schemas['ErrorResponse'];
            };
        };
        /** @description error */
        '4XX': {
            content: {
                'application/json': Schemas['ErrorResponse'];
            };
        };
    };
}

export interface deprecatedOperations {
    search_points: DeprecatedOperation<DeprecatedSchemas['SearchRequest'], Schemas['ScoredPoint'][]>;
    search_batch_points: DeprecatedOperation<DeprecatedSchemas['SearchRequestBatch'], Schemas['ScoredPoint'][][]>;
    search_point_groups: DeprecatedOperation<DeprecatedSchemas['SearchGroupsRequest'], Schemas['GroupsResult']>;
    recommend_points: DeprecatedOperation<DeprecatedSchemas['RecommendRequest'], Schemas['ScoredPoint'][]>;
    recommend_batch_points: DeprecatedOperation<DeprecatedSchemas['RecommendRequestBatch'], Schemas['ScoredPoint'][][]>;
    recommend_point_groups: DeprecatedOperation<DeprecatedSchemas['RecommendGroupsRequest'], Schemas['GroupsResult']>;
    discover_points: DeprecatedOperation<DeprecatedSchemas['DiscoverRequest'], Schemas['ScoredPoint'][]>;
    discover_batch_points: DeprecatedOperation<DeprecatedSchemas['DiscoverRequestBatch'], Schemas['ScoredPoint'][][]>;
}

export interface deprecatedPaths {
    '/collections/{collection_name}/points/search': {
        /**
         * Search points
         * @deprecated
         * @description Retrieve closest points based on vector similarity and given filtering conditions
         */
        post: deprecatedOperations['search_points'];
    };
    '/collections/{collection_name}/points/search/batch': {
        /**
         * Search batch points
         * @deprecated
         * @description Retrieve by batch the closest points based on vector similarity and given filtering conditions
         */
        post: deprecatedOperations['search_batch_points'];
    };
    '/collections/{collection_name}/points/search/groups': {
        /**
         * Search point groups
         * @deprecated
         * @description Retrieve closest points based on vector similarity and given filtering conditions, grouped by a given payload field
         */
        post: deprecatedOperations['search_point_groups'];
    };
    '/collections/{collection_name}/points/recommend': {
        /**
         * Recommend points
         * @deprecated
         * @description Look for the points which are closer to stored positive examples and at the same time further to negative examples.
         */
        post: deprecatedOperations['recommend_points'];
    };
    '/collections/{collection_name}/points/recommend/batch': {
        /**
         * Recommend batch points
         * @deprecated
         * @description Look for the points which are closer to stored positive examples and at the same time further to negative examples.
         */
        post: deprecatedOperations['recommend_batch_points'];
    };
    '/collections/{collection_name}/points/recommend/groups': {
        /**
         * Recommend point groups
         * @deprecated
         * @description Look for the points which are closer to stored positive examples and at the same time further to negative examples, grouped by a given payload field.
         */
        post: deprecatedOperations['recommend_point_groups'];
    };
    '/collections/{collection_name}/points/discover': {
        /**
         * Discover points
         * @deprecated
         * @description Use context and a target to find the most similar points to the target, constrained by the context.
         */
        post: deprecatedOperations['discover_points'];
    };
    '/collections/{collection_name}/points/discover/batch': {
        /**
         * Discover batch points
         * @deprecated
         * @description Look for points based on target and/or positive and negative example pairs, in batch.
         */
        post: deprecatedOperations['discover_batch_points'];
    };
}
