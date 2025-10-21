"use client";

import api from "@/lib/api";
import { ServiceConfig } from "@/lib/types";
import toast from "react-hot-toast";

export default function CreateServicePage() {
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const fields = new FormData(event.target as HTMLFormElement);
    const serviceConfig: ServiceConfig = {
      name: fields.get("name") as string,
      image: fields.get("image") as string,
    };

    const promise = api.services.create(serviceConfig);

    toast.promise(promise, {
      loading: `Creating service '${serviceConfig.name}'...`,
      success: `Service '${serviceConfig.name}' created successfully!`,
      error: (err) =>
        `Failed to create service '${serviceConfig.name}': ${err.message}`,
    });
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

        <button type="submit" className="btn btn-primary">
          Create Service
        </button>
      </form>
    </div>
  );
}
