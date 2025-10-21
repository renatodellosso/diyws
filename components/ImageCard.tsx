import { ImageInfo } from "dockerode";

export default function ImageCard({ image }: { image: ImageInfo }) {
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
