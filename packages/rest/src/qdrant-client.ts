import {maybe} from '@sevinf/maybe';
import {OpenApiClient, createApis} from './api-client.js';
import {QdrantClientNotImplementedError, QdrantClientConfigError} from './errors.js';
import {RestArgs, SchemaFor} from './types.js';

export type QdrantClientParams = {
    port?: number | null;
    apiKey?: string;
    https?: boolean;
    prefix?: string;
    url?: string;
    host?: string;
    timeout?: number;
    headers?: Record<string, number | string | string[] | undefined>;
};

export class QdrantClient {
    private _https: boolean;
    private _scheme: string;
    private _port: number | null;
    private _prefix: string;
    private _host: string;
    private _openApiClient: OpenApiClient;
    private _restUri: string;

    constructor({url, host, apiKey, https, prefix, port = 6333, timeout = 300_000, ...args}: QdrantClientParams = {}) {
        this._https = https ?? typeof apiKey === 'string';
        this._scheme = this._https ? 'https' : 'http';
        this._prefix = prefix ?? '';

        if (this._prefix.length > 0 && !this._prefix.startsWith('/')) {
            this._prefix = `/${this._prefix}`;
        }

        if (url && host) {
            throw new QdrantClientConfigError(
                `Only one of \`url\`, \`host\` params can be set. Url is ${url}, host is ${host}`,
            );
        }
        if (host && (host.startsWith('http://') || host.startsWith('https://') || /:\d+$/.test(host))) {
            throw new QdrantClientConfigError(
                'The `host` param is not expected to contain neither protocol (http:// or https://) nor port (:6333).\n' +
                    'Try to use the `url` parameter instead.',
            );
        } else if (url) {
            if (!(url.startsWith('http://') || url.startsWith('https://'))) {
                throw new QdrantClientConfigError(
                    'The `url` param expected to contain a valid URL starting with a protocol (http:// or https://).',
                );
            }
            const parsedUrl = new URL(url);
            this._host = parsedUrl.hostname;
            this._port = parsedUrl.port ? Number(parsedUrl.port) : port;
            this._scheme = parsedUrl.protocol.replace(':', '');

            if (this._prefix.length > 0 && parsedUrl.pathname !== '/') {
                throw new QdrantClientConfigError(
                    'Prefix can be set either in `url` or in `prefix`.\n' +
                        `url is ${url}, prefix is ${parsedUrl.pathname}`,
                );
            }
        } else {
            this._port = port;
            this._host = host ?? 'localhost';
        }

        const headers = new Headers();

        const metadata = args.headers ?? {};
        Object.keys(metadata).forEach((field) => {
            if (metadata[field]) {
                headers.set(field, String(metadata[field]));
            }
        });

        if (typeof apiKey === 'string') {
            if (this._scheme === 'http') {
                console.warn('Api key is used with unsecure connection.');
            }
            headers.set('api-key', apiKey);
        }

        const address = this._port ? `${this._host}:${this._port}` : this._host;
        this._restUri = `${this._scheme}://${address}${this._prefix}`;
        const restArgs: RestArgs = {headers, timeout};

        this._openApiClient = createApis(this._restUri, restArgs);
    }

    /**
     * API getter
     *
     * @param string Name of api
     * @returns An instance of a namespaced API, generated from OpenAPI schema.
     */
    api<T extends keyof OpenApiClient>(name: T): OpenApiClient[T] {
        return this._openApiClient[name];
    }

    /**
     * Search for points in multiple collections
     *
     * @param collection_name Name of the collection
     * @param {object} args -
     *     - searches: List of search requests
     *     - consistency: Read consistency of the search. Defines how many replicas should be queried before returning the result.
     *         Values:
     *             number - number of replicas to query, values should present in all queried replicas
     *             'majority' - query all replicas, but return values present in the majority of replicas
     *             'quorum' - query the majority of replicas, return values present in all of them
     *             'all' - query all replicas, and return values present in all replicas
     * @returns List of search responses
     */
    async searchBatch(
        collection_name: string,
        {
            searches,
            consistency,
        }: Pick<SchemaFor<'SearchRequestBatch'>, 'searches'> & {consistency?: SchemaFor<'ReadConsistency'>},
    ) {
        const response = await this._openApiClient.points.searchBatchPoints({
            collection_name,
            consistency,
            searches,
        });
        return maybe(response.data.result).orThrow('Search batch returned empty');
    }

