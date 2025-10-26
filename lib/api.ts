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
import { ContainerDetails, ServerState, Service, ServiceConfig } from "./types";
import z from "zod";

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
      }),
    }),
    serviceId: dynamicRoute(z.string()).with({
      delete: DELETE<void>(),
    }),
  },
} satisfies ApiSchema;

initApiClient(api, process.env.NEXT_PUBLIC_BASE_URL);

export default api;
