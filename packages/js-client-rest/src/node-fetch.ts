/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment */

import {Agent, fetch as undiciFetch} from 'undici';
import {FetchFn} from './types.js';

/**
 * Build a `fetch` backed by `undici`'s own `fetch` and an `undici` `Agent` from
 * the *same* package, so the dispatcher contract always matches the fetch that
 * consumes it — regardless of the undici version Node ships (fixes #134).
 *
 * This module is the *only* place that imports `undici`, and it must only ever
 * be referenced behind a `process` guard at the call site (see `api-client.ts`).
 * Bundlers targeting the browser replace `process` with `undefined`, which makes
 * that branch dead and lets them drop this whole module — and the `undici`
 * dependency along with it — from the browser build.
 */
export function createNodeFetch(connections?: number): FetchFn {
    const agent = new Agent({
        // timeouts are handled by AbortSignal in our middleware
        bodyTimeout: 0,
        headersTimeout: 0,
        // a sensible max connections value
        connections,
        // will be overridden by header Keep-Alive, just a sensible default
        keepAliveTimeout: 10_000,
    });
    // undici's fetch/Response/RequestInit are structurally compatible with the
    // DOM lib types we expose via FetchFn, but not assignable, so cast across.
    type UndiciRequestInit = Parameters<typeof undiciFetch>[1];
    return ((url: string, init?: RequestInit) =>
        undiciFetch(url, {...init, dispatcher: agent} as unknown as UndiciRequestInit)) as unknown as FetchFn;
}