    /**
     * Search for closest vectors in collection taking into account filtering conditions
     *
     * @param collection_name Collection to search in
     * @param {object} args -
     *      - vector:
     *          Search for vectors closest to this.
     *          Can be either a vector itself, or a named vector, or a tuple of vector name and vector itself
     *      - filter:
     *          - Exclude vectors which doesn't fit given conditions.
     *          - If `None` - search among all vectors
     *      - params: Additional search params
     *      - limit: How many results return
     *      - offset:
     *          Offset of the first result to return.
     *          May be used to paginate results.
     *          Note: large offset values may cause performance issues.
     *      - with_payload:
     *          - Specify which stored payload should be attached to the result.
     *          - If `True` - attach all payload
     *          - If `False` - do not attach any payload
     *          - If List of string - include only specified fields
     *          - If `PayloadSelector` - use explicit rules
     *      - with_vectors:
     *          - If `True` - Attach stored vector to the search result.
     *          - If `False` - Do not attach vector.
     *          - If List of string - include only specified fields
     *          - Default: `False`
     *      - score_threshold:
     *          Define a minimal score threshold for the result.
     *          If defined, less similar results will not be returned.
     *          Score of the returned result might be higher or smaller than the threshold depending
     *          on the Distance function used.
     *          E.g. for cosine similarity only higher scores will be returned.
     *      - consistency:
     *          Read consistency of the search. Defines how many replicas should be queried before returning the result.
     *          Values:
     *              - int - number of replicas to query, values should present in all queried replicas
     *              - 'majority' - query all replicas, but return values present in the majority of replicas
     *              - 'quorum' - query the majority of replicas, return values present in all of them
     *              - 'all' - query all replicas, and return values present in all replicas
     * @example
     *     // Search with filter
     *     qdrant.search(
     *         collection_name: "test_collection",
     *         vector: [1.0, 0.1, 0.2, 0.7],
     *         filter: {
     *             must: [
     *                 {
     *                     key: 'color',
     *                     range: {
     *                         color: 'red'
     *                     }
     *                 }
     *             ]
     *         )
     *     )
     * @returns List of found close points with similarity scores.
     */
    async search(
        collection_name: string,
        {
            vector,
            limit = 10,
            offset = 0,
            filter,
            params,
            with_payload = true,
            with_vector = false,
            score_threshold,
            consistency,
        }: Omit<SchemaFor<'SearchRequest'>, 'limit'> &
            Partial<Pick<SchemaFor<'SearchRequest'>, 'limit'>> & {consistency?: SchemaFor<'ReadConsistency'>},
    ) {
        const response = await this._openApiClient.points.searchPoints({
            collection_name,
            consistency,
            vector,
            limit,
            offset,
            filter,
            params,
            with_payload,
            with_vector,
            score_threshold,
        });
        return maybe(response.data.result).orThrow('Search returned empty');
    }

    /**
     * Perform multiple recommend requests in batch mode
     * @param collection_name Name of the collection
     * @param {object} args
     *     - searches: List of recommend requests
     *     - consistency:
     *         Read consistency of the search. Defines how many replicas should be queried before returning the result.
     *         Values:
     *             - number - number of replicas to query, values should present in all queried replicas
     *             - 'majority' - query all replicas, but return values present in the majority of replicas
     *             - 'quorum' - query the majority of replicas, return values present in all of them
     *             - 'all' - query all replicas, and return values present in all replicas
     * @returns List of recommend responses
     */
    async recommend_batch(
        collection_name: string,
        {searches, consistency}: SchemaFor<'RecommendRequestBatch'> & {consistency?: SchemaFor<'ReadConsistency'>},
    ) {
        const response = await this._openApiClient.points.recommendBatchPoints({
            collection_name,
            searches,
            consistency,
        });
        return maybe(response.data.result).orElse([]);
    }

    /**
     * Recommend points: search for similar points based on already stored in Qdrant examples.
     * Provide IDs of the stored points, and Qdrant will perform search based on already existing vectors.
     * This functionality is especially useful for recommendation over existing collection of points.
     * @param collection_name Collection to search in
     * @param {object} args
     *     - positive:
     *         List of stored point IDs, which should be used as reference for similarity search.
     *         If there is only one ID provided - this request is equivalent to the regular search with vector of that point.
     *         If there are more than one IDs, Qdrant will attempt to search for similar to all of them.
     *         Recommendation for multiple vectors is experimental. Its behaviour may change in the future.
     *     - negative:
     *         List of stored point IDs, which should be dissimilar to the search result.
     *         Negative examples is an experimental functionality. Its behaviour may change in the future.
     *     - query_filter:
     *         - Exclude vectors which doesn't fit given conditions.
     *         - If `None` - search among all vectors
     *     - search_params: Additional search params
     *     - limit: How many results return
     *         - Default: `10`
     *     - offset:
     *         Offset of the first result to return.
     *         May be used to paginate results.
     *         Note: large offset values may cause performance issues.
     *         - Default: `0`
     *     - with_payload:
     *         - Specify which stored payload should be attached to the result.
     *         - If `True` - attach all payload
     *         - If `False` - do not attach any payload
     *         - If List of string - include only specified fields
     *         - If `PayloadSelector` - use explicit rules
     *         - Default: `true`
     *     - with_vectors:
     *         - If `True` - Attach stored vector to the search result.
     *         - If `False` - Do not attach vector.
     *         - If List of string - include only specified fields
     *         - Default: `false`
     *     - score_threshold:
     *         Define a minimal score threshold for the result.
     *         If defined, less similar results will not be returned.
     *         Score of the returned result might be higher or smaller than the threshold depending
     *         on the Distance function used.
     *         E.g. for cosine similarity only higher scores will be returned.
     *     - using:
     *         Name of the vectors to use for recommendations.
     *         If `None` - use default vectors.
     *     - lookup_from:
     *         Defines a location (collection and vector field name), used to lookup vectors for recommendations.
     *         If `None` - use current collection will be used.
     *     - consistency:
     *         Read consistency of the search. Defines how many replicas should be queried before returning the result.
     *         Values:
     *         - int - number of replicas to query, values should present in all queried replicas
     *         - 'majority' - query all replicas, but return values present in the majority of replicas
     *         - 'quorum' - query the majority of replicas, return values present in all of them
     *         - 'all' - query all replicas, and return values present in all replicas
     * @returns List of recommended points with similarity scores.
     */
    async recommend(
        collection_name: string,
        {
            positive,
            negative,
            filter,
            params,
            limit = 10,
            offset = 0,
            with_payload = true,
            with_vector = false,
            score_threshold,
            using,
            lookup_from,
            consistency,
        }: Omit<SchemaFor<'RecommendRequest'>, 'limit'> &
            Partial<Pick<SchemaFor<'RecommendRequest'>, 'limit'>> & {consistency?: SchemaFor<'ReadConsistency'>},
    ) {
        const response = await this._openApiClient.points.recommendPoints({
            collection_name,
            limit,
            positive,
            negative,
            filter,
            params,
            offset,
            with_payload,
            with_vector,
            score_threshold,
            using,
            lookup_from,
            consistency,
        });
        return maybe(response.data.result).orThrow('Recommend points API returned empty');
    }

