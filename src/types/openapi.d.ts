export {};

declare global {
    interface QdrantClientParams {
        http2?: boolean;
        metadata?: Record<string, number | string | string[] | undefined>;
    }
}
