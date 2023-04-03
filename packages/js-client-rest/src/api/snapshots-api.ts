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
         * Recover local collection data from a snapshot. This will overwrite any data, stored on this node, for the collection. If collection does not exist - it will be created.
         */
        recoverFromSnapshot: client
            .path('/collections/{collection_name}/snapshots/recover')
            .method('put')
            .create({wait: true}),
    } as const;
}