    /**
     * Scroll over all (matching) points in the collection.
     * @param collection_name Name of the collection
     * @param {object} args
     *     - scroll_filter: If provided - only returns points matching filtering conditions
     *     - limit: How many points to return
     *     - offset: If provided - skip points with ids less than given `offset`
     *     - with_payload:
     *         - Specify which stored payload should be attached to the result.
     *         - If `True` - attach all payload
     *         - If `False` - do not attach any payload
     *         - If List of string - include only specified fields
     *         - If `PayloadSelector` - use explicit rules
     *         - Default: `true`
     *     with_vectors:
     *         - If `True` - Attach stored vector to the search result.
     *         - If `False` - Do not attach vector.
     *         - If List of string - include only specified fields
     *         - Default: `false`
     *     consistency:
     *         Read consistency of the search. Defines how many replicas should be queried before returning the result.
     *         Values:
     *         - int - number of replicas to query, values should present in all queried replicas
     *         - 'majority' - query all replicas, but return values present in the majority of replicas
     *         - 'quorum' - query the majority of replicas, return values present in all of them
     *         - 'all' - query all replicas, and return values present in all replicas
     * @returns
     *     A pair of (List of points) and (optional offset for the next scroll request).
     *     If next page offset is `None` - there is no more points in the collection to scroll.
     */
    async scroll(
        collection_name: string,
        {
            filter,
            consistency,
            limit = 10,
            with_payload = true,
            with_vector = false,
        }: SchemaFor<'ScrollRequest'> & {consistency?: SchemaFor<'ReadConsistency'>} = {},
    ) {
        const response = await this._openApiClient.points.scrollPoints({
            collection_name,
            limit,
            filter,
            with_payload,
            with_vector,
            consistency,
        });
        return maybe(response.data.result).orThrow('Scroll points API returned empty');
    }

    /**
     * Count points in the collection.
     * Count points in the collection matching the given filter.
     * @param collection_name
     * @param {object} args
     *     - count_filter: filtering conditions
     *     - exact:
     *         If `True` - provide the exact count of points matching the filter.
     *         If `False` - provide the approximate count of points matching the filter. Works faster.
     *         Default: `true`
     * @returns Amount of points in the collection matching the filter.
     */
    async count(collection_name: string, {filter, exact = true}: SchemaFor<'CountRequest'> = {}) {
        const response = await this._openApiClient.points.countPoints({
            collection_name,
            filter,
            exact,
        });
        return maybe(response.data.result).orThrow('Count points returned empty');
    }

    /**
     * Update or insert a new point into the collection.
     * @param collection_name
     * @param {object} args
     *     - wait: Await for the results to be processed.
     *         - If `true`, result will be returned only when all changes are applied
     *         - If `false`, result will be returned immediately after the confirmation of receiving.
     *         - Default: `true`
     *     - ordering: Define strategy for ordering of the points. Possible values:
     *          - 'weak'   - write operations may be reordered, works faster, default
     *          - 'medium' - write operations go through dynamically selected leader,
     *                      may be inconsistent for a short period of time in case of leader change
     *          - 'strong' - Write operations go through the permanent leader,
     *                      consistent, but may be unavailable if leader is down
     *     - points: Batch or list of points to insert
     * @returns Operation result
     */
    async upsert(
        collection_name: string,
        {
            wait = true,
            ordering,
            ...points_or_batch
        }: {wait?: boolean; ordering?: SchemaFor<'WriteOrdering'>} & SchemaFor<'PointInsertOperations'>,
    ) {
        const response = await this._openApiClient.points.upsertPoints({
            collection_name,
            wait,
            ordering,
            ...points_or_batch,
        });
        return maybe(response.data.result).orThrow('Upsert returned empty');
    }

