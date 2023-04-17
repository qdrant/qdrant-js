import {defineConfig} from 'vitest/config';

export default defineConfig({
    test: {
        name: 'integration',
        root: 'tests/integration',
    },
});
