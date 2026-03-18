let _current: Record<string, string> = {};

export function withHeaders<T>(headers: Record<string, string>, fn: () => T): T {
    const previous = _current;
    _current = {...previous, ...headers};
    try {
        return fn();
    } finally {
        _current = previous;
    }
}

export function getContextHeaders(): Record<string, string> {
    return _current;
}
