import {Code, ConnectError} from '@connectrpc/connect';

class CustomError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class QdrantClientConfigError extends CustomError {}

export class QdrantClientResourceExhaustedError extends ConnectError {
    retry_after: number;

    constructor(message: string, retryAfter: string) {
        super(message, Code.ResourceExhausted);
        this.name = this.constructor.name;

        const retryAfterNumber = Number(retryAfter);
        if (isNaN(retryAfterNumber)) {
            throw new CustomError(`Invalid retryAfter value: ${retryAfter}`);
        }
        this.retry_after = retryAfterNumber;

        Object.setPrototypeOf(this, new.target.prototype);
    }
}
