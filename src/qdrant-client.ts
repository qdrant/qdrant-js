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
    readonly #https: boolean;
    readonly #scheme: string;
    readonly #port: number;
    readonly #prefix: string;
    readonly #host: string;
    readonly #openApiClient: OpenApiClient;

    constructor({url, host, apiKey, https, prefix, port = 6333, timeout = 300_000, ...args}: QdrantClientParams) {
        this.#https = https ?? typeof apiKey === 'string';
        this.#scheme = this.#https ? 'https' : 'http';
        this.#prefix = prefix ?? '';

        if (this.#prefix.length > 0 && !this.#prefix.startsWith('/')) {
            this.#prefix = `/${this.#prefix}`;
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
            this.#host = parsedUrl.hostname;
            this.#port = parsedUrl.port ? Number(parsedUrl.port) : port;
            this.#scheme = parsedUrl.protocol.replace(':', '');

            if (this.#prefix.length > 0 && parsedUrl.pathname !== '/') {
                throw new QdrantClientConfigError(
                    'Prefix can be set either in `url` or in `prefix`.\n' +
                        `url is ${url}, prefix is ${parsedUrl.pathname}`,
                );
            }
        } else {
            this.#port = port;
            this.#host = host ?? 'localhost';
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
            if (this.#scheme === 'http') {
                console.warn('Api key is used with unsecure connection.');
            }
            http2 = true;
            headers.set('api-key', apiKey);
        }

        const restUri = `${this.#scheme}://${this.#host}:${this.#port}${this.#prefix}`;
        const restArgs: RestArgs = {headers, http2, timeout};

        this.#openApiClient = createApis(restUri, restArgs);
    }

    /**
     * REST Client
     *
     * @param string Name of api
     * @returns {OpenApiClient} An instance of raw REST API client, generated from OpenAPI schema
     */
    api<T extends keyof OpenApiClient>(name: T): OpenApiClient[T] {
        return this.#openApiClient[name];
    }

    /**
     * Get list name of all existing collections
     * @returns List of the collections
     */
    async getCollections() {
        // const getCollections = this.http.collectionsApi.getCollections;
        // try {
        const response = await this.#openApiClient.collections.getCollections({});
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
        const response = await this.#openApiClient.collections.getCollection({collection_name});
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
        const response = await this.#openApiClient.collections.updateCollection({
            collection_name,
            ...args,
        });
        invariant(/* @todo None */ response.data.result != null, 'Update collection returned None');
        return response.data.result;
    }
}
