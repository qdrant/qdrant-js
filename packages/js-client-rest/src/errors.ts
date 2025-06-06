import {ApiResponse} from '@qdrant/openapi-typescript-fetch';

const MAX_CONTENT = 200;

class CustomError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class QdrantClientUnexpectedResponseError extends CustomError {
    static forResponse(response: ApiResponse<unknown>) {
        const statusCodeStr = `${response.status}`;
        const reasonPhraseStr = !response.statusText ? '(Unrecognized Status Code)' : `(${response.statusText})`;
        const statusStr = `${statusCodeStr} ${reasonPhraseStr}`.trim();
        const dataStr = response.data ? JSON.stringify(response.data, null, 2) : null;
        let shortContent = '';
        if (dataStr) {
            shortContent = dataStr.length <= MAX_CONTENT ? dataStr : dataStr.slice(0, -4) + ' ...';
        }
        const rawContentStr = `Raw response content:\n${shortContent}`;

        return new QdrantClientUnexpectedResponseError(`Unexpected Response: ${statusStr}\n${rawContentStr}`);
    }
}

export class QdrantClientConfigError extends CustomError {}

export class QdrantClientTimeoutError extends CustomError {}

export class QdrantClientResourceExhaustedError extends CustomError {
    retry_after: number;

    constructor(message: string, retryAfter: string) {
        super(message);

        const retryAfterNumber = Number(retryAfter);
        if (isNaN(retryAfterNumber)) {
            throw new CustomError(`Invalid retryAfter value: ${retryAfter}`);
        }
        this.retry_after = retryAfterNumber;

        Object.setPrototypeOf(this, new.target.prototype);
    }
}
