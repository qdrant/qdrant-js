import {Agent} from 'undici';

declare global {
    interface RequestInit {
        dispatcher?: Agent | undefined;
    }
}

export const createDispatcher = (connections = 25) =>
    new Agent({
        // timeouts are handled by AbortSignal in our middleware
        bodyTimeout: 0,
        headersTimeout: 0,
        // https://stackoverflow.com/a/36437932/558180
        // pipelining: 1,
        // a sensible max connections value
        connections,
        // will be overriden by header Keep-Alive, just as sensible default
        keepAliveTimeout: 10_000,
    });
