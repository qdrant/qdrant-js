import {ApiError, Middleware, TypedFetch} from '@qdrant/openapi-typescript-fetch';

type Method = 'get' | 'post' | 'put' | 'patch' | 'delete' | 'head' | 'options';

type OpenapiPaths<Paths> = {
    [P in keyof Paths]: {
        [M in Method]?: unknown;
    };
};

type Client<Paths extends OpenapiPaths<Paths>> = {
    configure: (config: FetchConfig) => void;
    path: <P extends keyof Paths>(
        path: P,
    ) => {
        method: <M extends keyof Paths[P]>(
            method: M,
        ) => {
            create: (queryParams?: Record<string, true | 1>) => TypedFetch<Paths[P][M]>;
        };
    };
};

type ApiResponse<R = unknown> = {
    readonly headers: Headers;
    readonly url: string;
    readonly ok: boolean;
    readonly status: number;
    readonly statusText: string;
    readonly data: R;
};

type CustomRequestInit = Omit<RequestInit, 'headers'> & {
    readonly headers: Headers;
};

type RuntimeFetch = (url: string, init: CustomRequestInit) => Promise<ApiResponse>;

type RequestDefinition = {
    baseUrl: string;
    method: Method;
    path: string;
    queryParams: string[];
    payload: unknown;
    init?: RequestInit;
    fetch: RuntimeFetch;
};

export type FetchImplementation = typeof globalThis.fetch;

type FetchConfig = {
    baseUrl?: string;
    init?: RequestInit;
    use?: Middleware[];
    fetch?: FetchImplementation;
};

const canSendBody = (method: Method) =>
    method === 'post' || method === 'put' || method === 'patch' || method === 'delete';

function queryString(params: Record<string, unknown>) {
    const qs: string[] = [];
    const encode = (key: string, value: unknown) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;

    Object.keys(params).forEach((key) => {
        const value = params[key];
        if (value != null) {
            if (Array.isArray(value)) {
                value.forEach((item) => qs.push(encode(key, item)));
            } else {
                qs.push(encode(key, value));
            }
        }
    });

    return qs.length > 0 ? `?${qs.join('&')}` : '';
}

function omitKeys(payload: Record<string, unknown>, keys: string[]) {
    return Object.fromEntries(Object.entries(payload).filter(([key]) => !keys.includes(key)));
}

function getPath(path: string, payload: Record<string, unknown>) {
    return path.replace(/\{([^}]+)\}/g, (_, key: string) => {
        const value = encodeURIComponent(String(payload[key]));
        return value;
    });
}

function getQuery(method: Method, payload: Record<string, unknown>, query: string[]) {
    if (canSendBody(method)) {
        return queryString(Object.fromEntries(query.map((key) => [key, payload[key]])) as Record<string, unknown>);
    }

    return queryString(payload);
}

function getHeaders(body: BodyInit | undefined, init?: HeadersInit) {
    const headers = new Headers(init);

    if (body !== undefined && !(body instanceof FormData) && !headers.has('Content-Type')) {
        headers.append('Content-Type', 'application/json');
    }

    if (!headers.has('Accept')) {
        headers.append('Accept', 'application/json');
    }

    return headers;
}

function getBody(method: Method, payload: unknown) {
    if (!canSendBody(method)) {
        return undefined;
    }

    const body = payload instanceof FormData ? payload : JSON.stringify(payload);
    return method === 'delete' && body === '{}' ? undefined : body;
}

function mergeRequestInit(first?: RequestInit, second?: RequestInit): RequestInit {
    const headers = new Headers(first?.headers);
    const other = new Headers(second?.headers);

    other.forEach((value, key) => {
        headers.set(key, value);
    });

    return {...first, ...second, headers};
}

function clonePayload(payload: unknown): Record<string, unknown> | unknown[] {
    if (!payload || typeof payload !== 'object') {
        return {};
    }

    return Object.assign(Array.isArray(payload) ? [] : {}, payload) as Record<string, unknown> | unknown[];
}

