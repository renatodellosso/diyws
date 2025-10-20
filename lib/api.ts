import {
  ApiSchema,
  dynamicRoute,
  initApiClient,
} from "@renatodellosso/typed-api-client/client";
import { GET, PATCH } from "@renatodellosso/typed-api-client/helpers";
import { ServerState } from "./types";
import z from "zod";
import { ContainerInfo } from "dockerode";

const api = {
  serverState: {
    get: GET<ServerState>(),
  },
  containers: {
    containerId: dynamicRoute(z.string()).with({
      get: GET<ContainerInfo>(),
      state: {
        patch: PATCH<
          ContainerInfo,
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
} satisfies ApiSchema;

initApiClient(api, process.env.NEXT_PUBLIC_BASE_URL);

export default api;
