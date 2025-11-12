import {VectorOutput, DenseVector, MultiDenseVector, SparseVector} from './proto/points_pb.js';

// Extend the TypeScript interface for type safety
declare module './proto/points_pb.js' {
    interface VectorOutput {
        /**
         * Extracts dense vector data, trying the new `vector.dense` field first,
         * then falling back to deprecated `data` field if not present.
         *
         * @returns The dense vector as a number array, or undefined if not a dense vector
         */
        asDenseVector(): DenseVector | undefined;

        /**
         * Extracts sparse vector data, trying the new `vector.sparse` field first,
         * then falling back to deprecated `data` and `indices` fields if not present.
         *
         * @returns The sparse vector with values and indices, or undefined if not a sparse vector
         */
        asSparseVector(): SparseVector | undefined;

        /**
         * Extracts multi-dense vector data, trying the new `vector.multiDense` field first,
         * then falling back to deprecated `data` and `vectorsCount` fields if not present.
         *
         * @returns Array of dense vectors, or undefined if not a multi-dense vector
         */
        asMultiDenseVector(): MultiDenseVector | undefined;

        /**
         * Gets the vector type: 'dense', 'sparse', 'multiDense', or undefined
         */
        getVectorType(): 'dense' | 'sparse' | 'multiDense' | undefined;
    }
}

// Implementation: getDenseVector
VectorOutput.prototype.asDenseVector = function (): DenseVector | undefined {
    // Try new field first
    if (this.vector.case === 'dense') {
        return this.vector.value;
    }

    // Fall back to deprecated field (only if it's actually a dense vector, not sparse or multi)
    // We can tell it's dense if data is present but indices is not
    if (this.data.length > 0 && !this.indices && !this.vectorsCount) {
        return new DenseVector({data: this.data});
    }

    return undefined;
};

// Implementation: getSparseVector
VectorOutput.prototype.asSparseVector = function (): SparseVector | undefined {
    // Try new field first
    if (this.vector.case === 'sparse') {
        return this.vector.value;
    }

    // Fall back to deprecated fields
    if (this.data.length > 0 && this.indices) {
        return new SparseVector({
            values: this.data,
            indices: this.indices.data,
        });
    }

    return undefined;
};

// Implementation: getMultiDenseVector
VectorOutput.prototype.asMultiDenseVector = function (): MultiDenseVector | undefined {
    // Try new field first
    if (this.vector.case === 'multiDense') {
        return this.vector.value;
    }

    // Fall back to deprecated fields
    if (this.data.length > 0 && this.vectorsCount && this.vectorsCount > 0) {
        // Split flat array into multiple vectors based on vectorsCount
        const vectorSize = this.data.length / this.vectorsCount;
        const vectors: DenseVector[] = [];
        for (let i = 0; i < this.vectorsCount; i++) {
            const start = i * vectorSize;
            const end = start + vectorSize;
            vectors.push(new DenseVector({data: this.data.slice(start, end)}));
        }
        return new MultiDenseVector({vectors});
    }

    return undefined;
};

// Implementation: getVectorType
VectorOutput.prototype.getVectorType = function (): 'dense' | 'sparse' | 'multiDense' | undefined {
    // Check new fields first
    if (this.vector.case === 'dense') return 'dense';
    if (this.vector.case === 'sparse') return 'sparse';
    if (this.vector.case === 'multiDense') return 'multiDense';

    // Fall back to deprecated fields
    if (this.data.length > 0) {
        if (this.indices) return 'sparse';
        if (this.vectorsCount && this.vectorsCount > 0) return 'multiDense';
        return 'dense';
    }

    return undefined;
};
