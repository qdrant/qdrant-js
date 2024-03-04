import {Client} from '../api-client.js';

export function createSnapshotsApi(client: Client) {
    return {
        /**
         * Create new snapshot of the whole storage
         */
        createFullSnapshot: client.path('/snapshots').method('post').create({wait: true}),

        /**
         * Create new snapshot for a collection
         */
        createSnapshot: client.path('/collections/{collection_name}/snapshots').method('post').create({wait: true}),

        /**
         * Delete snapshot of the whole storage
         */
        deleteFullSnapshot: client.path('/snapshots/{snapshot_name}').method('delete').create({wait: true}),

        /**
         * Delete snapshot for a collection
         */
        deleteSnapshot: client
            .path('/collections/{collection_name}/snapshots/{snapshot_name}')
            .method('delete')
            .create({wait: true}),

        /**
         * Download specified snapshot of the whole storage as a file
         * @todo Fetcher needs to handle Blob for file downloads
         */
        getFullSnapshot: client.path('/snapshots/{snapshot_name}').method('get').create(),

        /**
         * Download specified snapshot from a collection as a file
         * @todo Fetcher needs to handle Blob for file downloads
         */
        getSnapshot: client.path('/collections/{collection_name}/snapshots/{snapshot_name}').method('get').create(),

        /**
         * Get list of snapshots of the whole storage
         */
        listFullSnapshots: client.path('/snapshots').method('get').create(),

        /**
         * Get list of snapshots for a collection
         */
        listSnapshots: client.path('/collections/{collection_name}/snapshots').method('get').create(),

        /**
         * Recover local collection data from an uploaded snapshot. This will overwrite any data, stored on this node, for the collection. If collection does not exist - it will be created.
         */
        recoverFromUploadedSnapshot: client
            .path('/collections/{collection_name}/snapshots/upload')
            .method('post')
            .create({wait: true, priority: true, checksum: true}),

        /**
         * Recover local collection data from a snapshot. This will overwrite any data, stored on this node, for the collection. If collection does not exist - it will be created
         */
        recoverFromSnapshot: client
            .path('/collections/{collection_name}/snapshots/recover')
            .method('put')
            .create({wait: true}),

        /**
         * Recover shard of a local collection from an uploaded snapshot. This will overwrite any data, stored on this node, for the collection shard
         */
        recoverShardFromUploadedSnapshot: client
            .path('/collections/{collection_name}/shards/{shard_id}/snapshots/upload')
            .method('post')
            .create({wait: true, priority: true, checksum: true}),

        /**
         * Recover shard of a local collection data from a snapshot. This will overwrite any data, stored in this shard, for the collection
         */
        recoverShardFromSnapshot: client
            .path('/collections/{collection_name}/shards/{shard_id}/snapshots/recover')
            .method('put')
            .create({wait: true}),

        /**
         * Get list of snapshots for a shard of a collection
         */
        listShardSnapshots: client
            .path('/collections/{collection_name}/shards/{shard_id}/snapshots')
            .method('get')
            .create(),

        /**
         * Create new snapshot of a shard for a collection
         */
        createShardSnapshot: client
            .path('/collections/{collection_name}/shards/{shard_id}/snapshots')
            .method('post')
            .create({wait: true}),

        /**
         * Download specified snapshot of a shard from a collection as a file
         */
        getShardSnapshot: client
            .path('/collections/{collection_name}/shards/{shard_id}/snapshots/{snapshot_name}')
            .method('get')
            .create(),

        /**
         * Delete snapshot of a shard for a collection
         */
        deleteShardSnapshot: client
            .path('/collections/{collection_name}/shards/{shard_id}/snapshots/{snapshot_name}')
            .method('delete')
            .create({wait: true}),
    } as const;
}
