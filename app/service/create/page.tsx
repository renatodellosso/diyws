"use client";

import api from "@/lib/api";
import { PortMapping, ServiceConfig } from "@/lib/types";
import { throwOnError } from "@/lib/utils";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiTrash } from "react-icons/fi";
import { set } from "zod";

export default function CreateServicePage() {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [env, setEnv] = useState("");
  const [ports, setPorts] = useState<PortMapping[]>([]);

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

    const serviceConfig: ServiceConfig = {
      name,
      image,
      env: Object.fromEntries(
        env
          .split("\n")
          .map((line) => line.split("="))
          .filter(([key, value]) => key && value)
      ),
      ports,
    };

    const promise = api.services
      .create(serviceConfig)
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

  return (
    <div className="p-4">
      <h1 className="text-4xl mb-4">Create New Service</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
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

        <button type="submit" className="btn btn-primary">
          Create Service
        </button>
      </form>
    </div>
  );
}