function getFetchParams(request: RequestDefinition) {
    const payload = clonePayload(request.payload);
    const pathPayload = payload as Record<string, unknown>;
    const pathParamKeys = Array.from(request.path.matchAll(/\{([^}]+)\}/g), ([, key]) => key);
    const requestPayload = omitKeys(pathPayload, pathParamKeys);
    const path = getPath(request.path, pathPayload);
    const query = getQuery(request.method, requestPayload, request.queryParams);
    const body = getBody(request.method, omitKeys(requestPayload, request.queryParams));
    const headers = canSendBody(request.method)
        ? getHeaders(body, request.init?.headers)
        : new Headers(request.init?.headers);

    return {
        url: request.baseUrl + path + query,
        init: {
            ...request.init,
            method: request.method.toUpperCase(),
            headers,
            body,
        } satisfies CustomRequestInit,
    };
}

async function getResponseData(response: Response) {
    if (response.status === 204) {
        return undefined;
    }

    const contentType = response.headers.get('content-type');
    const responseText = await response.text();

    if (contentType?.includes('application/json')) {
        return JSON.parse(responseText);
    }

    try {
        return JSON.parse(responseText);
    } catch {
        return responseText;
    }
}

async function fetchJson(url: string, init: CustomRequestInit, fetchImpl: FetchImplementation): Promise<ApiResponse> {
    const response = await fetchImpl(url, init);
    const data = await getResponseData(response);
    const result = {
        headers: response.headers,
        url: response.url,
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        data,
    };

    if (result.ok) {
        return result;
    }

    throw new ApiError(result);
}

function wrapMiddlewares(middlewares: Middleware[], fetch: RuntimeFetch): RuntimeFetch {
    const handler = async (index: number, url: string, init: CustomRequestInit): Promise<ApiResponse> => {
        if (index === middlewares.length) {
            return fetch(url, init);
        }

        const current = middlewares[index];
        return current(url, init, (nextUrl, nextInit) => handler(index + 1, nextUrl, nextInit));
    };

    return (url, init) => handler(0, url, init);
}

async function fetchUrl(request: RequestDefinition) {
    const {url, init} = getFetchParams(request);
    return request.fetch(url, init);
}

function createTypedFetch<Operation>(fetch: (payload: unknown, init?: RequestInit) => Promise<ApiResponse>) {
    const fun = async (payload: unknown, init?: RequestInit) => {
        try {
            return await fetch(payload, init);
        } catch (err) {
            if (err instanceof ApiError) {
                throw new fun.Error(err);
            }
            throw err;
        }
    };

    fun.Error = class extends ApiError {
        constructor(error: ApiError) {
            super(error);
            Object.setPrototypeOf(this, new.target.prototype);
        }

        getActualType() {
            return {
                status: this.status,
                data: this.data as unknown,
            };
        }
    };

    return fun as unknown as TypedFetch<Operation>;
}

export function createFetcher<Paths extends OpenapiPaths<Paths>>(): Client<Paths> {
    let baseUrl = '';
    let defaultInit: RequestInit = {};
    let fetchImpl: FetchImplementation = globalThis.fetch;
    const middlewares: Middleware[] = [];

    return {
        configure: (config) => {
            baseUrl = config.baseUrl ?? '';
            defaultInit = config.init ?? {};
            fetchImpl = config.fetch ?? globalThis.fetch;
            middlewares.splice(0, middlewares.length, ...(config.use ?? []));
        },
        path: (path) => ({
            method: (method) => ({
                create: (queryParams) =>
                    createTypedFetch((payload, init) =>
                        fetchUrl({
                            baseUrl,
                            path: String(path),
                            method: String(method).toLowerCase() as Method,
                            queryParams: Object.keys(queryParams ?? {}),
                            payload,
                            init: mergeRequestInit(defaultInit, init),
                            fetch: wrapMiddlewares(middlewares, (url, requestInit) =>
                                fetchJson(url, requestInit, fetchImpl),
                            ),
                        }),
                    ),
            }),
        }),
    };
}
