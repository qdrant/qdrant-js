/**
 * HAND-MAINTAINED COMPANION TO `generated_api_client.ts` / `generated_client_type.ts`.
 *
 * See `deprecated_schema.ts` for why these endpoints are not generated any more.
 */

import {TypedFetch} from '@qdrant/openapi-typescript-fetch';
import {Client} from '../api-client.js';
import {deprecatedOperations} from './deprecated_schema.js';

export type DeprecatedClientApi = {
    /**
     * Search points
     * @deprecated
     * @description Retrieve closest points based on vector similarity and given filtering conditions
     */
    searchPoints: TypedFetch<deprecatedOperations['search_points']>;

    /**
     * Search batch points
     * @deprecated
     * @description Retrieve by batch the closest points based on vector similarity and given filtering conditions
     */
    searchBatchPoints: TypedFetch<deprecatedOperations['search_batch_points']>;

    /**
     * Search point groups
     * @deprecated
     * @description Retrieve closest points based on vector similarity and given filtering conditions, grouped by a given payload field
     */
    searchPointGroups: TypedFetch<deprecatedOperations['search_point_groups']>;

    /**
     * Recommend points
     * @deprecated
     * @description Look for the points which are closer to stored positive examples and at the same time further to negative examples.
     */
    recommendPoints: TypedFetch<deprecatedOperations['recommend_points']>;

    /**
     * Recommend batch points
     * @deprecated
     * @description Look for the points which are closer to stored positive examples and at the same time further to negative examples.
     */
    recommendBatchPoints: TypedFetch<deprecatedOperations['recommend_batch_points']>;

    /**
     * Recommend point groups
     * @deprecated
     * @description Look for the points which are closer to stored positive examples and at the same time further to negative examples, grouped by a given payload field.
     */
    recommendPointGroups: TypedFetch<deprecatedOperations['recommend_point_groups']>;

    /**
     * Discover points
     * @deprecated
     * @description Use context and a target to find the most similar points to the target, constrained by the context.
     */
    discoverPoints: TypedFetch<deprecatedOperations['discover_points']>;

    /**
     * Discover batch points
     * @deprecated
     * @description Look for points based on target and/or positive and negative example pairs, in batch.
     */
    discoverBatchPoints: TypedFetch<deprecatedOperations['discover_batch_points']>;
};

export function createDeprecatedClientApi(client: Client): DeprecatedClientApi {
    return {
        searchPoints: client.path('/collections/{collection_name}/points/search').method('post').create({
            consistency: true,
            timeout: true,
        }),

        searchBatchPoints: client.path('/collections/{collection_name}/points/search/batch').method('post').create({
            consistency: true,
            timeout: true,
        }),

        searchPointGroups: client.path('/collections/{collection_name}/points/search/groups').method('post').create({
            consistency: true,
            timeout: true,
        }),

        recommendPoints: client.path('/collections/{collection_name}/points/recommend').method('post').create({
            consistency: true,
            timeout: true,
        }),

        recommendBatchPoints: client
            .path('/collections/{collection_name}/points/recommend/batch')
            .method('post')
            .create({
                consistency: true,
                timeout: true,
            }),

        recommendPointGroups: client
            .path('/collections/{collection_name}/points/recommend/groups')
            .method('post')
            .create({
                consistency: true,
                timeout: true,
            }),

        discoverPoints: client.path('/collections/{collection_name}/points/discover').method('post').create({
            consistency: true,
            timeout: true,
        }),

        discoverBatchPoints: client.path('/collections/{collection_name}/points/discover/batch').method('post').create({
            consistency: true,
            timeout: true,
        }),
    };
}
