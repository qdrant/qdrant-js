# Node.js Example

Access Qdrant API from Node.js

## How to

Install dependencies

```bash
npm install --save @qdrant/js-client-rest
```

Import client

```js
import {QdrantClient} from '@qdrant/js-client-rest';
```

Initialize client

```js
const client = new QdrantClient({url: 'http://127.0.0.1:6333'});
```

## Run example

```bash
node ./index.js
```

## Connect to Qdrant Cloud

```js
const client = new QdrantClient({
    url: 'https://xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.us-east-0-1.aws.cloud.qdrant.io',
    apiKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
});
```

Obtain API key from [Qdrant Cloud](https://cloud.qdrant.io/)
