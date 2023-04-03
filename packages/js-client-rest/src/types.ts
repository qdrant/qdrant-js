import {components, operations} from './openapi/generated_schema.js';

export interface RestArgs {
    headers: Headers;
    timeout: number;
}

export type SchemaFor<K extends keyof T, T extends object = components['schemas']> = T[K];

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
type OperationResponses<
    K extends keyof T,
    U extends keyof T[K] = any,
    T extends operations = operations,
> = 'responses' extends U ? T[K]['responses'] : never;

// Definitions (in OpenAPI 2.0) or Schemas (in OpenAPI 3.0) – Data models that describe your API inputs and outputs.
export type Schemas = components['schemas'];
