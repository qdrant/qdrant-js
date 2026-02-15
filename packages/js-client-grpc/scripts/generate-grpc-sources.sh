#!/usr/bin/env bash

set -e

PROJECT_ROOT="$(pwd)/$(dirname "$0")/../"

cd $(mktemp -d)

git clone --sparse --filter=blob:none --branch=dev --depth=1 https://github.com/qdrant/qdrant.git
cd qdrant
git sparse-checkout add lib/api/src/grpc/proto

PROTO_DIR="$(pwd)/lib/api/src/grpc/proto"

# Ensure current path is project root
cd $PROJECT_ROOT

CLIENT_DIR="proto"

cp $PROTO_DIR/*.proto $CLIENT_DIR/

# Remove internal services *.proto
rm $CLIENT_DIR/points_internal_service.proto
rm $CLIENT_DIR/collections_internal_service.proto
rm $CLIENT_DIR/raft_service.proto
rm $CLIENT_DIR/qdrant_internal_service.proto
rm $CLIENT_DIR/health_check.proto
rm $CLIENT_DIR/shard_snapshots_service.proto
rm $CLIENT_DIR/telemetry_internal.proto
cat $CLIENT_DIR/qdrant.proto \
 | grep -v 'collections_internal_service.proto' \
 | grep -v 'points_internal_service.proto' \
 | grep -v 'raft_service.proto' \
 | grep -v 'qdrant_internal_service.proto' \
 | grep -v 'health_check.proto' \
 | grep -v 'shard_snapshots_service.proto' \
 | grep -v 'telemetry_internal.proto' \
  > $CLIENT_DIR/qdrant_tmp.proto
mv $CLIENT_DIR/qdrant_tmp.proto $CLIENT_DIR/qdrant.proto

# Generate TypeScript files with buf
pnpm buf generate
