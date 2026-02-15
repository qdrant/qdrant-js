#!/bin/bash

set -ex

function stop_docker()
{
  echo "stopping qdrant_test"
  docker logs qdrant_test
  docker stop qdrant_test
}

QDRANT_LATEST="v1.17.0"
QDRANT_VERSION=${QDRANT_VERSION:-"$QDRANT_LATEST"}

QDRANT_HOST='127.0.0.1:6333'

docker run -d --rm \
           -p 6333:6333 \
           -p 6334:6334 \
           -e QDRANT__SERVICE__GRPC_PORT="6334" \
           --name qdrant_test qdrant/qdrant:${QDRANT_VERSION}

trap stop_docker SIGINT
trap stop_docker ERR

until $(curl --output /dev/null --silent --get --fail http://$QDRANT_HOST/collections); do
  printf 'waiting for server to start...'
  sleep 5
done

pnpm --filter "@qdrant/js-client-rest" test:integration
pnpm --filter "@qdrant/js-client-grpc" test:integration

echo "Ok, that is enough"

stop_docker
