import terser from '@rollup/plugin-terser';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import {writeFile} from 'fs/promises';

const createCommonJsPackage = () => ({
    name: 'cjs-package',
    buildEnd: () => writeFile('dist/cjs/package.json', '{"type":"commonjs"}'),
});

export default {
    input: 'dist/esm/index.js',
    output: [
        {
            file: 'dist/browser/index.cjs',
            format: 'cjs',
        },
        {
            file: 'dist/browser/index.min.cjs',
            format: 'cjs',
            plugins: [terser()],
        },
        {
            file: 'dist/browser/index.js',
            format: 'es',
        },
        {
            file: 'dist/browser/index.min.js',
            format: 'es',
            plugins: [terser()],
        },
    ],
    plugins: [
        createCommonJsPackage(),
        nodeResolve(),
        commonjs(),
        replace({
            preventAssignment: true,
            values: {
                // replace "process" with `undefined` since this is for browser only.
                // Rollup's dead code elimination will remove any remaining deps.
                process: 'undefined',
            },
        }),
    ],
};
