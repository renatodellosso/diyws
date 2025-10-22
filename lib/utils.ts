import { ImageInfo, ImageInspectInfo } from "dockerode";

export function bytesToGb(bytes: number): number {
  return bytes / (1024 * 1024 * 1024);
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function formatPercent(decimal: number): string {
  return (decimal * 100).toFixed(2) + "%";
}

export async function throwIfError<T>(res: Response): Promise<Response> {
  if (!res.ok) {
    const error = await res.json();
    throw new Error(
      error?.error || `API request failed with status ${res.status}`
    );
  }
  return res;
}

export function tagsToName(image: ImageInfo | ImageInspectInfo): string {
  if (image.RepoTags && image.RepoTags.length > 0) {
    return image.RepoTags[0];
  }
  return "<none>:<none>";
}
