import {describe, it, expect} from 'vitest';
import {VectorOutput, DenseVector, SparseVector, MultiDenseVector, SparseIndices} from '../../src/index.js';

describe('VectorOutput extensions', () => {
    describe('asDenseVector', () => {
        it('should extract dense vector from new field', () => {
            const denseVec = new DenseVector({data: [1.0, 2.0, 3.0]});
            const vector = new VectorOutput({
                vector: {
                    case: 'dense',
                    value: denseVec,
                },
            });

            const result = vector.asDenseVector();
            expect(result).toBe(denseVec);
            expect(result?.data).toEqual([1.0, 2.0, 3.0]);
        });

        it('should extract dense vector from deprecated field', () => {
            const vector = new VectorOutput({
                data: [1.0, 2.0, 3.0],
            });

            const result = vector.asDenseVector();
            expect(result).toBeInstanceOf(DenseVector);
            expect(result?.data).toEqual([1.0, 2.0, 3.0]);
        });

        it('should return undefined for non-dense vectors', () => {
            const vector = new VectorOutput({
                vector: {
                    case: 'sparse',
                    value: new SparseVector({values: [1.0, 2.0], indices: [0, 5]}),
                },
            });

            const result = vector.asDenseVector();
            expect(result).toBeUndefined();
        });

        it('should return undefined when data has sparse indices', () => {
            const vector = new VectorOutput({
                data: [1.0, 2.0],
                indices: new SparseIndices({data: [0, 5]}),
            });

            const result = vector.asDenseVector();
            expect(result).toBeUndefined();
        });
    });

    describe('asSparseVector', () => {
        it('should extract sparse vector from new field', () => {
            const sparseVec = new SparseVector({values: [1.0, 2.0], indices: [0, 5]});
            const vector = new VectorOutput({
                vector: {
                    case: 'sparse',
                    value: sparseVec,
                },
            });

            const result = vector.asSparseVector();
            expect(result).toBe(sparseVec);
            expect(result?.values).toEqual([1.0, 2.0]);
            expect(result?.indices).toEqual([0, 5]);
        });

        it('should extract sparse vector from deprecated fields', () => {
            const vector = new VectorOutput({
                data: [1.0, 2.0],
                indices: new SparseIndices({data: [0, 5]}),
            });

            const result = vector.asSparseVector();
            expect(result).toBeInstanceOf(SparseVector);
            expect(result?.values).toEqual([1.0, 2.0]);
            expect(result?.indices).toEqual([0, 5]);
        });

        it('should return undefined for non-sparse vectors', () => {
            const vector = new VectorOutput({
                vector: {
                    case: 'dense',
                    value: new DenseVector({data: [1.0, 2.0, 3.0]}),
                },
            });

            const result = vector.asSparseVector();
            expect(result).toBeUndefined();
        });
    });

    describe('asMultiDenseVector', () => {
        it('should extract multi-dense vector from new field', () => {
            const multiDense = new MultiDenseVector({
                vectors: [new DenseVector({data: [1.0, 2.0]}), new DenseVector({data: [3.0, 4.0]})],
            });
            const vector = new VectorOutput({
                vector: {
                    case: 'multiDense',
                    value: multiDense,
                },
            });

            const result = vector.asMultiDenseVector();
            expect(result).toBe(multiDense);
            expect(result?.vectors).toHaveLength(2);
            expect(result?.vectors[0].data).toEqual([1.0, 2.0]);
            expect(result?.vectors[1].data).toEqual([3.0, 4.0]);
        });

        it('should extract multi-dense vector from deprecated fields', () => {
            const vector = new VectorOutput({
                data: [1.0, 2.0, 3.0, 4.0],
                vectorsCount: 2,
            });

            const result = vector.asMultiDenseVector();
            expect(result).toBeInstanceOf(MultiDenseVector);
            expect(result?.vectors).toHaveLength(2);
            expect(result?.vectors[0].data).toEqual([1.0, 2.0]);
            expect(result?.vectors[1].data).toEqual([3.0, 4.0]);
        });

        it('should return undefined for non-multi-dense vectors', () => {
            const vector = new VectorOutput({
                vector: {
                    case: 'dense',
                    value: new DenseVector({data: [1.0, 2.0, 3.0]}),
                },
            });

            const result = vector.asMultiDenseVector();
            expect(result).toBeUndefined();
        });
    });

    describe('getVectorType', () => {
        it('should identify dense vector from new field', () => {
            const vector = new VectorOutput({
                vector: {
                    case: 'dense',
                    value: new DenseVector({data: [1.0, 2.0, 3.0]}),
                },
            });

            expect(vector.getVectorType()).toBe('dense');
        });

        it('should identify sparse vector from new field', () => {
            const vector = new VectorOutput({
                vector: {
                    case: 'sparse',
                    value: new SparseVector({values: [1.0, 2.0], indices: [0, 5]}),
                },
            });

            expect(vector.getVectorType()).toBe('sparse');
        });

        it('should identify multi-dense vector from new field', () => {
            const vector = new VectorOutput({
                vector: {
                    case: 'multiDense',
                    value: new MultiDenseVector({
                        vectors: [new DenseVector({data: [1.0, 2.0]})],
                    }),
                },
            });

            expect(vector.getVectorType()).toBe('multiDense');
        });

        it('should identify dense vector from deprecated field', () => {
            const vector = new VectorOutput({
                data: [1.0, 2.0, 3.0],
            });

            expect(vector.getVectorType()).toBe('dense');
        });

        it('should identify sparse vector from deprecated fields', () => {
            const vector = new VectorOutput({
                data: [1.0, 2.0],
                indices: new SparseIndices({data: [0, 5]}),
            });

            expect(vector.getVectorType()).toBe('sparse');
        });

        it('should identify multi-dense vector from deprecated fields', () => {
            const vector = new VectorOutput({
                data: [1.0, 2.0, 3.0, 4.0],
                vectorsCount: 2,
            });

            expect(vector.getVectorType()).toBe('multiDense');
        });

        it('should return undefined for empty vector', () => {
            const vector = new VectorOutput();

            expect(vector.getVectorType()).toBeUndefined();
        });
    });
});
