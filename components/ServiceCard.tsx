import api from "@/lib/api";
import { Service } from "@/lib/types";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { FiTrash } from "react-icons/fi";

export default function ServiceCard({ service }: { service: Service }) {
  const router = useRouter();

  async function handleDelete() {
    if (
      !confirm(
        `Are you sure you want to delete service '${service.config.name}'?`
      )
    ) {
      return;
    }

    const promise = api.services.serviceId(service.config.name).delete();

    toast.promise(promise, {
      loading: `Deleting service '${service.config.name}'...`,
      success: `Service '${service.config.name}' deleted successfully!`,
      error: (err) =>
        `Failed to delete service '${service.config.name}': ${err.message}`,
    });

    await promise;

    router.push("/");
  }

  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body">
        <div className="card-title flex">
          <h3>{service.config.name}</h3>
          <button
            onClick={handleDelete}
            className="rounded-full hover:bg-base-200 hover:shadow-sm transition-all duration-300 p-2 cursor-pointer"
          >
            <FiTrash size={20} className="ml-auto hover:text-red-600" />
          </button>
        </div>
        <p className="mb-1">
          <span className="font-semibold">Image:</span> {service.config.image}
        </p>
        <p className="mb-1">
          <span className="font-semibold">Container Status:</span>{" "}
          {service.container
            ? service.container.State === "running"
              ? "Running"
              : "Stopped"
            : "Not Created"}
        </p>
        <p>
          <span className="font-semibold">Image Info:</span>{" "}
          {service.image ? "Available" : "Not Available"}
        </p>
      </div>
    </div>
  );
}
