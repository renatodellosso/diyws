import { FollowerState } from "@/lib/types";
import ResourceUsageCard from "./ResourceUsageCard";
import ContainerCard from "./ContainerCard";
import ImageCard from "./ImageCard";
import VolumeCard from "./VolumeCard";

export default function FollowerDashboard({
  follower,
}: {
  follower: FollowerState;
}) {
  return (
    <div>
      <h2 className="text-2xl mb-1">Follower: {follower.name}</h2>
      {follower.resourceUsage && (
        <ResourceUsageCard resourceUsage={follower.resourceUsage} />
      )}

      <div className="divider my-4" />

      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-xl mb-2">Containers</h3>
          {follower.containers.length === 0 ? (
            <p>No containers found.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {follower.containers.map((container) => (
                <ContainerCard key={container.Id} container={container} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="divider my-4" />

      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-xl mb-2">Images</h3>
          {follower.images.length === 0 ? (
            <p>No images found.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {follower.images.map((image) => (
                <ImageCard key={image.Id} image={image} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="divider my-4" />

      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-xl mb-2">Volumes</h3>
          {follower.volumes.length === 0 ? (
            <p>No volumes found.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {follower.volumes.map((volume) => (
                <VolumeCard key={volume.Name} volume={volume} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
