import {defineConfig} from 'vitest/config';

export default defineConfig({
    test: {
        testTimeout: 1000,
        include: ['tests/unit/**/*.test.ts'],
        includeSource: ['src/**/*.ts'],
    },
});
