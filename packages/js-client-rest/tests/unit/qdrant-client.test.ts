import {test, expect} from 'vitest';
import {QdrantClient} from '../../src/qdrant-client.js';
import {QdrantClientConfigError} from '../../src/errors.js';

test('QdrantClient()', () => {
    let client = new QdrantClient();
    // @ts-expect-error ts(2341) - _restUri is private, accessed here for test assertion
    expect(client._restUri).toBe('http://127.0.0.1:6333');

    client = new QdrantClient({https: true});
    // @ts-expect-error ts(2341) - _restUri is private, accessed here for test assertion
    expect(client._restUri).toBe('https://127.0.0.1:6333');

    client = new QdrantClient({https: true, port: 7333});
    // @ts-expect-error ts(2341) - _restUri is private, accessed here for test assertion
    expect(client._restUri).toBe('https://127.0.0.1:7333');

    expect(() => new QdrantClient({host: 'localhost:6333'})).toThrow(QdrantClientConfigError);

    client = new QdrantClient({host: 'hidden_port_addr.com', prefix: 'custom'});
    // @ts-expect-error ts(2341) - _restUri is private, accessed here for test assertion
    expect(client._restUri).toBe('http://hidden_port_addr.com:6333/custom');

    client = new QdrantClient({host: 'hidden_port_addr.com', port: null});
    // @ts-expect-error ts(2341) - _restUri is private, accessed here for test assertion
    expect(client._restUri).toBe('http://hidden_port_addr.com');

    client = new QdrantClient({host: 'hidden_port_addr.com', port: null, prefix: 'custom'});
    // @ts-expect-error ts(2341) - _restUri is private, accessed here for test assertion
    expect(client._restUri).toBe('http://hidden_port_addr.com/custom');

    client = new QdrantClient({url: 'http://hidden_port_addr.com', port: null});
    // @ts-expect-error ts(2341) - _restUri is private, accessed here for test assertion
    expect(client._restUri).toBe('http://hidden_port_addr.com');

    client = new QdrantClient({url: 'http://localhost:6333', port: 7333});
    // @ts-expect-error ts(2341) - _restUri is private, accessed here for test assertion
    expect(client._restUri).toBe('http://localhost:6333');

    client = new QdrantClient({url: 'http://localhost:6333', prefix: 'custom'});
    // @ts-expect-error ts(2341) - _restUri is private, accessed here for test assertion
    expect(client._restUri).toBe('http://localhost:6333/custom');

    expect(() => new QdrantClient({url: 'my-domain.com'})).toThrow(QdrantClientConfigError);

    expect(() => new QdrantClient({url: 'my-domain.com:80'})).toThrow(QdrantClientConfigError);

    expect(() => new QdrantClient({url: 'http://localhost:6333', host: 'localhost'})).toThrow(QdrantClientConfigError);

    expect(() => new QdrantClient({url: 'http://localhost:6333/origin', prefix: 'custom'})).toThrow(
        QdrantClientConfigError,
    );

    client = new QdrantClient({url: 'http://localhost:6333/origin'});
    // @ts-expect-error ts(2341) - _restUri is private, accessed here for test assertion
    expect(client._restUri).toBe('http://localhost:6333/origin');

    client = new QdrantClient({url: 'https://hidden_port_addr.com/qdrant-proxy', port: null});
    // @ts-expect-error ts(2341) - _restUri is private, accessed here for test assertion
    expect(client._restUri).toBe('https://hidden_port_addr.com/qdrant-proxy');
});
