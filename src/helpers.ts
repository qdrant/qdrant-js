type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

type UnionToOvlds<U> = UnionToIntersection<U extends any ? (f: U) => void : never>;

type PopUnion<U> = UnionToOvlds<U> extends (a: infer A) => void ? A : never;

type UnionConcat<T extends string, U extends string> = PopUnion<T> extends infer S
    ? S extends string
        ? Exclude<T, S> extends never
            ? S
            : `${UnionConcat<Exclude<T, S>, U>}${U}${S}`
        : never
    : never;

export type ExclusiveParams<
    T extends object,
    U extends string,
    C extends string = UnionConcat<U, '`, `'>,
> = U extends keyof T ? `Only one of \`${C}\` params can be set` & T : T;

// export function genericObjectEntries<T extends object>(o: Record<keyof T, T> | ArrayLike<T>): [keyof T, T][] {
//     return Object.entries(o) as [keyof T, T][];
// }

// type HttpMethods = 'get' | 'post' | 'put' | 'delete' | 'patch';

// type Client = {
//     [O in keyof operations]: {
//         [P in keyof paths as operations[O] extends paths[P][keyof paths[P]] ? P : never]: paths[P][keyof paths[P]] & {
//             method: keyof paths[P];
//             path: P;
//         };
//     } extends Record<string, infer R>
//         ? R
//         : never;
// };

// class Client()
