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
