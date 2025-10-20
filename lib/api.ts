import {
  ApiSchema,
  initApiClient,
} from "@renatodellosso/typed-api-client/client";
import { GET } from "@renatodellosso/typed-api-client/helpers";
import { ServerState } from "./types";

const api = {
  state: {
    get: GET<ServerState>(),
  },
} satisfies ApiSchema;

export function apiClient() {
  initApiClient(api, process.env.BASE_URL);
  return api;
}
