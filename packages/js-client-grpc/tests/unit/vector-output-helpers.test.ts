import {describe, it, expect} from 'vitest';
import {create} from '@bufbuild/protobuf';
import {
    VectorOutput,
    VectorOutputSchema,
    DenseVectorSchema,
    SparseVectorSchema,
    MultiDenseVectorSchema,
    SparseIndicesSchema,
    toDenseVector,
    toSparseVector,
    toMultiDenseVector,
    getVectorType,
} from '../../src/index.js';

describe('VectorOutput extensions', () => {
    describe('asDenseVector', () => {
        it('should extract dense vector from new field', () => {
            const denseVec = create(DenseVectorSchema, {data: [1.0, 2.0, 3.0]});
            const vector: VectorOutput = create(VectorOutputSchema, {
                vector: {
                    case: 'dense',
                    value: denseVec,
                },
            });

            const result = toDenseVector(vector);
            expect(result).toBe(denseVec);
            expect(result?.data).toEqual([1.0, 2.0, 3.0]);
        });

        it('should extract dense vector from deprecated field', () => {
            const vector = create(VectorOutputSchema, {
                data: [1.0, 2.0, 3.0],
            });

            const result = toDenseVector(vector);
            expect(result).toBeDefined();
            expect(result?.data).toEqual([1.0, 2.0, 3.0]);
        });

        it('should return undefined for non-dense vectors', () => {
            const vector = create(VectorOutputSchema, {
                vector: {
                    case: 'sparse',
                    value: create(SparseVectorSchema, {values: [1.0, 2.0], indices: [0, 5]}),
                },
            });

            const result = toDenseVector(vector);
            expect(result).toBeUndefined();
        });

        it('should return undefined when data has sparse indices', () => {
            const vector = create(VectorOutputSchema, {
                data: [1.0, 2.0],
                indices: create(SparseIndicesSchema, {data: [0, 5]}),
            });

            const result = toDenseVector(vector);
            expect(result).toBeUndefined();
        });
    });

    describe('asSparseVector', () => {
        it('should extract sparse vector from new field', () => {
            const sparseVec = create(SparseVectorSchema, {values: [1.0, 2.0], indices: [0, 5]});
            const vector = create(VectorOutputSchema, {
                vector: {
                    case: 'sparse',
                    value: sparseVec,
                },
            });

            const result = toSparseVector(vector);
            expect(result).toBe(sparseVec);
            expect(result?.values).toEqual([1.0, 2.0]);
            expect(result?.indices).toEqual([0, 5]);
        });

        it('should extract sparse vector from deprecated fields', () => {
            const vector = create(VectorOutputSchema, {
                data: [1.0, 2.0],
                indices: create(SparseIndicesSchema, {data: [0, 5]}),
            });

            const result = toSparseVector(vector);
            expect(result).toBeDefined();
            expect(result?.values).toEqual([1.0, 2.0]);
            expect(result?.indices).toEqual([0, 5]);
        });

        it('should return undefined for non-sparse vectors', () => {
            const vector = create(VectorOutputSchema, {
                vector: {
                    case: 'dense',
                    value: create(DenseVectorSchema, {data: [1.0, 2.0, 3.0]}),
                },
            });

            const result = toSparseVector(vector);
            expect(result).toBeUndefined();
        });
    });

    describe('asMultiDenseVector', () => {
        it('should extract multi-dense vector from new field', () => {
            const multiDense = create(MultiDenseVectorSchema, {
                vectors: [create(DenseVectorSchema, {data: [1.0, 2.0]}), create(DenseVectorSchema, {data: [3.0, 4.0]})],
            });
            const vector = create(VectorOutputSchema, {
                vector: {
                    case: 'multiDense',
                    value: multiDense,
                },
            });

            const result = toMultiDenseVector(vector);
            expect(result).toBe(multiDense);
            expect(result?.vectors).toHaveLength(2);
            expect(result?.vectors[0].data).toEqual([1.0, 2.0]);
            expect(result?.vectors[1].data).toEqual([3.0, 4.0]);
        });

        it('should extract multi-dense vector from deprecated fields', () => {
            const vector = create(VectorOutputSchema, {
                data: [1.0, 2.0, 3.0, 4.0],
                vectorsCount: 2,
            });

            const result = toMultiDenseVector(vector);
            expect(result).toBeDefined();
            expect(result?.vectors).toHaveLength(2);
            expect(result?.vectors[0].data).toEqual([1.0, 2.0]);
            expect(result?.vectors[1].data).toEqual([3.0, 4.0]);
        });

        it('should return undefined for non-multi-dense vectors', () => {
            const vector = create(VectorOutputSchema, {
                vector: {
                    case: 'dense',
                    value: create(DenseVectorSchema, {data: [1.0, 2.0, 3.0]}),
                },
            });

            const result = toMultiDenseVector(vector);
            expect(result).toBeUndefined();
        });
    });

    describe('getVectorType', () => {
        it('should identify dense vector from new field', () => {
            const vector = create(VectorOutputSchema, {
                vector: {
                    case: 'dense',
                    value: create(DenseVectorSchema, {data: [1.0, 2.0, 3.0]}),
                },
            });

            expect(getVectorType(vector)).toBe('dense');
        });

        it('should identify sparse vector from new field', () => {
            const vector = create(VectorOutputSchema, {
                vector: {
                    case: 'sparse',
                    value: create(SparseVectorSchema, {values: [1.0, 2.0], indices: [0, 5]}),
                },
            });

            expect(getVectorType(vector)).toBe('sparse');
        });

        it('should identify multi-dense vector from new field', () => {
            const vector = create(VectorOutputSchema, {
                vector: {
                    case: 'multiDense',
                    value: create(MultiDenseVectorSchema, {
                        vectors: [create(DenseVectorSchema, {data: [1.0, 2.0]})],
                    }),
                },
            });

            expect(getVectorType(vector)).toBe('multiDense');
        });

        it('should identify dense vector from deprecated field', () => {
            const vector = create(VectorOutputSchema, {
                data: [1.0, 2.0, 3.0],
            });

            expect(getVectorType(vector)).toBe('dense');
        });

        it('should identify sparse vector from deprecated fields', () => {
            const vector = create(VectorOutputSchema, {
                data: [1.0, 2.0],
                indices: create(SparseIndicesSchema, {data: [0, 5]}),
            });

            expect(getVectorType(vector)).toBe('sparse');
        });

        it('should identify multi-dense vector from deprecated fields', () => {
            const vector = create(VectorOutputSchema, {
                data: [1.0, 2.0, 3.0, 4.0],
                vectorsCount: 2,
            });

            expect(getVectorType(vector)).toBe('multiDense');
        });

        it('should return undefined for empty vector', () => {
            const vector = create(VectorOutputSchema, {});

            expect(getVectorType(vector)).toBeUndefined();
        });
    });
});
