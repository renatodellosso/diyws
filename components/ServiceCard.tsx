import api from "@/lib/api";
import { ContainerDetails, ServerState, Service } from "@/lib/types";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { FiTrash } from "react-icons/fi";
import ContainerCard from "./ContainerCard";
import ImageCard from "./ImageCard";
import { ImageInfo, Volume } from "dockerode";
import { throwOnError } from "@/lib/utils";
import { UpdateServerStateFn } from "@/lib/ServerStateContext";
import VolumeCard from "./VolumeCard";

export default function ServiceCard({
  service,
  container,
  image,
  updateServerState,
}: {
  service: Service;
  container: ContainerDetails;
  image: ImageInfo;
  updateServerState: UpdateServerStateFn;
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

  const online = container?.State === "running";

  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body">
        <div className="card-title text-2xl flex items-center">
          {online ? (
            <div className="status status-success" />
          ) : (
            <div className="inline-grid *:[grid-area:1/1]">
              <div className="status status-error animate-ping"></div>
              <div className="status status-error"></div>
            </div>
          )}
          <h3>{service.config.name}</h3>
          <button
            onClick={handleDelete}
            className="rounded-full hover:bg-base-200 hover:shadow-sm transition-all duration-300 p-2 cursor-pointer"
          >
            <FiTrash size={20} className="ml-auto hover:text-red-600" />
          </button>
        </div>

        <p className="font-bold">Container</p>
        <ContainerCard
          container={container}
          updateServerState={updateServerState}
        />

        <div className="divider my-1" />
        <p className="font-bold">Image</p>
        <ImageCard image={image} />

        <div className="divider my-1" />
        <p className="font-bold">Volumes & Mounts</p>
        {!service.volumes || service.volumes.length === 0 ? (
          <p>No volumes mounted.</p>
        ) : (
          service.volumes
            ?.sort((a, b) => a.Name.localeCompare(b.Name))
            .map((vol) => (
              <VolumeCard
                key={vol.Name}
                volume={vol}
                mount={service.container?.Mounts.find(
                  (mount) => mount.Name === vol.Name
                )}
              />
            ))
        )}
      </div>
    </div>
  );
}
