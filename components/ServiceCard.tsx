import api from "@/lib/api";
import { ContainerDetails, ServerState, Service } from "@/lib/types";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { FiTrash } from "react-icons/fi";
import ContainerCard from "./ContainerCard";
import ImageCard from "./ImageCard";
import { ImageInfo } from "dockerode";
import { throwOnError } from "@/lib/utils";

export default function ServiceCard({
  service,
  container,
  image,
  updateServerState,
}: {
  service: Service;
  container: ContainerDetails;
  image: ImageInfo;
  updateServerState: (
    update: (prev: ServerState) => Partial<ServerState>
  ) => void;
}) {
  const router = useRouter();

  async function handleDelete() {
    if (
      !confirm(
        `Are you sure you want to delete service '${service.config.name}'?`
      )
    ) {
      return;
    }

    const promise = api.services
      .serviceId(service.config.name)
      .delete()
      .then(throwOnError);

    toast.promise(promise, {
      loading: `Deleting service '${service.config.name}'...`,
      success: `Service '${service.config.name}' deleted successfully!`,
      error: (err) =>
        `Failed to delete service '${service.config.name}': ${err.message}`,
    });

    await promise;

    updateServerState((prev) => ({
      services: prev.services.filter(
        (s) => s.config.name !== service.config.name
      ),
    }));
  }

  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body">
        <div className="card-title text-2xl flex">
          <h3>{service.config.name}</h3>
          <button
            onClick={handleDelete}
            className="rounded-full hover:bg-base-200 hover:shadow-sm transition-all duration-300 p-2 cursor-pointer"
          >
            <FiTrash size={20} className="ml-auto hover:text-red-600" />
          </button>
        </div>
        <p className="font-bold">Container</p>
        <ContainerCard container={container} />
        <div className="divider my-1" />
        <p className="font-bold">Image</p>
        <ImageCard image={image} />
      </div>
    </div>
  );
}
