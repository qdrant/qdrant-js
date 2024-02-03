import {test, expect} from 'vitest';
import {QdrantClient} from '../../src/qdrant-client.js';
import {QdrantClientConfigError} from '../../src/errors.js';

test('QdrantClient()', () => {
    let client = new QdrantClient();
    // @ts-expect-error ts(2341)
    expect(client._restUri).toBe('http://127.0.0.1:6334');

    client = new QdrantClient({https: true});
    // @ts-expect-error ts(2341)
    expect(client._restUri).toBe('https://127.0.0.1:6334');

    client = new QdrantClient({https: true, port: 7333});
    // @ts-expect-error ts(2341)
    expect(client._restUri).toBe('https://127.0.0.1:7333');

    expect(() => new QdrantClient({host: 'localhost:6334'})).toThrow(QdrantClientConfigError);

    client = new QdrantClient({host: 'hidden_port_addr.com', prefix: 'custom'});
    // @ts-expect-error ts(2341)
    expect(client._restUri).toBe('http://hidden_port_addr.com:6334/custom');

    client = new QdrantClient({host: 'hidden_port_addr.com', port: null});
    // @ts-expect-error ts(2341)
    expect(client._restUri).toBe('http://hidden_port_addr.com');

    client = new QdrantClient({host: 'hidden_port_addr.com', port: null, prefix: 'custom'});
    // @ts-expect-error ts(2341)
    expect(client._restUri).toBe('http://hidden_port_addr.com/custom');

    client = new QdrantClient({url: 'http://hidden_port_addr.com', port: null});
    // @ts-expect-error ts(2341)
    expect(client._restUri).toBe('http://hidden_port_addr.com');

    client = new QdrantClient({url: 'http://localhost:6334', port: 7333});
    // @ts-expect-error ts(2341)
    expect(client._restUri).toBe('http://localhost:6334');

    client = new QdrantClient({url: 'http://localhost:6334', prefix: 'custom'});
    // @ts-expect-error ts(2341)
    expect(client._restUri).toBe('http://localhost:6334/custom');

    client = new QdrantClient({url: 'https://localhost:443'});
    // @ts-expect-error ts(2341)
    expect(client._restUri).toBe('https://localhost:443');

    client = new QdrantClient({url: 'https://localhost'});
    // @ts-expect-error ts(2341)
    expect(client._restUri).toBe('https://localhost:6334');

    client = new QdrantClient({url: 'http://localhost:80'});
    // @ts-expect-error ts(2341)
    expect(client._restUri).toBe('http://localhost:80');

    client = new QdrantClient({url: 'http://localhost:80', prefix: 'custom'});
    // @ts-expect-error ts(2341)
    expect(client._restUri).toBe('http://localhost:80/custom');

    expect(() => new QdrantClient({url: 'my-domain.com'})).toThrow(QdrantClientConfigError);

    expect(() => new QdrantClient({url: 'my-domain.com:80'})).toThrow(QdrantClientConfigError);

    expect(() => new QdrantClient({url: 'http://localhost:6334', host: 'localhost'})).toThrow(QdrantClientConfigError);

    expect(() => new QdrantClient({url: 'http://localhost:6334/origin', prefix: 'custom'})).toThrow(
        QdrantClientConfigError,
    );
});