    /**
     * Retrieve stored points by IDs
     * @param collection_name
     * @param {object} args
     *     - ids: list of IDs to lookup
     *     - with_payload:
     *         - Specify which stored payload should be attached to the result.
     *         - If `True` - attach all payload
     *         - If `False` - do not attach any payload
     *         - If List of string - include only specified fields
     *         - If `PayloadSelector` - use explicit rules
     *         - Default: `true`
     *     - with_vectors:
     *         - If `True` - Attach stored vector to the search result.
     *         - If `False` - Do not attach vector.
     *         - If List of string - Attach only specified vectors.
     *         - Default: `false`
     *     - consistency:
     *         Read consistency of the search. Defines how many replicas should be queried before returning the result.
     *             Values:
     *                 - number - number of replicas to query, values should present in all queried replicas
     *                 - 'majority' - query all replicas, but return values present in the majority of replicas
     *                 - 'quorum' - query the majority of replicas, return values present in all of them
     *                 - 'all' - query all replicas, and return values present in all replicas
     * @returns List of points
     */
    async retrieve(
        collection_name: string,
        {
            ids,
            with_payload = true,
            with_vector,
            consistency,
        }: SchemaFor<'PointRequest'> & {consistency?: SchemaFor<'ReadConsistency'>},
    ) {
        const response = await this._openApiClient.points.getPoints({
            collection_name,
            ids,
            with_payload,
            with_vector,
            consistency,
        });
        return maybe(response.data.result).orThrow('Retrieve API returned empty');
    }

    /**
     * Deletes selected points from collection
     * @param collection_name Name of the collection
     * @param {object} args
     *     - wait: Await for the results to be processed.
     *         - If `true`, result will be returned only when all changes are applied
     *         - If `false`, result will be returned immediately after the confirmation of receiving.
     *      - ordering: Define strategy for ordering of the points. Possible values:
     *          - 'weak'   - write operations may be reordered, works faster, default
     *          - 'medium' - write operations go through dynamically selected leader,
     *                      may be inconsistent for a short period of time in case of leader change
     *          - 'strong' - Write operations go through the permanent leader,
     *                      consistent, but may be unavailable if leader is down
     *     - points_selector: List of affected points, filter or points selector.
     *         Example:
     *             - `points: [
     *                   1, 2, 3, "cd3b53f0-11a7-449f-bc50-d06310e7ed90"
     *               ]`
     *             - `filter: {
     *                    must: [
     *                        {
     *                            key: 'rand_number',
     *                            range: {
     *                                gte: 0.7
     *                            }
     *                        }
     *                    ]
     *                }`
     * @returns Operation result
     */
    async delete(
        collection_name: string,
        {
            wait,
            ordering,
            ...points_selector
        }: {wait?: boolean; ordering?: SchemaFor<'WriteOrdering'>} & SchemaFor<'PointsSelector'>,
    ) {
        const response = await this._openApiClient.points.deletePoints({
            collection_name,
            wait,
            ordering,
            ...points_selector,
        });
        return maybe(response.data.result).orThrow('Delete points returned empty');
    }

    /**
     * Overwrites payload of the specified points
     * After this operation is applied, only the specified payload will be present in the point.
     * The existing payload, even if the key is not specified in the payload, will be deleted.
     * @param collection_name Name of the collection
     * @param {object} args
     *     - wait: Await for the results to be processed.
     *         - If `true`, result will be returned only when all changes are applied
     *         - If `false`, result will be returned immediately after the confirmation of receiving.
     *      - ordering: Define strategy for ordering of the points. Possible values:
     *          - 'weak'   - write operations may be reordered, works faster, default
     *          - 'medium' - write operations go through dynamically selected leader,
     *                      may be inconsistent for a short period of time in case of leader change
     *          - 'strong' - Write operations go through the permanent leader,
     *                      consistent, but may be unavailable if leader is down
     *     - payload: Key-value pairs of payload to assign
     *     - points|filter: List of affected points, filter or points selector.
     *         Example:
     *             - `points: [
     *                   1, 2, 3, "cd3b53f0-11a7-449f-bc50-d06310e7ed90"
     *               ]`
     *             - `filter: {
     *                    must: [
     *                        {
     *                            key: 'rand_number',
     *                            range: {
     *                                gte: 0.7
     *                            }
     *                        }
     *                    ]
     *                }`
     * @returns Operation result
     */
    async setPayload(
        collection_name: string,
        {
            payload,
            points,
            filter,
            ordering,
            wait = true,
        }: {wait?: boolean; ordering?: SchemaFor<'WriteOrdering'>} & SchemaFor<'SetPayload'>,
    ) {
        const response = await this._openApiClient.points.setPayload({
            collection_name,
            payload,
            points,
            filter,
            wait,
            ordering,
        });
        return maybe(response.data.result).orThrow('Set payload returned empty');
    }

