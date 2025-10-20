"use client";

import DockerOfflineScreen from "@/components/screens/DockerOfflineScreen";
import LoadingScreen from "@/components/screens/LoadingScreen";
import api from "@/lib/api";
import { ServerState } from "@/lib/types";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [serverState, setServerState] = useState<ServerState>();

  useEffect(() => {
    api.serverState.get().then(async (res) => {
      const state = await res.json();
      setServerState(state);
    });
  }, []);

  if (!serverState) {
    return <LoadingScreen />;
  }

  if (!serverState?.dockerRunning) {
    return <DockerOfflineScreen />;
  }

  return <div>Docker is running</div>;
}
