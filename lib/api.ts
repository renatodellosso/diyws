import {
  ApiSchema,
  initApiClient,
} from "@renatodellosso/typed-api-client/client";
import { GET } from "@renatodellosso/typed-api-client/helpers";
import { ServerState } from "./types";

const api = {
  serverState: {
    get: GET<ServerState>(),
  },
} satisfies ApiSchema;

initApiClient(api, process.env.NEXT_PUBLIC_BASE_URL);

export default api;
