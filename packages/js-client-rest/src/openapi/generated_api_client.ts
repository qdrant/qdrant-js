// AUTOMATICALLY GENERATED FILE. DO NOT EDIT!

import {Client} from '../api-client.js';
import {ClientApi} from './generated_client_type.js';

export function createClientApi(client: Client) : ClientApi {
  return {
    /** List shard keys */
    listShardKeys:
      client
      .path('/collections/{collection_name}/shards')
      .method('get')
      .create(),
    
    /** Create shard key */
    createShardKey:
      client
      .path('/collections/{collection_name}/shards')
      .method('put')
      .create({
        timeout: true,
      }),
    
    /** Delete shard key */
    deleteShardKey:
      client
      .path('/collections/{collection_name}/shards/delete')
      .method('post')
      .create({
        timeout: true,
      }),
    
    /**
         * Returns information about the running Qdrant instance 
         * @description Returns information about the running Qdrant instance like version and commit id
         */
    root:
      client
      .path('/')
      .method('get')
      .create(),
    
    /**
         * Collect telemetry data 
         * @description Collect telemetry data including app info, system info, collections info, cluster info, configs and statistics
         */
    telemetry:
      client
      .path('/telemetry')
      .method('get')
      .create(),
    
    /**
         * Collect Prometheus metrics data 
         * @description Collect metrics data including app info, collections info, cluster info and statistics
         */
    metrics:
      client
      .path('/metrics')
      .method('get')
      .create(),
    
    /**
         * Kubernetes healthz endpoint 
         * @description Liveness-style health check. Returns 200 as soon as the HTTP API is serving requests. It does not inspect collections, shards or consensus state, and is identical to `/livez`. Use it only to detect whether the process is up and responsive.
         */
    healthz:
      client
      .path('/healthz')
      .method('get')
      .create(),
    
    /**
         * Kubernetes livez endpoint 
         * @description Kubernetes liveness probe. Returns 200 as soon as the HTTP API is serving requests. It does not inspect collections, shards or consensus state, and is identical to `/healthz`. A failure indicates the process is unresponsive and should be restarted.
         */
    livez:
      client
      .path('/livez')
      .method('get')
      .create(),
    
    /**
         * Kubernetes readyz endpoint 
         * @description Kubernetes readiness probe. Checks the instance and waits out pending data operations to see when it can start accepting traffic. In a distributed deployment it returns 200 only once the node has caught up with the cluster consensus commit and its local shards are healthy; otherwise it returns 503. In a single-node deployment it always returns 200 once the API is up. Use it to decide when to route traffic to the instance.
         */
    readyz:
      client
      .path('/readyz')
      .method('get')
      .create(),
    
    /**
         * Get issues 
         * @description Get a report of performance issues and configuration suggestions
         */
    getIssues:
      client
      .path('/issues')
      .method('get')
      .create(),
    
    /**
         * Clear issues 
         * @description Removes all issues reported so far
         */
    clearIssues:
      client
      .path('/issues')
      .method('delete')
      .create(),
    
    /**
         * Get cluster status info 
         * @description Get information about the current state and composition of the cluster
         */
    clusterStatus:
      client
      .path('/cluster')
      .method('get')
      .create(),
    
    /**
         * Collect cluster telemetry data 
         * @description Get telemetry data, from the point of view of the cluster. This includes peers info, collections info, shard transfers, and resharding status
         */
    clusterTelemetry:
      client
      .path('/cluster/telemetry')
      .method('get')
      .create(),
    
    /** Tries to recover current peer Raft state. */
    recoverCurrentPeer:
      client
      .path('/cluster/recover')
      .method('post')
      .create(),
    
    /**
         * Remove peer from the cluster 
         * @description Tries to remove peer from the cluster. Will return an error if peer has shards on it.
         */
    removePeer:
      client
      .path('/cluster/peer/{peer_id}')
      .method('delete')
      .create({
        timeout: true,
        force: true,
      }),
    
    /**
         * Get global quotas 
         * @description Get the cluster-wide resource quota configuration, together with the current utilization it is measured against.
         * The configuration is the same on every peer, but the reported utilization is for the node serving this request only -
         * memory and disk are node-local, so query each peer to see where the whole cluster stands.
         */
    getQuotas:
      client
      .path('/quotas')
      .method('get')
      .create(),
    
    /**
         * Set global quotas 
         * @description Replace the cluster-wide resource quota configuration. The new configuration is propagated to every peer through consensus and persisted, so it survives restarts
         */
    updateQuotas:
      client
      .path('/quotas')
      .method('put')
      .create({
        wait: true,
      }),
    
    /**
         * List collections 
         * @description Get list name of all existing collections
         */
    getCollections:
      client
      .path('/collections')
      .method('get')
      .create(),
    
    /**
         * Collection info 
         * @description Get detailed information about specified existing collection
         */
    getCollection:
      client
      .path('/collections/{collection_name}')
      .method('get')
      .create(),
    
    /**
         * Create collection 
         * @description Create new collection with given parameters
         */
    createCollection:
      client
      .path('/collections/{collection_name}')
      .method('put')
      .create({
        timeout: true,
      }),
    
    /**
         * Delete collection 
         * @description Drop collection and all associated data
         */
    deleteCollection:
      client
      .path('/collections/{collection_name}')
      .method('delete')
      .create({
        timeout: true,
      }),
    
    /**
         * Update collection parameters 
         * @description Update parameters of the existing collection
         */
    updateCollection:
      client
      .path('/collections/{collection_name}')
      .method('patch')
      .create({
        timeout: true,
      }),
    
    /** Update aliases of the collections */
    updateAliases:
      client
      .path('/collections/aliases')
      .method('post')
      .create({
        timeout: true,
      }),
    
    /**
         * Create index for field in collection 
         * @description Create index for field in collection
         */
    createFieldIndex:
      client
      .path('/collections/{collection_name}/index')
      .method('put')
      .create({
        wait: true,
        ordering: true,
        timeout: true,
      }),
    
    /**
         * Check the existence of a collection 
         * @description Returns "true" if the given collection name exists, and "false" otherwise
         */
    collectionExists:
      client
      .path('/collections/{collection_name}/exists')
      .method('get')
      .create(),
    
    /**
         * Delete index for field in collection 
         * @description Delete field index for collection
         */
    deleteFieldIndex:
      client
      .path('/collections/{collection_name}/index/{field_name}')
      .method('delete')
      .create({
        wait: true,
        ordering: true,
        timeout: true,
      }),
    
    /**
         * Create named vector 
         * @description Create a new named vector on an existing collection
         */
    createVectorName:
      client
      .path('/collections/{collection_name}/vectors/{vector_name}')
      .method('put')
      .create({
        wait: true,
        ordering: true,
        timeout: true,
      }),
    
    /**
         * Delete named vector 
         * @description Delete a named vector from a collection
         */
    deleteVectorName:
      client
      .path('/collections/{collection_name}/vectors/{vector_name}')
      .method('delete')
      .create({
        wait: true,
        ordering: true,
        timeout: true,
      }),
    
    /**
         * Collection cluster info 
         * @description Get cluster information for a collection
         */
    collectionClusterInfo:
      client
      .path('/collections/{collection_name}/cluster')
      .method('get')
      .create(),
    
    /** Update collection cluster setup */
    updateCollectionCluster:
      client
      .path('/collections/{collection_name}/cluster')
      .method('post')
      .create({
        timeout: true,
      }),
    
    /**
         * Get optimization progress 
         * @description Get progress of ongoing and completed optimizations for a collection
         */
    getOptimizations:
      client
      .path('/collections/{collection_name}/optimizations')
      .method('get')
      .create(),
    
    /**
         * List aliases for collection 
         * @description Get list of all aliases for a collection
         */
    getCollectionAliases:
      client
      .path('/collections/{collection_name}/aliases')
      .method('get')
      .create(),
    
    /**
         * List collections aliases 
         * @description Get list of all existing collections aliases
         */
    getCollectionsAliases:
      client
      .path('/aliases')
      .method('get')
      .create(),
    
    /**
         * Recover from an uploaded snapshot 
         * @description Recover local collection data from an uploaded snapshot. This will overwrite any data, stored on this node, for the collection. If collection does not exist - it will be created.
         */
    recoverFromUploadedSnapshot:
      client
      .path('/collections/{collection_name}/snapshots/upload')
      .method('post')
      .create({
        wait: true,
        priority: true,
        checksum: true,
      }),
    
    /**
         * Recover from a snapshot 
         * @description Recover local collection data from a snapshot. This will overwrite any data, stored on this node, for the collection. If collection does not exist - it will be created.
         */
    recoverFromSnapshot:
      client
      .path('/collections/{collection_name}/snapshots/recover')
      .method('put')
      .create({
        wait: true,
      }),
    
    /**
         * List collection snapshots 
         * @description Get list of snapshots for a collection
         */
    listSnapshots:
      client
      .path('/collections/{collection_name}/snapshots')
      .method('get')
      .create(),
    
    /**
         * Create collection snapshot 
         * @description Create new snapshot for a collection
         */
    createSnapshot:
      client
      .path('/collections/{collection_name}/snapshots')
      .method('post')
      .create({
        wait: true,
      }),
    
    /**
         * Download collection snapshot 
         * @description Download specified snapshot from a collection as a file
         */
    getSnapshot:
      client
      .path('/collections/{collection_name}/snapshots/{snapshot_name}')
      .method('get')
      .create(),
    
    /**
         * Delete collection snapshot 
         * @description Delete snapshot for a collection
         */
    deleteSnapshot:
      client
      .path('/collections/{collection_name}/snapshots/{snapshot_name}')
      .method('delete')
      .create({
        wait: true,
      }),
    
    /**
         * List of storage snapshots 
         * @description Get list of snapshots of the whole storage
         */
    listFullSnapshots:
      client
      .path('/snapshots')
      .method('get')
      .create(),
    
    /**
         * Create storage snapshot 
         * @description Create new snapshot of the whole storage
         */
    createFullSnapshot:
      client
      .path('/snapshots')
      .method('post')
      .create({
        wait: true,
      }),
    
    /**
         * Download storage snapshot 
         * @description Download specified snapshot of the whole storage as a file
         */
    getFullSnapshot:
      client
      .path('/snapshots/{snapshot_name}')
      .method('get')
      .create(),
    
    /**
         * Delete storage snapshot 
         * @description Delete snapshot of the whole storage
         */
    deleteFullSnapshot:
      client
      .path('/snapshots/{snapshot_name}')
      .method('delete')
      .create({
        wait: true,
      }),
    
    /**
         * Download shard snapshot 
         * @description Stream the current state of a shard as a snapshot file
         */
    streamShardSnapshot:
      client
      .path('/collections/{collection_name}/shards/{shard_id}/snapshot')
      .method('get')
      .create(),
    
    /**
         * Recover shard from an uploaded snapshot 
         * @description Recover shard of a local collection from an uploaded snapshot. This will overwrite any data, stored on this node, for the collection shard.
         */
    recoverShardFromUploadedSnapshot:
      client
      .path('/collections/{collection_name}/shards/{shard_id}/snapshots/upload')
      .method('post')
      .create({
        wait: true,
        priority: true,
        checksum: true,
      }),
    
    /**
         * Recover from a snapshot 
         * @description Recover shard of a local collection data from a snapshot. This will overwrite any data, stored in this shard, for the collection.
         */
    recoverShardFromSnapshot:
      client
      .path('/collections/{collection_name}/shards/{shard_id}/snapshots/recover')
      .method('put')
      .create({
        wait: true,
      }),
    
    /**
         * List shards snapshots for a collection 
         * @description Get list of snapshots for a shard of a collection
         */
    listShardSnapshots:
      client
      .path('/collections/{collection_name}/shards/{shard_id}/snapshots')
      .method('get')
      .create(),
    
    /**
         * Create shard snapshot 
         * @description Create new snapshot of a shard for a collection
         */
    createShardSnapshot:
      client
      .path('/collections/{collection_name}/shards/{shard_id}/snapshots')
      .method('post')
      .create({
        wait: true,
      }),
    
    /**
         * Download collection snapshot 
         * @description Download specified snapshot of a shard from a collection as a file
         */
    getShardSnapshot:
      client
      .path('/collections/{collection_name}/shards/{shard_id}/snapshots/{snapshot_name}')
      .method('get')
      .create(),
    
    /**
         * Delete shard snapshot 
         * @description Delete snapshot of a shard for a collection
         */
    deleteShardSnapshot:
      client
      .path('/collections/{collection_name}/shards/{shard_id}/snapshots/{snapshot_name}')
      .method('delete')
      .create({
        wait: true,
      }),
    
    /**
         * Get point 
         * @description Retrieve full information of single point by id
         */
    getPoint:
      client
      .path('/collections/{collection_name}/points/{id}')
      .method('get')
      .create(),
    
    /**
         * Upsert points 
         * @description Perform insert + updates on points. If point with given ID already exists - it will be overwritten.
         */
    upsertPoints:
      client
      .path('/collections/{collection_name}/points')
      .method('put')
      .create({
        wait: true,
        ordering: true,
        timeout: true,
      }),
    
    /**
         * Get points 
         * @description Retrieve multiple points by specified IDs
         */
    getPoints:
      client
      .path('/collections/{collection_name}/points')
      .method('post')
      .create({
        consistency: true,
        timeout: true,
      }),
    
    /**
         * Delete points 
         * @description Delete points
         */
    deletePoints:
      client
      .path('/collections/{collection_name}/points/delete')
      .method('post')
      .create({
        wait: true,
        ordering: true,
        timeout: true,
      }),
    
    /**
         * Update vectors 
         * @description Update specified named vectors on points, keep unspecified vectors intact.
         */
    updateVectors:
      client
      .path('/collections/{collection_name}/points/vectors')
      .method('put')
      .create({
        wait: true,
        ordering: true,
        timeout: true,
      }),
    
    /**
         * Delete vectors 
         * @description Delete named vectors from the given points.
         */
    deleteVectors:
      client
      .path('/collections/{collection_name}/points/vectors/delete')
      .method('post')
      .create({
        wait: true,
        ordering: true,
        timeout: true,
      }),
    
    /**
         * Overwrite payload 
         * @description Replace full payload of points with new one
         */
    overwritePayload:
      client
      .path('/collections/{collection_name}/points/payload')
      .method('put')
      .create({
        wait: true,
        ordering: true,
        timeout: true,
      }),
    
    /**
         * Set payload 
         * @description Set payload values for points
         */
    setPayload:
      client
      .path('/collections/{collection_name}/points/payload')
      .method('post')
      .create({
        wait: true,
        ordering: true,
        timeout: true,
      }),
    
    /**
         * Delete payload 
         * @description Delete specified key payload for points
         */
    deletePayload:
      client
      .path('/collections/{collection_name}/points/payload/delete')
      .method('post')
      .create({
        wait: true,
        ordering: true,
        timeout: true,
      }),
    
    /**
         * Clear payload 
         * @description Remove all payload for specified points
         */
    clearPayload:
      client
      .path('/collections/{collection_name}/points/payload/clear')
      .method('post')
      .create({
        wait: true,
        ordering: true,
        timeout: true,
      }),
    
    /**
         * Batch update points 
         * @description Apply a series of update operations for points, vectors and payloads
         */
    batchUpdate:
      client
      .path('/collections/{collection_name}/points/batch')
      .method('post')
      .create({
        wait: true,
        ordering: true,
        timeout: true,
      }),
    
    /**
         * Scroll points 
         * @description Scroll request - paginate over all points which matches given filtering condition
         */
    scrollPoints:
      client
      .path('/collections/{collection_name}/points/scroll')
      .method('post')
      .create({
        consistency: true,
        timeout: true,
      }),
    
    /**
         * Count points 
         * @description Count points which matches given filtering condition
         */
    countPoints:
      client
      .path('/collections/{collection_name}/points/count')
      .method('post')
      .create({
        consistency: true,
        timeout: true,
      }),
    
    /**
         * Facet a payload key with a given filter. 
         * @description Count points that satisfy the given filter for each unique value of a payload key.
         */
    facet:
      client
      .path('/collections/{collection_name}/facet')
      .method('post')
      .create({
        consistency: true,
        timeout: true,
      }),
    
    /**
         * Query points 
         * @description Universally query points. This endpoint covers all capabilities of search, recommend, discover, filters. But also enables hybrid and multi-stage queries.
         */
    queryPoints:
      client
      .path('/collections/{collection_name}/points/query')
      .method('post')
      .create({
        consistency: true,
        timeout: true,
      }),
    
    /**
         * Query points in batch 
         * @description Universally query points in batch. This endpoint covers all capabilities of search, recommend, discover, filters. But also enables hybrid and multi-stage queries.
         */
    queryBatchPoints:
      client
      .path('/collections/{collection_name}/points/query/batch')
      .method('post')
      .create({
        consistency: true,
        timeout: true,
      }),
    
    /**
         * Query points, grouped by a given payload field 
         * @description Universally query points, grouped by a given payload field
         */
    queryPointsGroups:
      client
      .path('/collections/{collection_name}/points/query/groups')
      .method('post')
      .create({
        consistency: true,
        timeout: true,
      }),
    
    /**
         * Search points matrix distance pairs 
         * @description Compute distance matrix for sampled points with a pair based output format
         */
    searchMatrixPairs:
      client
      .path('/collections/{collection_name}/points/search/matrix/pairs')
      .method('post')
      .create({
        consistency: true,
        timeout: true,
      }),
    
    /**
         * Search points matrix distance offsets 
         * @description Compute distance matrix for sampled points with an offset based output format
         */
    searchMatrixOffsets:
      client
      .path('/collections/{collection_name}/points/search/matrix/offsets')
      .method('post')
      .create({
        consistency: true,
        timeout: true,
      }),
      }
}
