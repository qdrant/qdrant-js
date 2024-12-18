import {test, expect} from 'vitest';
import {version} from '../../package.json';
import {PACKAGE_VERSION} from '../../src/client-version.js';

test('Client version is consistent', () => {
    expect(version).toBe(PACKAGE_VERSION);
});
