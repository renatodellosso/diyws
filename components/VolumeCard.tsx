import { VolumeInspectInfo } from "dockerode";
import NotFoundCard from "./NotFoundCard";

export default function VolumeCard({ volume }: { volume: VolumeInspectInfo }) {
  if (!volume) {
    return <NotFoundCard noun="Volume" />;
  }

  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body">
        <h3 className="card-title">{volume.Name}</h3>
        {volume.Labels && Object.keys(volume.Labels).length > 0 && (
          <h4>{Object.values(volume.Labels).join(", ")}</h4>
        )}
        <p>Mountpoint: {volume.Mountpoint}</p>
      </div>
    </div>
  );
}
