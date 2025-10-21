import {
  ApiSchema,
  dynamicRoute,
  initApiClient,
} from "@renatodellosso/typed-api-client/client";
import { GET, PATCH, POST } from "@renatodellosso/typed-api-client/helpers";
import { ContainerDetails, ServerState, Service } from "./types";
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
      Service,
      z.ZodObject<{ name: z.ZodString; image: z.ZodString }>
    >({
      bodySchema: z.object({
        name: z.string(),
        image: z.string(),
      }),
    }),
  },
} satisfies ApiSchema;

initApiClient(api, process.env.NEXT_PUBLIC_BASE_URL);

export default api;
