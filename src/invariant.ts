import {QdrantClientInvariantViolation} from './errors.js';

/**
 * Use invariant() to assert state which your program assumes to be true.
 * A message must be provided describing the reason for the logic invariant.
 */
export function invariant(condition: boolean, message: string) {
    if (!condition) {
        throw new QdrantClientInvariantViolation(message);
    }
}
