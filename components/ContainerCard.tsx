import api from "@/lib/api";
import { UpdateServerStateFn } from "@/lib/ServerStateContext";
import { ContainerDetails } from "@/lib/types";
import { formatBytes, formatPercent, throwOnError } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import NotFoundCard from "./NotFoundCard";
import { FiArrowRight } from "react-icons/fi";

export default function ContainerCard({
  container,
}: {
  container: ContainerDetails;
}) {
  const [stateUpdating, setStateUpdating] = useState(false);

  const isRunning = container?.State === "running";
  const containerName = container?.Names?.join(", ") || container?.Id;

  if (!container) {
    return <NotFoundCard noun="Container" />;
  }

  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body">
        <div className="card-title flex">
          <h3>{containerName}</h3>
          <span
            className={
              isRunning ? "badge badge-success ml-2" : "badge badge-error ml-2"
            }
          >
            {container.State}
          </span>
        </div>
        <p>ID: {container.Id}</p>
        <p>Status: {container.Status}</p>
        <p>Image: {container.Image}</p>
        {isRunning && container.stats && (
          <>
            <p>
              Memory Usage: {formatBytes(container.stats.memory_stats.usage)} /{" "}
              {formatBytes(container.stats.memory_stats.limit)} (
              {formatPercent(
                container.stats.memory_stats.usage /
                  container.stats.memory_stats.limit
              )}
              )
            </p>
            <div>
              <p>Network I/O:</p>
              <ul className="ml-2">
                {container.stats.networks &&
                  Object.entries(container.stats.networks).map(
                    ([name, stats]) => (
                      <li key={name}>
                        {name}: RX {formatBytes(stats.rx_bytes)}, TX{" "}
                        {formatBytes(stats.tx_bytes)}
                      </li>
                    )
                  )}
              </ul>
            </div>
          </>
        )}
        <div>
          <h4 className="font-bold">Mount Points:</h4>
          {container.Mounts.length === 0 ? (
            <p>None</p>
          ) : (
            <table>
              <thead>
                <tr className="text-left">
                  <th>Source</th>
                  <th>Destination</th>
                  <th>Type</th>
                  <th>Mode</th>
                </tr>
              </thead>
              <tbody>
                {container.Mounts.sort((a, b) =>
                  a.Destination.localeCompare(b.Destination)
                ).map((mount) => (
                  <tr key={mount.Destination}>
                    <td className="pr-4">{mount.Source || "(empty)"}</td>
                    <td className="pr-4">{mount.Destination}</td>
                    <td className="pr-4">{mount.Type}</td>
                    <td className="pr-4">
                      {mount.RW ? "read-write" : "read-only"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
