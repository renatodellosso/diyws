import ServerStateContext from "@/lib/ServerStateContext";
import Link from "next/link";
import { useContext } from "react";

export default function Header() {
  const serverState = useContext(ServerStateContext);

  return (
    <header className="flex items-center gap-4 p-4 border-b border-base-300">
      <Link href="/" className="text-3xl font-bold">
        DIYWS
      </Link>
      <p>
        Docker Status:{" "}
        {serverState.dockerRunning ? (
          <span className="text-success">Online</span>
        ) : (
          <span className="text-error">Offline</span>
        )}
      </p>
      <p>
        {serverState.containers.filter((c) => c.State === "running").length}/
        {serverState.containers.length} containers running
      </p>
      <p>{serverState.images.length} images</p>
      <p>Last Updated: {serverState.lastUpdated?.toLocaleTimeString()}</p>
      <p>Ping: {serverState.pingTimeMs?.toFixed()} ms</p>
    </header>
  );
}
