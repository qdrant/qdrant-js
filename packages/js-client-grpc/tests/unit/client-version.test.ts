import {test, expect} from 'vitest';
import {version} from '../../package.json';
import {PACKAGE_VERSION, ClientVersion} from '../../src/client-version.js';

test('Client version is consistent', () => {
    expect(version).toBe(PACKAGE_VERSION);
});

test.each([
    {input: '1.2', expected: {major: 1, minor: 2}},
    {input: '1.2.3', expected: {major: 1, minor: 2}},
])('parseVersion($input) should return $expected', ({input, expected}) => {
    const result = ClientVersion.parseVersion(input);
    expect(result).toEqual(expected);
});

test.each([
    {input: '', error: 'Version is null'},
    {input: '1', error: 'Unable to parse version, expected format: x.y[.z], found: 1'},
    {input: '1.', error: 'Unable to parse version, expected format: x.y[.z], found: 1.'},
    {input: '.1', error: 'Unable to parse version, expected format: x.y[.z], found: .1'},
    {input: '.1.', error: 'Unable to parse version, expected format: x.y[.z], found: .1.'},
    {input: '1.a.1', error: 'Unable to parse version, expected format: x.y[.z], found: 1.a.1'},
    {input: 'a.1.1', error: 'Unable to parse version, expected format: x.y[.z], found: a.1.1'},
])('parseVersion($input) should throw error $error', ({input, error}) => {
    expect(() => ClientVersion.parseVersion(input)).toThrow(error);
});

test.each([
    {client: '1.9.3.dev0', server: '2.8.1.dev12-something', expected: false},
    {client: '1.9', server: '2.8', expected: false},
    {client: '1', server: '2', expected: false},
    {client: '1.9.0', server: '2.9.0', expected: false},
    {client: '1.1.0', server: '1.2.9', expected: true},
    {client: '1.2.7', server: '1.1.8.dev0', expected: true},
    {client: '1.2.1', server: '1.2.29', expected: true},
    {client: '1.2.0', server: '1.2.0', expected: true},
    {client: '1.2.0', server: '1.4.0', expected: false},
    {client: '1.4.0', server: '1.2.0', expected: false},
    {client: '1.9.0', server: '3.7.0', expected: false},
    {client: '3.0.0', server: '1.0.0', expected: false},
    {client: '', server: '1.0.0', expected: false},
    {client: '1.0.0', server: '', expected: false},
])('isCompatible($client, $server) should return $expected', ({client, server, expected}) => {
    const result = ClientVersion.isCompatible(client, server);
    expect(result).toEqual(expected);
});
