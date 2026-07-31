import {components} from './openapi/generated_schema.js';
import {deprecatedComponents} from './openapi/deprecated_schema.js';

export interface RestArgs {
    headers: Headers;
    timeout: number;
    connections?: number;
}

// Definitions (in OpenAPI 2.0) or Schemas (in OpenAPI 3.0) – Data models that describe your API inputs and outputs.
// The deprecated half is no longer part of Qdrant's OpenAPI spec, see `openapi/deprecated_schema.ts`.
export type Schemas = components['schemas'] & deprecatedComponents['schemas'];
