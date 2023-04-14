import {test, expect} from 'vitest';
import {QdrantClient} from '../../src/qdrant-client.js';
import {QdrantClientConfigError} from '../../src/errors.js';

test('QdrantClient()', () => {
    let client = new QdrantClient();
    // @ts-expect-error ts(2341)
    expect(client._restUri).toBe('http://localhost:6333');

    client = new QdrantClient({https: true});
    // @ts-expect-error ts(2341)
    expect(client._restUri).toBe('https://localhost:6333');

    client = new QdrantClient({https: true, port: 7333});
    // @ts-expect-error ts(2341)
    expect(client._restUri).toBe('https://localhost:7333');

    expect(() => new QdrantClient({host: 'localhost:6333'})).toThrow(QdrantClientConfigError);

    client = new QdrantClient({host: 'hidden_port_addr.com', prefix: 'custom'});
    // @ts-expect-error ts(2341)
    expect(client._restUri).toBe('http://hidden_port_addr.com:6333/custom');

    client = new QdrantClient({host: 'hidden_port_addr.com', port: null});
    // @ts-expect-error ts(2341)
    expect(client._restUri).toBe('http://hidden_port_addr.com');

    client = new QdrantClient({host: 'hidden_port_addr.com', port: null, prefix: 'custom'});
    // @ts-expect-error ts(2341)
    expect(client._restUri).toBe('http://hidden_port_addr.com/custom');

    client = new QdrantClient({url: 'http://hidden_port_addr.com', port: null});
    // @ts-expect-error ts(2341)
    expect(client._restUri).toBe('http://hidden_port_addr.com');

    client = new QdrantClient({url: 'http://localhost:6333', port: 7333});
    // @ts-expect-error ts(2341)
    expect(client._restUri).toBe('http://localhost:6333');

    client = new QdrantClient({url: 'http://localhost:6333', prefix: 'custom'});
    // @ts-expect-error ts(2341)
    expect(client._restUri).toBe('http://localhost:6333/custom');

    expect(() => new QdrantClient({url: 'my-domain.com'})).toThrow(QdrantClientConfigError);

    expect(() => new QdrantClient({url: 'my-domain.com:80'})).toThrow(QdrantClientConfigError);

    expect(() => new QdrantClient({url: 'http://localhost:6333', host: 'localhost'})).toThrow(QdrantClientConfigError);

    expect(() => new QdrantClient({url: 'http://localhost:6333/origin', prefix: 'custom'})).toThrow(
        QdrantClientConfigError,
    );
});
