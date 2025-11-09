import ServerStateContext from "@/lib/ServerStateContext";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useContext } from "react";

export default function Header() {
  const serverState = useContext(ServerStateContext);

  return (
    <header className="flex items-center gap-4 p-4 border-b border-base-300">
      <div className="flex justify-between items-center gap-4">
        <Link href="/" className="text-3xl font-bold">
          DIYWS
        </Link>
        <p>
          {
            serverState.services.filter((s) => s.container?.State === "running")
              .length
          }
          /{serverState.services.length} services online
        </p>
        <p>
          {serverState.containers.filter((c) => c.State === "running").length}/
          {serverState.containers.length} containers running
        </p>
        <p>Last Updated: {serverState.lastUpdated?.toLocaleTimeString()}</p>
        <p>Ping: {serverState.pingTimeMs?.toFixed()} ms</p>
      </div>
      <button onClick={() => signOut()} className="ml-auto btn btn-secondary">
        Sign Out
      </button>
    </header>
  );
}
