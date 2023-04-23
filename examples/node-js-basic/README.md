# Node.js Example

Access Qdrant API from Node.js

## How to

Install dependencies

```bash
npm i --save @qdrant/js-client-rest
```

Import client

```javascript
let { QdrantClient } = require('@qdrant/js-client-rest');
```

Initialize client

```javascript
let client = new QdrantClient({ url: 'http://127.0.0.1:6333' });
```

## Run example

```bash
node index.js
```
