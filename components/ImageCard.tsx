import { ImageInfo } from "dockerode";
import { FiAlertOctagon } from "react-icons/fi";

export default function ImageCard({ image }: { image: ImageInfo }) {
  if (!image) {
    return (
      <div className="card bg-base-100 shadow-sm border border-red-500">
        <div className="card-body">
          <div className="card-title flex items-center gap-2">
            <FiAlertOctagon size={24} className="text-red-500" />
            <h3>Image Not Found</h3>
          </div>
        </div>
      </div>
    );
  }

  const imageName = image.RepoTags ? image.RepoTags.join(", ") : image.Id;

  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body">
        <h3 className="card-title">{imageName}</h3>
        <p>Image ID: {image.Id}</p>
        <p>Size: {(image.Size / (1024 * 1024)).toFixed(2)} MB</p>
        <p>Created: {new Date(image.Created * 1000).toLocaleString()}</p>
      </div>
    </div>
  );
}
