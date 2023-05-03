import {writeFile} from 'node:fs/promises';

try {
    await writeFile('dist/cjs/package.json', '{"type":"commonjs"}');
} catch (e) {
    console.error(e);
    process.exit(1);
}
