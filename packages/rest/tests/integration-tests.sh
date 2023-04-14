#!/bin/bash

set -ex

function stop_docker()
{
  echo "stopping qdrant_test"
  docker stop qdrant_test
}

QDRANT_LATEST="v1.1.0"
QDRANT_VERSION=${QDRANT_VERSION:-"$QDRANT_LATEST"}

QDRANT_HOST='localhost:6333'

OS_NAME=$(uname -s)
HOST_NETWORK=false
if [[ $OS_NAME == Linux* ]]; then
  HOST_NETWORK=true
fi

docker run -d --rm \
           $([[ "$HOST_NETWORK" = true ]] && echo "--network=host" || echo "-p 6333:6333") \
           -e QDRANT__SERVICE__GRPC_PORT="6334" \
           --name qdrant_test qdrant/qdrant:${QDRANT_VERSION}

trap stop_docker SIGINT
trap stop_docker ERR

until $(curl --output /dev/null --silent --get --fail http://$QDRANT_HOST/collections); do
  printf 'waiting for server to start...'
  sleep 5
done

pnpm test:integration

echo "Ok, that is enough"

stop_docker
