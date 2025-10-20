"use client";

import ContainerCard from "@/components/screens/ContainerCard";
import LoadingScreen from "@/components/screens/LoadingScreen";
import api from "@/lib/api";
import { ServerState } from "@/lib/types";
import { useEffect, useState } from "react";
import { FiWifi, FiWifiOff } from "react-icons/fi";

export default function Dashboard() {
  const [serverState, setServerState] = useState<ServerState>();
  const [lastUpdated, setLastUpdated] = useState<Date>();

  async function updateServerState() {
    const res = await api.serverState.get();
    const state = await res.json();
    setServerState(state);
    setLastUpdated(new Date());
  }

  useEffect(() => {
    updateServerState();
    const interval = setInterval(updateServerState, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!serverState) {
    return <LoadingScreen />;
  }

  return (
    <div className="p-4">
      <div>
        <h1 className="text-4xl">Dashboard</h1>
        <p>Last updated: {lastUpdated?.toLocaleTimeString()}</p>
        <div className="px-24 py-8 grid grid-cols-3 grid-rows-1 text-xl">
          {serverState.dockerRunning ? (
            <div className="flex items-center gap-1 text-success">
              <FiWifi />
              <div>Docker online</div>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-error">
              <FiWifiOff />
              <div>Docker offline</div>
            </div>
          )}
          <div>{serverState.images.length} images</div>
          <div>
            {serverState.containers.filter((c) => c.State === "running").length}{" "}
            running containers
          </div>
        </div>
      </div>

      <div className="divider mx-4" />

      <div>
        <h2 className="text-2xl">Containers</h2>
        {serverState.containers.length === 0 ? (
          <p>No containers found.</p>
        ) : (
          serverState.containers.map((container) => (
            <ContainerCard key={container.Id} container={container} />
          ))
        )}
      </div>

      <div className="divider mx-4" />

      <div>
        <h2 className="text-2xl">Images</h2>
        <ul>
          {serverState.images.map((image) => (
            <li key={image.Id}>
              {image.Id} - {image.RepoTags?.join(", ")}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
