import terser from '@rollup/plugin-terser';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';

export default {
    input: 'dist/esm/index.js',
    output: [
        {
            file: 'dist/browser/index.js',
            format: 'es',
        },
        {
            file: 'dist/browser/index.min.js',
            format: 'es',
            plugins: [terser()],
        },
        {
            file: 'dist/browser/index.cjs.js',
            format: 'cjs',
        },
        {
            file: 'dist/browser/index.cjs.min.js',
            format: 'cjs',
            plugins: [terser()],
        },
    ],
    plugins: [
        nodeResolve(),
        replace({
            'import.meta.vitest': 'undefined',
        }),
    ],
};
