import api from "@/lib/api";
import { ContainerInfo } from "dockerode";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ContainerCard({
  container,
}: {
  container: ContainerInfo;
}) {
  const [currentContainer, setCurrentContainer] =
    useState<ContainerInfo>(container);
  const [stateUpdating, setStateUpdating] = useState(false);

  const isRunning = currentContainer.State === "running";
  const containerName =
    currentContainer.Names?.join(", ") || currentContainer.Id;

  async function updateContainerInfo() {
    const promise = api.containers
      .containerId(container.Id)
      .get()
      .then((res) => res.json())
      .then((data) => setCurrentContainer(data));
    toast.promise(promise, {
      loading: `Updating container '${containerName}' info...`,
      success: `Container '${containerName}' info updated!`,
      error: `Failed to update container '${containerName}' info.`,
    });
  }

  function toggleContainerState() {
    const newState = !isRunning;

    setStateUpdating(true);
    const promise = api.containers
      .containerId(container.Id)
      .state.patch({
        running: newState,
      })
      .then(async (res) => {
        const data = await res.json();
        setCurrentContainer(data);
      })
      .catch((err) => {
        updateContainerInfo();
        throw err;
      })
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
  }

  useEffect(() => {
    setCurrentContainer(container);
  }, [container]);

  console.log(currentContainer);

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
      </div>
    </div>
  );
}
