import {OpenApiClient, createApis} from './api-client.js';
import {QdrantClientConfigError} from './errors.js';
import {invariant} from './invariant.js';
import {RestArgs, SchemaFor} from './types/global.js';

declare global {
    interface QdrantClientParams {
        port?: number;
        apiKey?: string;
        https?: boolean;
        prefix?: string;
        url?: string;
        host?: string;
        timeout?: number;
    }
}

export class QdrantClient {
    private _https: boolean;
    private _scheme: string;
    private _port: number;
    private _prefix: string;
    private _host: string;
    private _openApiClient: OpenApiClient;

    constructor({url, host, apiKey, https, prefix, port = 6333, timeout = 300_000, ...args}: QdrantClientParams) {
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
        if (host && (host.startsWith('http://') || host.startsWith('https://'))) {
            throw new QdrantClientConfigError(
                'The `host` param is not expected to contain protocol (http:// or https://).\n' +
                    'Try to use the `url` parameter instead.',
            );
        } else if (url) {
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

        let http2 = args.http2 ?? false;
        const headers = new Headers();

        const metadata = args.metadata ?? {};
        Object.keys(metadata).forEach((field) => {
            if (metadata[field]) {
                headers.set(field, String(metadata[field]));
            }
        });

        if (typeof apiKey === 'string') {
            if (this._scheme === 'http') {
                console.warn('Api key is used with unsecure connection.');
            }
            http2 = true;
            headers.set('api-key', apiKey);
        }

        const restUri = `${this._scheme}://${this._host}:${this._port}${this._prefix}`;
        const restArgs: RestArgs = {headers, http2, timeout};

        this._openApiClient = createApis(restUri, restArgs);
    }

    /**
     * REST Client
     *
     * @param string Name of api
     * @returns {OpenApiClient} An instance of raw REST API client, generated from OpenAPI schema
     */
    api<T extends keyof OpenApiClient>(name: T): OpenApiClient[T] {
        return this._openApiClient[name];
    }

    /**
     * Get list name of all existing collections
     * @returns List of the collections
     */
    async getCollections() {
        // const getCollections = this.http.collectionsApi.getCollections;
        // try {
        const response = await this._openApiClient.collections.getCollections({});
        invariant(/* @todo None */ response.data.result != null, 'Get collections returned None');
        return response.data.result;
        // } catch (e) {
        //     if (e instanceof getCollections.Error) {
        //         const error = e.getActualType();
        //         if (error.status === '4XX') {
        //             return error.data;
        //         }
        //     }
        // }
    }

    /**
     * Get detailed information about specified existing collection
     *
     * @param collection_name Name of the collection
     * @returns Detailed information about the collection
     */
    async getCollection(collection_name: string) {
        const response = await this._openApiClient.collections.getCollection({collection_name});
        invariant(/* @todo None */ response.data.result != null, 'Get collection returned None');
        return response.data.result;
    }

    /**
     * Update parameters of the collection
     *
     * @param collection_name Name of the collection
     * @param optimizer_config Override for optimizer configuration
     * @param collection_params Override for collection parameters
     * @param timeout
     *            Wait for operation commit timeout in seconds.
     *            If timeout is reached - request will return with service error.
     * @returns Operation result
     */
    async updateCollection(
        collection_name: string,
        args: {
            timeout?: number;
        } & SchemaFor<'UpdateCollection'>,
    ) {
        const response = await this._openApiClient.collections.updateCollection({
            collection_name,
            ...args,
        });
        invariant(/* @todo None */ response.data.result != null, 'Update collection returned None');
        return response.data.result;
    }
}