    /**
     * Overwrites payload of the specified points
     * After this operation is applied, only the specified payload will be present in the point.
     * The existing payload, even if the key is not specified in the payload, will be deleted.
     * @param collection_name Name of the collection
     * @param {object} args
     *     - wait: Await for the results to be processed.
     *         - If `true`, result will be returned only when all changes are applied
     *         - If `false`, result will be returned immediately after the confirmation of receiving.
     *      - ordering: Define strategy for ordering of the points. Possible values:
     *          - 'weak'   - write operations may be reordered, works faster, default
     *          - 'medium' - write operations go through dynamically selected leader,
     *                      may be inconsistent for a short period of time in case of leader change
     *          - 'strong' - Write operations go through the permanent leader,
     *                      consistent, but may be unavailable if leader is down
     *     - payload: Key-value pairs of payload to assign
     *     - points|filter: List of affected points, filter or points selector.
     *         Example:
     *             - `points: [
     *                   1, 2, 3, "cd3b53f0-11a7-449f-bc50-d06310e7ed90"
     *               ]`
     *             - `filter: {
     *                    must: [
     *                        {
     *                            key: 'rand_number',
     *                            range: {
     *                                gte: 0.7
     *                            }
     *                        }
     *                    ]
     *                }`
     * @returns Operation result
     */
    async overwritePayload(
        collection_name: string,
        {
            ordering,
            payload,
            points,
            filter,
            wait = true,
        }: {wait?: boolean; ordering?: SchemaFor<'WriteOrdering'>} & SchemaFor<'SetPayload'>,
    ) {
        const response = await this._openApiClient.points.overwritePayload({
            collection_name,
            payload,
            points,
            filter,
            wait,
            ordering,
        });
        return maybe(response.data.result).orThrow('Overwrite payload returned empty');
    }

    /**
     * Remove values from point's payload
     * @param collection_name Name of the collection
     * @param {object} args
     *     - wait: Await for the results to be processed.
     *         - If `true`, result will be returned only when all changes are applied
     *         - If `false`, result will be returned immediately after the confirmation of receiving.
     *      - ordering: Define strategy for ordering of the points. Possible values:
     *          - 'weak'   - write operations may be reordered, works faster, default
     *          - 'medium' - write operations go through dynamically selected leader,
     *                      may be inconsistent for a short period of time in case of leader change
     *          - 'strong' - Write operations go through the permanent leader,
     *                      consistent, but may be unavailable if leader is down
     *     - keys: List of payload keys to remove.
     *     - points|filter: List of affected points, filter or points selector.
     *         Example:
     *             - `points: [
     *                   1, 2, 3, "cd3b53f0-11a7-449f-bc50-d06310e7ed90"
     *               ]`
     *             - `filter: {
     *                    must: [
     *                        {
     *                            key: 'rand_number',
     *                            range: {
     *                                gte: 0.7
     *                            }
     *                        }
     *                    ]
     *                }`
     * @returns Operation result
     */
    async deletePayload(
        collection_name: string,
        {
            ordering,
            keys,
            points,
            filter,
            wait = true,
        }: {wait?: boolean; ordering?: SchemaFor<'WriteOrdering'>} & SchemaFor<'PointsSelector'> &
            SchemaFor<'DeletePayload'>,
    ) {
        const response = await this._openApiClient.points.deletePayload({
            collection_name,
            keys,
            points,
            filter,
            wait,
            ordering,
        });
        return maybe(response.data.result).orThrow('Delete payload returned empty');
    }

    /**
     * Delete all payload for selected points
     * @param collection_name Name of the collection
     * @param {object} args
     *     - wait: Await for the results to be processed.
     *         - If `true`, result will be returned only when all changes are applied
     *         - If `false`, result will be returned immediately after the confirmation of receiving.
     *      - ordering: Define strategy for ordering of the points. Possible values:
     *          - 'weak'   - write operations may be reordered, works faster, default
     *          - 'medium' - write operations go through dynamically selected leader,
     *                      may be inconsistent for a short period of time in case of leader change
     *          - 'strong' - Write operations go through the permanent leader,
     *                      consistent, but may be unavailable if leader is down
     *     - points_selector: List of affected points, filter or points selector.
     *         Example:
     *             - `points: [
     *                   1, 2, 3, "cd3b53f0-11a7-449f-bc50-d06310e7ed90"
     *               ]`
     *             - `filter: {
     *                    must: [
     *                        {
     *                            key: 'rand_number',
     *                            range: {
     *                                gte: 0.7
     *                            }
     *                        }
     *                    ]
     *                }`
     * @returns Operation result
     */
    async clearPayload(
        collection_name: string,
        {
            ordering,
            wait = true,
            ...points_selector
        }: {wait?: boolean; ordering?: SchemaFor<'WriteOrdering'>} & SchemaFor<'PointsSelector'>,
    ) {
        const response = await this._openApiClient.points.clearPayload({
            collection_name,
            wait,
            ordering,
            ...points_selector,
        });
        return maybe(response.data.result).orThrow('Clear payload returned empty');
    }

