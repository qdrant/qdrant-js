import {Client} from '../api-client.js';

export function createPointsApi(client: Client) {
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
    } as const;
}
