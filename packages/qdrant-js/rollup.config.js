import terser from '@rollup/plugin-terser';
import nodeResolve from '@rollup/plugin-node-resolve';
import {writeFile} from 'fs/promises';

const createCommonJsPackage = () => ({
    name: 'cjs-package',
    buildEnd: () => writeFile('dist/cjs/package.json', JSON.stringify({type: 'commonjs'}, null, 4)),
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
    plugins: [createCommonJsPackage(), nodeResolve()],
};