    /**
     * Operation for performing changes of collection aliases.
     * Alias changes are atomic, meaning that no collection modifications can happen between alias operations.
     * @param {object} args
     *     - actions: List of operations to perform
     *     - timeout: Wait for operation commit timeout in seconds. If timeout is reached, request will return with service error.
     * @returns Operation result
     */
    async updateCollectionAliases({actions, timeout}: {timeout?: number} & SchemaFor<'ChangeAliasesOperation'>) {
        const response = await this._openApiClient.collections.updateAliases({actions, timeout});
        return maybe(response.data.result).orThrow('Update aliases returned empty');
    }

    /**
     * Get collection aliases
     * @param collection_name Name of the collection
     * @returns Collection aliases
     */
    async getCollectionAliases(collection_name: string) {
        const response = await this._openApiClient.collections.getCollectionAliases({collection_name});
        return maybe(response.data.result).orThrow('Get collection aliases returned empty');
    }

    /**
     * Get all aliases
     * @returns All aliases of all collections
     */
    async getAliases() {
        const response = await this._openApiClient.collections.getCollectionsAliases({});
        return maybe(response.data.result).orThrow('Get aliases returned empty');
    }

    /**
     * Get list name of all existing collections
     * @returns List of the collections
     */
    async getCollections() {
        const response = await this._openApiClient.collections.getCollections({});
        return maybe(response.data.result).orThrow('Get collections returned empty');
    }

    /**
     * Get detailed information about specified existing collection
     *
     * @param collection_name Name of the collection
     * @returns Detailed information about the collection
     */
    async getCollection(collection_name: string) {
        const response = await this._openApiClient.collections.getCollection({collection_name});
        return maybe(response.data.result).orThrow('Get collection returned empty');
    }

    /**
     * Update parameters of the collection
     *
     * @param collection_name Name of the collection
     * @param {object} args
     *     - optimizer_config: Override for optimizer configuration
     *     - collection_params: Override for collection parameters
     *     - timeout: Wait for operation commit timeout in seconds. If timeout is reached, request will return with service error.
     * @returns Operation result
     */
    async updateCollection(collection_name: string, args?: SchemaFor<'UpdateCollection'> & {timeout?: number}) {
        const response = await this._openApiClient.collections.updateCollection({
            collection_name,
            ...args,
        });
        return maybe(response.data.result).orThrow('Update collection returned empty');
    }

    /**
     * Removes collection and all it's data
     * @param collection_name Name of the collection to delete
     * @param {object} args
     *     - timeout:
     *         Wait for operation commit timeout in seconds.
     *         If timeout is reached, request will return with service error.
     * @returns Operation result
     */
    async deleteCollection(collection_name: string, args?: {timeout?: number}) {
        const response = await this._openApiClient.collections.deleteCollection({collection_name, ...args});
        return maybe(response.data.result).orThrow('Delete collection returned empty');
    }

    /**
     * Create empty collection with given parameters
     * @returns Operation result
     * @param collection_name Name of the collection to recreate
     * @param {object} args
     *     - vectors_config:
     *         Configuration of the vector storage. Vector params contains size and distance for the vector storage.
     *         If dict is passed, service will create a vector storage for each key in the dict.
     *         If single VectorParams is passed, service will create a single anonymous vector storage.
     *     - shard_number: Number of shards in collection. Default is 1, minimum is 1.
     *     - replication_factor:
     *         Replication factor for collection. Default is 1, minimum is 1.
     *         Defines how many copies of each shard will be created.
     *         Have effect only in distributed mode.
     *     - write_consistency_factor:
     *         Write consistency factor for collection. Default is 1, minimum is 1.
     *         Defines how many replicas should apply the operation for us to consider it successful.
     *         Increasing this number will make the collection more resilient to inconsistencies, but will
     *         also make it fail if not enough replicas are available.
     *         Does not have any performance impact.
     *         Have effect only in distributed mode.
     *     - on_disk_payload:
     *         If true - point`s payload will not be stored in memory.
     *         It will be read from the disk every time it is requested.
     *         This setting saves RAM by (slightly) increasing the response time.
     *         Note: those payload values that are involved in filtering and are indexed - remain in RAM.
     *     - hnsw_config: Params for HNSW index
     *     - optimizers_config: Params for optimizer
     *     - wal_config: Params for Write-Ahead-Log
     *     - quantization_config: Params for quantization, if None - quantization will be disabled
     *     - init_from: Use data stored in another collection to initialize this collection
     *     - timeout:
     *         Wait for operation commit timeout in seconds.
     *         If timeout is reached, request will return with service error.
     */
    async createCollection(
        collection_name: string,
        {
            timeout,
            vectors,
            hnsw_config,
            init_from,
            on_disk_payload,
            optimizers_config,
            quantization_config,
            replication_factor,
            shard_number,
            wal_config,
            write_consistency_factor,
        }: {timeout?: number} & SchemaFor<'CreateCollection'>,
    ) {
        const response = await this._openApiClient.collections.createCollection({
            collection_name,
            timeout,
            vectors,
            hnsw_config,
            init_from,
            on_disk_payload,
            optimizers_config,
            quantization_config,
            replication_factor,
            shard_number,
            wal_config,
            write_consistency_factor,
        });

        return maybe(response.data.result).orThrow('Create collection returned empty');
    }

