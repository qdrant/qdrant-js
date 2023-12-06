import {Client} from '../api-client.js';

export function createShardsApi(client: Client) {
    return {
        createShardKey: client.path('/collections/{collection_name}/shards').method('put').create({timeout: true}),

        deleteShardKey: client
            .path('/collections/{collection_name}/shards/delete')
            .method('post')
            .create({timeout: true}),
    } as const;
}
