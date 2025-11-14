import {VectorOutput, DenseVector, MultiDenseVector, SparseVector} from './proto/points_pb.js';
import {create} from '@bufbuild/protobuf';
import {DenseVectorSchema, MultiDenseVectorSchema, SparseVectorSchema} from './proto/points_pb.js';

/**
 * Extracts dense vector data, trying the new `vector.dense` field first,
 * then falling back to deprecated `data` field if not present.
 *
 * @returns The dense vector as a DenseVector, or undefined if not a dense vector
 */
export function toDenseVector(output: VectorOutput): DenseVector | undefined {
    // Try new field first
    if (output.vector.case === 'dense') {
        return output.vector.value;
    }

    // Fall back to deprecated field (only if it's actually a dense vector, not sparse or multi)
    // We can tell it's dense if data is present but indices is not
    if (output.data.length > 0 && !output.indices && !output.vectorsCount) {
        return create(DenseVectorSchema, {data: output.data});
    }

    return undefined;
}

/**
 * Extracts sparse vector data, trying the new `vector.sparse` field first,
 * then falling back to deprecated `data` and `indices` fields if not present.
 *
 * @returns The sparse vector with values and indices, or undefined if not a sparse vector
 */
export function toSparseVector(output: VectorOutput): SparseVector | undefined {
    // Try new field first
    if (output.vector.case === 'sparse') {
        return output.vector.value;
    }

    // Fall back to deprecated fields
    if (output.data.length > 0 && output.indices) {
        return create(SparseVectorSchema, {
            values: output.data,
            indices: output.indices.data,
        });
    }

    return undefined;
}

/**
 * Extracts multi-dense vector data, trying the new `vector.multiDense` field first,
 * then falling back to deprecated `data` and `vectorsCount` fields if not present.
 *
 * @returns Array of dense vectors, or undefined if not a multi-dense vector
 */
export function toMultiDenseVector(output: VectorOutput): MultiDenseVector | undefined {
    // Try new field first
    if (output.vector.case === 'multiDense') {
        return output.vector.value;
    }

    // Fall back to deprecated fields
    if (output.data.length > 0 && output.vectorsCount && output.vectorsCount > 0) {
        // Split flat array into multiple vectors based on vectorsCount
        const vectorSize = output.data.length / Number(output.vectorsCount);
        const vectors: DenseVector[] = [];
        for (let i = 0; i < output.vectorsCount; i++) {
            const start = i * vectorSize;
            const end = start + vectorSize;
            vectors.push(create(DenseVectorSchema, {data: output.data.slice(start, end)}));
        }
        return create(MultiDenseVectorSchema, {vectors});
    }

    return undefined;
}

/**
 * Gets the vector type: 'dense', 'sparse', 'multiDense', or undefined
 */
export function getVectorType(output: VectorOutput): 'dense' | 'sparse' | 'multiDense' | undefined {
    // Check new fields first
    if (output.vector.case === 'dense') return 'dense';
    if (output.vector.case === 'sparse') return 'sparse';
    if (output.vector.case === 'multiDense') return 'multiDense';

    // Fall back to deprecated fields
    if (output.data.length > 0) {
        if (output.indices) return 'sparse';
        if (output.vectorsCount && output.vectorsCount > 0) return 'multiDense';
        return 'dense';
    }

    return undefined;
}