    /**
     * Delete and create empty collection with given parameters
     * @returns Operation result
     * @param collection_name Name of the collection to recreate
     * @param {object} args
     *     - vectors_config:
     *         Configuration of the vector storage. Vector params contains size and distance for the vector storage.
     *         If dict is passed, service will create a vector storage for each key in the dict.
     *         If single VectorParams is passed, service will create a single anonymous vector storage.
     *     - shard_number: Number of shards in collection. Default is 1, minimum is 1.
     *     - replication_factor:
     *         Replication factor for collection. Default is 1, minimum is 1.
     *         Defines how many copies of each shard will be created.
     *         Have effect only in distributed mode.
     *     - write_consistency_factor:
     *         Write consistency factor for collection. Default is 1, minimum is 1.
     *         Defines how many replicas should apply the operation for us to consider it successful.
     *         Increasing this number will make the collection more resilient to inconsistencies, but will
     *         also make it fail if not enough replicas are available.
     *         Does not have any performance impact.
     *         Have effect only in distributed mode.
     *     - on_disk_payload:
     *         If true - point`s payload will not be stored in memory.
     *         It will be read from the disk every time it is requested.
     *         This setting saves RAM by (slightly) increasing the response time.
     *         Note: those payload values that are involved in filtering and are indexed - remain in RAM.
     *     - hnsw_config: Params for HNSW index
     *     - optimizers_config: Params for optimizer
     *     - wal_config: Params for Write-Ahead-Log
     *     - quantization_config: Params for quantization, if None - quantization will be disabled
     *     - init_from: Use data stored in another collection to initialize this collection
     *     - timeout:
     *         Wait for operation commit timeout in seconds.
     *         If timeout is reached, request will return with service error.
     */
    async recreateCollection(
        collection_name: string,
        {
            timeout,
            vectors,
            hnsw_config,
            init_from,
            on_disk_payload,
            optimizers_config,
            quantization_config,
            replication_factor,
            shard_number,
            wal_config,
            write_consistency_factor,
        }: {timeout?: number} & SchemaFor<'CreateCollection'>,
    ) {
        maybe(
            await this._openApiClient.collections.deleteCollection({
                collection_name,
                timeout,
            }),
        )
            .get('ok')
            .orThrow('Delete collection returned failed');

        const response = await this._openApiClient.collections.createCollection({
            collection_name,
            timeout,
            vectors,
            hnsw_config,
            init_from,
            on_disk_payload,
            optimizers_config,
            quantization_config,
            replication_factor,
            shard_number,
            wal_config,
            write_consistency_factor,
        });

        return maybe(response).orThrow('Create collection returned empty');
    }

    async uploadRecords() {
        return Promise.reject(new QdrantClientNotImplementedError('uploadRecords()'));
    }

    /**
     * Upload vectors and payload to the collection.
     * This method will perform automatic batching of the data.
     * If you need to perform a single update, use `upsert` method.
     * Note: use `upload_records` method if you want to upload multiple vectors with single payload.
     * @param collection_name Name of the collection to upload to
     */
    async uploadCollection() {
        return Promise.reject(new QdrantClientNotImplementedError('uploadCollection()'));
    }

    /**
     * Creates index for a given payload field.
     * Indexed fields allow to perform filtered search operations faster.
     * @param collection_name Name of the collection
     * @param field_name Name of the payload field
     * @param {object} args
     *     - field_name: Name of the payload field.
     *     - field_schema: Type of data to index.
     *     - wait: Await for the results to be processed.
     *         - If `true`, result will be returned only when all changes are applied
     *         - If `false`, result will be returned immediately after the confirmation of receiving.
     *     - ordering:
     *         Define strategy for ordering of the points. Possible values:
     *         - 'weak'   - write operations may be reordered, works faster, default
     *         - 'medium' - write operations go through dynamically selected leader,
     *                      may be inconsistent for a short period of time in case of leader change
     *         - 'strong' - Write operations go through the permanent leader,
     *                      consistent, but may be unavailable if leader is down
     * @returns Operation Result
     */
    async createPayloadIndex(
        collection_name: string,
        {
            wait,
            ordering,
            field_name,
            field_schema,
        }: {wait?: boolean; ordering?: SchemaFor<'WriteOrdering'>} & SchemaFor<'CreateFieldIndex'>,
    ) {
        const response = await this._openApiClient.collections.createFieldIndex({
            collection_name,
            field_name,
            field_schema,
            wait,
            ordering,
        });
        return maybe(response.data.result).orThrow('Create field index returned empty');
    }

