import {components} from './openapi/generated_schema.js';

/**
 * A WHATWG-compatible `fetch` implementation. Used to let callers inject their
 * own transport (e.g. `undici`'s `fetch`, a proxy-aware fetch, or a test double).
 */
export type FetchFn = (input: string, init?: RequestInit) => Promise<Response>;

export interface RestArgs {
    headers: Headers;
    timeout: number;
    connections?: number;
    /**
     * Custom `fetch` implementation. When provided it is used for every request
     * instead of the built-in undici / global-fetch transport.
     */
    fetch?: FetchFn;
}

// Definitions (in OpenAPI 2.0) or Schemas (in OpenAPI 3.0) – Data models that describe your API inputs and outputs.
export type Schemas = components['schemas'];
