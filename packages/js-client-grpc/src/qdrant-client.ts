import {GrpcClients, createApis} from './api-client.js';
import {QdrantClientConfigError} from './errors.js';
import {ClientVersion, PACKAGE_VERSION} from './client-version.js';
import {HealthCheckRequest} from './proto/qdrant_pb.js';

export type QdrantClientParams = {
    port?: number | null;
    apiKey?: string;
    https?: boolean;
    prefix?: string;
    url?: string;
    host?: string;
    timeout?: number;
    check_compatibility?: boolean;
};

export class QdrantClient {
    private _https: boolean;
    private _scheme: string;
    private _port: number | null;
    private _prefix: string;
    private _host: string;
    private _grcpClients: GrpcClients;
    private _restUri: string;

    constructor({
        url,
        host,
        apiKey,
        https,
        prefix,
        port = 6334,
        timeout = 300_000,
        check_compatibility = true,
    }: QdrantClientParams = {}) {
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
            this._host = host ?? '127.0.0.1';
        }

        if (typeof apiKey === 'string') {
            if (this._scheme === 'http') {
                console.warn('Api key is used with unsecure connection.');
            }
        }

        const address = this._port ? `${this._host}:${this._port}` : this._host;
        this._restUri = `${this._scheme}://${address}${this._prefix}`;

        this._grcpClients = createApis(this._restUri, {apiKey, timeout});

        if (check_compatibility) {
            this._grcpClients.service
                .healthCheck(HealthCheckRequest)
                .then((response) => {
                    const serverVersion = response.version;
                    if (!ClientVersion.isCompatible(PACKAGE_VERSION, serverVersion)) {
                        console.warn(
                            `Client version ${PACKAGE_VERSION} is incompatible with server version ${serverVersion}. Major versions should match and minor version difference must not exceed 1. Set checkCompatibility=false to skip version check.`,
                        );
                    }
                })
                .catch(() => {
                    console.warn(
                        `Failed to obtain server version. Unable to check client-server compatibility. Set checkCompatibility=false to skip version check.`,
                    );
                });
        }
    }

    /**
     * API getter
     *
     * @param string Name of api
     * @returns An instance of a namespaced API, generated from grpc services.
     */
    api<T extends keyof GrpcClients>(name: T): GrpcClients[T] {
        return this._grcpClients[name];
    }
}
