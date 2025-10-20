import dockerService from "@/lib/dockerService";

export default async function Dashboard() {
  const isDockerRunning = await dockerService.isDockerRunning();

  return (
    <div>{isDockerRunning ? "Docker is running" : "Docker is not running"}</div>
  );
}
