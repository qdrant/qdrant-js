import {defineConfig} from 'vitest/config';

export default defineConfig({
    test: {
        name: 'unit',
        root: 'tests/unit',
        testTimeout: 1000,
    },
});