    /**
     * Removes index for a given payload field.
     * @param collection_name Name of the collection
     * @param field_name Name of the payload field
     * @param {object} args
     *     - wait: Await for the results to be processed.
     *         - If `true`, result will be returned only when all changes are applied
     *         - If `false`, result will be returned immediately after the confirmation of receiving.
     *     - ordering:
     *         Define strategy for ordering of the points. Possible values:
     *         - 'weak'   - write operations may be reordered, works faster, default
     *         - 'medium' - write operations go through dynamically selected leader,
     *                      may be inconsistent for a short period of time in case of leader change
     *         - 'strong' - Write operations go through the permanent leader,
     *                      consistent, but may be unavailable if leader is down
     * @returns Operation Result
     */
    async deletePayloadIndex(
        collection_name: string,
        field_name: string,
        {wait = true, ordering}: {wait?: boolean; ordering?: SchemaFor<'WriteOrdering'>} = {},
    ) {
        const response = await this._openApiClient.collections.deleteFieldIndex({
            collection_name,
            field_name,
            wait,
            ordering,
        });
        return maybe(response.data.result).orThrow('Delete field index returned empty');
    }

    /**
     * List all snapshots for a given collection
     * @param collection_name Name of the collection
     * @returns List of snapshots
     */
    async listSnapshots(collection_name: string) {
        const response = await this._openApiClient.snapshots.listSnapshots({collection_name});
        return maybe(response.data.result).orThrow('List snapshots API returned empty');
    }

    /**
     * Create snapshot for a given collection
     * @param collection_name Name of the collection
     * @returns Snapshot description
     */
    async createSnapshot(collection_name: string, args?: {wait?: boolean}) {
        const response = await this._openApiClient.snapshots.createSnapshot({collection_name, ...args});
        return maybe(response.data.result).orNull();
    }

    /**
     * Delete snapshot for a given collection
     * @param collection_name Name of the collection
     * @param snapshot_name Snapshot id
     * @returns True if snapshot was deleted
     */
    async deleteSnapshot(collection_name: string, snapshot_name: string, args?: {wait?: boolean}) {
        const response = await this._openApiClient.snapshots.deleteSnapshot({collection_name, snapshot_name, ...args});
        return maybe(response.data.result).orThrow('Delete snapshot API returned empty');
    }

    /**
     * List all snapshots for a whole storage
     * @returns List of snapshots
     */
    async listFullSnapshots() {
        const response = await this._openApiClient.snapshots.listFullSnapshots({});
        return maybe(response.data.result).orThrow('List full snapshots API returned empty');
    }

    /**
     * Create snapshot for a whole storage
     * @returns Snapshot description
     */
    async createFullSnapshot(args?: {wait?: boolean}) {
        const response = await this._openApiClient.snapshots.createFullSnapshot({...args});
        return maybe(response.data.result).orThrow('Create full snapshot API returned empty');
    }

    /**
     * Delete snapshot for a whole storage
     * @param snapshot_name Snapshot name
     * @returns True if the snapshot was deleted
     */
    async deleteFullSnapshot(snapshot_name: string, args?: {wait?: boolean}) {
        const response = await this._openApiClient.snapshots.deleteFullSnapshot({snapshot_name, ...args});
        return maybe(response.data.result).orThrow('Delete full snapshot API returned empty');
    }

    /**
     * Recover collection from snapshot
     * @param collection_name Name of the collection
     * @param {object} args
     *     - location:
     *         URL of the snapshot.
     *         Example:
     *             - URL `http://localhost:8080/collections/my_collection/snapshots/my_snapshot`
     *             - Local path `file:///qdrant/snapshots/test_collection-2022-08-04-10-49-10.snapshot`
     *     - priority:
     *         Defines source of truth for snapshot recovery
     *             - `snapshot` means - prefer snapshot data over the current state
     *             - `replica` means - prefer existing data over the snapshot
     *         Default: `replica`
     * @returns True if the snapshot was recovered
     */
    async recoverSnapshot(collection_name: string, {location, priority}: SchemaFor<'SnapshotRecover'>) {
        const response = await this._openApiClient.snapshots.recoverFromSnapshot({collection_name, location, priority});
        return maybe(response.data.result).orThrow('Recover from snapshot API returned empty');
    }

    /**
     * Lock storage for writing
     */
    async lockStorage(reason: string) {
        const response = await this._openApiClient.service.postLocks({write: true, error_message: reason});
        return maybe(response.data.result).orThrow('Lock storage returned empty');
    }

    /**
     * Unlock storage for writing.
     */
    async unlockStorage() {
        const response = await this._openApiClient.service.postLocks({write: false});
        return maybe(response.data.result).orThrow('Post locks returned empty');
    }

    /**
     * Get current locks state.
     */
    async getLocks() {
        const response = await this._openApiClient.service.getLocks({});
        return maybe(response.data.result).orThrow('Get locks returned empty');
    }
}
