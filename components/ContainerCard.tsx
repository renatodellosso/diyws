import api from "@/lib/api";
import { ContainerDetails } from "@/lib/types";
import {
  bytesToGb,
  formatBytes,
  formatPercent,
  throwOnError,
} from "@/lib/utils";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ContainerCard({
  container,
}: {
  container: ContainerDetails;
}) {
  const [currentContainer, setCurrentContainer] =
    useState<ContainerDetails>(container);
  const [stateUpdating, setStateUpdating] = useState(false);

  const isRunning = currentContainer.State === "running";
  const containerName =
    currentContainer.Names?.join(", ") || currentContainer.Id;

  async function toggleContainerState() {
    const newState = !isRunning;

    setStateUpdating(true);
    const promise = api.containers
      .containerId(container.Id)
      .state.update({
        running: newState,
      })
      .then(throwOnError)
      .finally(() => {
        setStateUpdating(false);
      });

    toast.promise(promise, {
      loading: isRunning
        ? `Stopping container '${containerName}'...`
        : `Starting container '${containerName}'...`,
      success: isRunning
        ? `Container '${containerName}' stopped successfully!`
        : `Container '${containerName}' started successfully!`,
      error: (err) =>
        `Failed to ${
          isRunning ? "stop" : "start"
        } container '${containerName}': ${err.message}`,
    });

    const res = await promise;
    const data = await res.json();
    setCurrentContainer(data);
  }

  useEffect(() => {
    setCurrentContainer(container);
  }, [container]);

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
            {currentContainer.State}
          </span>
          <button className="btn btn-sm" onClick={toggleContainerState}>
            {stateUpdating ? "Updating..." : isRunning ? "Stop" : "Start"}
          </button>
        </div>
        <p>ID: {currentContainer.Id}</p>
        <p>Status: {currentContainer.Status}</p>
        <p>Image: {currentContainer.Image}</p>
        {isRunning && currentContainer.stats && (
          <>
            <p>
              Memory Usage:{" "}
              {formatBytes(currentContainer.stats.memory_stats.usage)} /{" "}
              {formatBytes(currentContainer.stats.memory_stats.limit)} (
              {formatPercent(
                currentContainer.stats.memory_stats.usage /
                  currentContainer.stats.memory_stats.limit
              )}
              )
            </p>
            <div>
              <p>Network I/O:</p>
              <ul className="ml-2">
                {currentContainer.stats.networks &&
                  Object.entries(currentContainer.stats.networks).map(
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
      </div>
    </div>
  );
}
