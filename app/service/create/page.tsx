"use client";

import api from "@/lib/api";
import { ServiceConfig } from "@/lib/types";
import { portSchema, throwOnError } from "@/lib/utils";
import toast from "react-hot-toast";

export default function CreateServicePage() {
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const fields = new FormData(event.target as HTMLFormElement);
    const serviceConfig: ServiceConfig = {
      name: fields.get("name") as string,
      image: fields.get("image") as string,
      env: Object.fromEntries(
        (fields.get("env") as string)
          .split("\n")
          .map((line) => line.split("="))
          .filter(([key, value]) => key && value)
      ),
      ports: (fields.get("ports") as string)
        .split("\n")
        .map((port) => port.trim())
        .filter((port) => port) as ServiceConfig["ports"],
    };

    for (const port of serviceConfig.ports) {
      if (!portSchema.safeParse(port).success) {
        toast.error(`Invalid port format: ${port}`);
        return;
      }
    }

    const promise = api.services.create(serviceConfig).then(throwOnError);

    toast.promise(promise, {
      loading: `Creating service '${serviceConfig.name}'...`,
      success: `Service '${serviceConfig.name}' created successfully!`,
      error: (err) =>
        `Failed to create service '${serviceConfig.name}': ${err.message}`,
    });

    await promise;
    location.href = "/";
  }

  return (
    <div className="p-4">
      <h1 className="text-4xl mb-4">Create New Service</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <fieldset className="fieldset">
          <legend className="legend">Name</legend>
          <input
            type="text"
            name="name"
            className="input"
            placeholder="Service Name"
            required
          />
        </fieldset>

        <fieldset className="fieldset">
          <legend className="legend">Image</legend>
          <input
            type="text"
            name="image"
            className="input"
            placeholder="Image"
            required
          />
        </fieldset>

        <fieldset className="fieldset">
          <legend className="legend">Environment Variables</legend>
          <textarea
            name="env"
            className="input min-h-36"
            placeholder="KEY=value"
          />
        </fieldset>

        <fieldset className="fieldset">
          <legend className="legend">Ports</legend>
          <textarea
            name="ports"
            className="input min-h-24"
            placeholder="8080/tcp"
          />
        </fieldset>

        <button type="submit" className="btn btn-primary">
          Create Service
        </button>
      </form>
    </div>
  );
}
