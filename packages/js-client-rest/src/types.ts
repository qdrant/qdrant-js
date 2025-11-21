import {components} from './openapi/generated_schema.js';

export interface RestArgs {
    headers: Headers;
    timeout: number;
    connections?: number;
}

// Definitions (in OpenAPI 2.0) or Schemas (in OpenAPI 3.0) – Data models that describe your API inputs and outputs.
export type Schemas = components['schemas'];
