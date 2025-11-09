import {
  ApiSchema,
  dynamicRoute,
  initApiClient,
} from "@renatodellosso/typed-api-client/client";
import {
  DELETE,
  GET,
  PATCH,
  POST,
} from "@renatodellosso/typed-api-client/helpers";
import { ContainerDetails, ServerState, Service } from "./types";
import z from "zod";
import { VolumeInspectInfo } from "dockerode";

const api = {
  serverState: {
    get: GET<ServerState>(),
  },
  containers: {
    containerId: dynamicRoute(z.string()).with({
      get: GET<ContainerDetails>(),
      state: {
        update: PATCH<
          ContainerDetails,
          z.ZodObject<{
            running: z.ZodBoolean;
          }>
        >({
          bodySchema: z.object({
            running: z.boolean(),
          }),
        }),
      },
    }),
  },
  services: {
    create: POST<
      | Service
      | {
          error: string;
        },
      z.ZodObject<{
        name: z.ZodString;
        image: z.ZodString;
        env: z.ZodRecord<z.ZodString, z.ZodString>;
        ports: z.ZodArray<
          z.ZodObject<{
            containerPort: z.ZodNumber;
            hostPort: z.ZodNumber;
            protocol: z.ZodEnum<{
              tcp: "tcp";
              udp: "udp";
              sctp: "sctp";
            }>;
          }>
        >;
        volumes: z.ZodArray<
          z.ZodObject<{
            volumeName: z.ZodString;
            containerDestination: z.ZodString;
          }>
        >;
        startContainer: z.ZodOptional<z.ZodBoolean>;
      }>
    >({
      bodySchema: z.object({
        name: z.string(),
        image: z.string(),
        env: z.record(z.string(), z.string()),
        ports: z.array(
          z.object({
            containerPort: z.number(),
            hostPort: z.number(),
            protocol: z.enum(["tcp", "udp", "sctp"]),
          })
        ),
        volumes: z.array(
          z.object({
            volumeName: z.string(),
            containerDestination: z.string(),
          })
        ),
        startContainer: z.boolean().optional(),
      }),
    }),
    serviceId: dynamicRoute(z.string()).with({
      delete: DELETE<void>(),
    }),
  },
  volumes: {
    volumeName: dynamicRoute(z.string()).with({
      get: GET<VolumeInspectInfo | {}>(),
    }),
  },
  follower: {
    /**
     * Register this follower with the leader node
     */
    post: POST<{ success: boolean }, z.ZodObject<{ id: z.ZodString }>>({
      bodySchema: z.object({
        id: z.string().min(1).max(100),
      }),
    }),
  },
} satisfies ApiSchema;

initApiClient(
  api,
  typeof location !== "undefined" ? `${location.origin}/api` : ""
);

export default api;
