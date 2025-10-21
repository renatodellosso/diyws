import { createContext } from "react";
import { ServerState } from "./types";

const ServerStateContext = createContext<
  ServerState & { lastUpdated: Date | undefined; pingTimeMs?: number }
>({
  dockerRunning: false,
  images: [],
  containers: [],
  services: [],
  lastUpdated: undefined,
});

export default ServerStateContext;
