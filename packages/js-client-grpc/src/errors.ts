import {Code, ConnectError} from '@bufbuild/connect';

class CustomError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class QdrantClientConfigError extends CustomError {}

class CustomConnectError extends ConnectError {
    retry_after: string;

    constructor(retryAfter: string) {
        super('Resource exhausted: Retry after specified duration', Code.ResourceExhausted);
        this.name = this.constructor.name;
        this.retry_after = retryAfter;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class ResourceExhaustedError extends CustomConnectError {}
