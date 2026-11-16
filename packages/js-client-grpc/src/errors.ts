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

    // ConnectError overrides `instanceof` to match any ConnectError, so restore the prototype chain check.
    static override [Symbol.hasInstance](value: unknown): boolean {
        return Function.prototype[Symbol.hasInstance].call(this, value);
    }

    constructor(message: string, retryAfter: string) {
        // Keep the `ConnectError` name set by the base class: connect only passes an error thrown
        // in an interceptor through unchanged if it is recognized as a ConnectError.
        super(message, Code.ResourceExhausted);

        const retryAfterNumber = Number(retryAfter);
        if (isNaN(retryAfterNumber)) {
            throw new CustomError(`Invalid retryAfter value: ${retryAfter}`);
        }
        this.retry_after = retryAfterNumber;

        Object.setPrototypeOf(this, new.target.prototype);
    }
}
