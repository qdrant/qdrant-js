import {components} from '../openapi/generated_schema.ts';

export interface RestArgs {
    headers: Headers;
    http2: boolean;
    timeout: number;
}

type ObjectEntries<T> = [keyof T, T][];

type SchemaFor<K extends keyof T, T extends object = components['schemas']> = T[K];
