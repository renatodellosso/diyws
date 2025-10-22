import { createContext } from "react";
import { ServerState } from "./types";

const ServerStateContext = createContext<
  ServerState & {
    lastUpdated: Date | undefined;
    pingTimeMs?: number;
    fetch: () => Promise<void>;
    update: (update: (prev: ServerState) => Partial<ServerState>) => void;
  }
>({
  dockerRunning: false,
  images: [],
  containers: [],
  services: [],
  lastUpdated: undefined,
  fetch: async () => {},
  update: (update: (prev: ServerState) => Partial<ServerState>) => {},
});

export default ServerStateContext;
