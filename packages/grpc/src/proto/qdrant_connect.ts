// @generated by protoc-gen-connect-es v0.8.4 with parameter "target=ts"
// @generated from file qdrant.proto (package qdrant, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { HealthCheckReply, HealthCheckRequest } from "./qdrant_pb.js";
import { MethodKind } from "@bufbuild/protobuf";

/**
 * @generated from service qdrant.Qdrant
 */
export const Qdrant = {
  typeName: "qdrant.Qdrant",
  methods: {
    /**
     * @generated from rpc qdrant.Qdrant.HealthCheck
     */
    healthCheck: {
      name: "HealthCheck",
      I: HealthCheckRequest,
      O: HealthCheckReply,
      kind: MethodKind.Unary,
    },
  }
} as const;
