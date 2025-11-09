"use client";

import api from "@/lib/api";
import ServerStateContext from "@/lib/ServerStateContext";
import { PortMapping, ServiceConfig, VolumeConfig } from "@/lib/types";
import { formatBytes, getAvailableRam, throwOnError } from "@/lib/utils";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { FiTrash } from "react-icons/fi";

export default function CreateServicePage() {
  const serverState = useContext(ServerStateContext);

  const [followerId, setFollowerId] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [env, setEnv] = useState("");
  const [ports, setPorts] = useState<PortMapping[]>([]);
  const [volumes, setVolumes] = useState<
    (VolumeConfig & {
      exists: boolean | null;
    })[]
  >([]);
  const [startContainer, setStartContainer] = useState(true);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    for (const port of ports) {
      if (
        port.containerPort === undefined ||
        port.containerPort <= 0 ||
        port.hostPort === undefined ||
        port.hostPort <= 0 ||
        !port.protocol
      ) {
        toast.error(
          `Port mapping ${port.containerPort}:${port.hostPort}/${port.protocol} is invalid.`
        );
        return;
      }
    }

    if (!followerId) {
      toast.error("Please select a follower.");
      return;
    }

    const serviceConfig: ServiceConfig = {
      followerId,
      name,
      image,
      env: Object.fromEntries(
        env
          .split("\n")
          .map((line) => line.split("="))
          .filter(([key, value]) => key && value)
      ),
      ports,
      volumes,
    };

    const promise = api.services
      .create({
        ...serviceConfig,
        startContainer,
      })
      .then((res) => {
        console.log(res, res.ok, res.status);
        return res;
      })
      .then(throwOnError);

    toast.promise(promise, {
      loading: `Creating service '${serviceConfig.name}'...`,
      success: `Service '${serviceConfig.name}' created successfully!`,
      error: (err) =>
        `Failed to create service '${serviceConfig.name}': ${err.message}`,
    });

    await promise;
    location.href = "/";
  }

  function updatePort(index: number, field: keyof PortMapping, value: string) {
    // Don't update if the value is not a valid non-negative number
    const num = Number(value);
    if (isNaN(num) || num < 0) return;

    const newPorts = [...ports];
    const mapping = newPorts[index] as {
      [key: string]: number | string;
    };
    mapping[field] = Number(value);
    setPorts(newPorts);
  }

  async function updateVolumeExists(index: number) {
    const volumeName = volumes[index].volumeName;
    if (!volumeName) return;

    try {
      const res = await api.volumes
        .volumeName(volumeName)
        .get()
        .then((res) => {
          if (res.status >= 400 && res.status !== 404) {
            throwOnError(res);
          }
          return res;
        });

      const newVolumes = [...volumes];
      newVolumes[index].exists = res.status < 400;

      setVolumes(newVolumes);
    } catch (error) {
      toast.error(
        `Error checking volume '${volumeName}': ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-4xl mb-4">Create New Service</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <fieldset className="fieldset">
          <legend className="legend">Follower ID</legend>
          <select
            value={followerId}
            onChange={(e) => setFollowerId(e.target.value)}
            className="w-full select"
            required
          >
            <option value="" disabled>
              Select Follower
            </option>
            {Object.values(serverState.followers).map((follower) => (
              <option key={follower.id} value={follower.id}>
                {follower.name} (
                {formatBytes(getAvailableRam(follower.resourceUsage!))}{" "}
                available,{" "}
                {
                  serverState.services.filter(
                    (s) => s.config.followerId === follower.id
                  ).length
                }{" "}
                services already assigned)
              </option>
            ))}
          </select>
        </fieldset>

        <fieldset className="fieldset">
          <legend className="legend">Name</legend>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            name="name"
            className="w-full input"
            placeholder="Service Name"
            required
          />
        </fieldset>

        <fieldset className="fieldset">
          <legend className="legend">Image</legend>
          <input
            value={image}
            onChange={(e) => setImage(e.target.value)}
            type="text"
            name="image"
            className="w-full input"
            placeholder="Image"
            required
          />
        </fieldset>

        <fieldset className="fieldset">
          <legend className="legend">Environment Variables</legend>
          <textarea
            value={env}
            onChange={(e) => setEnv(e.target.value)}
            name="env"
            className="w-full input min-h-36"
            placeholder="KEY=value"
          />
        </fieldset>

        <fieldset className="fieldset">
          <legend className="legend">Ports</legend>
          {ports.map((port, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                value={port.containerPort || ""}
                onChange={(e) =>
                  updatePort(index, "containerPort", e.target.value)
                }
                className="input"
                placeholder="Container Port"
              />
              <input
                value={port.hostPort || ""}
                onChange={(e) => updatePort(index, "hostPort", e.target.value)}
                className="input"
                placeholder="Host Port"
              />
              <select
                value={port.protocol}
                onChange={(e) => {
                  const newPorts = [...ports];
                  newPorts[index].protocol = e.target.value as
                    | "tcp"
                    | "udp"
                    | "sctp";
                  setPorts(newPorts);
                }}
                className="select"
              >
                <option value="tcp">TCP</option>
                <option value="udp">UDP</option>
                <option value="sctp">SCTP</option>
              </select>
              <button
                type="button"
                onClick={() => {
                  const newPorts = [...ports];
                  newPorts.splice(index, 1);
                  setPorts(newPorts);
                }}
                className="btn btn-danger"
              >
                <FiTrash />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setPorts([
                ...ports,
                { containerPort: 0, hostPort: 0, protocol: "tcp" },
              ])
            }
            className="btn btn-secondary"
          >
            Add Port
          </button>
        </fieldset>

        <fieldset className="fieldset">
          <legend className="legend">Volumes</legend>
          {volumes.map((volume, index) => (
            <div key={index}>
              <div className="flex gap-2 mb-2">
                <input
                  value={volume.volumeName || ""}
                  onChange={(e) => {
                    const newVolumes = [...volumes];
                    newVolumes[index].volumeName = e.target.value;
                    setVolumes(newVolumes);
                    updateVolumeExists(index);
                  }}
                  className="input"
                  placeholder="Volume Name"
                />
                <input
                  value={volume.containerDestination || ""}
                  onChange={(e) => {
                    const newVolumes = [...volumes];
                    newVolumes[index].containerDestination = e.target.value;
                    setVolumes(newVolumes);
                  }}
                  className="input"
                  placeholder="Container Destination"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newVolumes = [...volumes];
                    newVolumes.splice(index, 1);
                    setVolumes(newVolumes);
                  }}
                  className="btn btn-danger"
                >
                  <FiTrash />
                </button>
              </div>
              <p className="text-sm text-success">
                {volume.volumeName === "" ||
                volume.containerDestination === "" ? (
                  <span className="text-error">
                    Please enter volume name and container destination
                  </span>
                ) : volume.exists === null ? (
                  "Checking volume..."
                ) : volume.exists ? (
                  "Links to existing volume"
                ) : (
                  "Will create new volume"
                )}
              </p>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setVolumes([
                ...volumes,
                { volumeName: "", containerDestination: "", exists: null },
              ])
            }
            className="btn btn-secondary"
          >
            Add Volume
          </button>
        </fieldset>

        <fieldset className="fieldset">
          <legend className="legend">Start Container</legend>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={startContainer}
              onChange={(e) => setStartContainer(e.target.checked)}
              className="checkbox"
            />
            Start the container immediately after creation
          </label>
        </fieldset>

        <button type="submit" className="btn btn-primary">
          Create Service
        </button>
      </form>
    </div>
  );
}
