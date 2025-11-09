import { createContext } from "react";
import { ServerState } from "./types";

export type UpdateServerStateFn = (
  update: (prev: ServerState) => Partial<ServerState>
) => void;

const ServerStateContext = createContext<
  ServerState & {
    lastUpdated: Date | undefined;
    pingTimeMs?: number;
    fetch: () => Promise<void>;
    update: UpdateServerStateFn;
  }
>({
  images: [],
  containers: [],
  volumes: [],
  services: [],
  followers: [],
  lastUpdated: undefined,
  fetch: async () => {},
  update: (update: (prev: ServerState) => Partial<ServerState>) => {},
});

export default ServerStateContext;
