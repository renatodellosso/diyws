import Docker from "dockerode";
import { Command } from "@commander-js/extra-typings";
import chalk from "chalk";

const PRODUCTION_IMAGE_URL = "ghcr.io/renatodellosso/diyws:latest";
const line = "-".repeat(40);

const success = chalk.green;
const error = chalk.red;

async function checkDockerConnection(docker: Docker) {
  try {
    await docker.ping();
    return true;
  } catch {
    return false;
  }
}

async function pullImage(docker: Docker, imageUrl: string) {
  return new Promise<void>((resolve, reject) => {
    docker.pull(imageUrl, (err: unknown, stream: NodeJS.ReadableStream) => {
      if (err) {
        return reject(err);
      }
      docker.modem.followProgress(stream!, (pullErr, output) => {
        if (pullErr) {
          return reject(pullErr);
        }
        resolve();
      });
    });
  });
}

async function createContainer(
  docker: Docker,
  options: {
    port: number;
    url: string;
    containerName: string;
    secret: string;
    username: string;
    password: string;
  }
) {
  const container = await docker.createContainer({
    Image: PRODUCTION_IMAGE_URL,
    name: options.containerName,
    Env: [
      `NEXTAUTH_URL=${options.url}`,
      `NEXTAUTH_SECRET=${options.secret}`,
      `USERNAME=${options.username}`,
      `PASSWORD=${options.password}`,
    ],
    HostConfig: {
      PortBindings: {
        "3000/tcp": [{ HostPort: options.port.toString() }],
      },
      Binds: ["/var/run/docker.sock:/var/run/docker.sock"],
      RestartPolicy: {
        Name: "unless-stopped",
      },
    },
  });
  return container;
}

const program = new Command()
  .name("install")
  .description("Install DIYWS on this machine")
  .requiredOption("-s, --secret <string>", "Secret key")
  .requiredOption("-U, --username <string>", "Admin username")
  .requiredOption("-P, --password <string>", "Admin password")
  .option(
    "-p, --port <number>",
    "Port to run DIYWS on",
    (value) => parseInt(value, 10),
    3000
  )
  .option(
    "-u, --url <string>",
    "URL to access DIYWS. %p will be replaced with the port",
    "http://localhost:%p"
  )
  .option("-c, --container-name <string>", "Docker container name", "diyws")
  .option("-i, --image-url <string>", "Docker image URL", PRODUCTION_IMAGE_URL)
  .action(async (options) => {
    try {
      options.url = options.url.replace("%p", options.port.toString());

      console.log("Installing DIYWS with the following options:");
      console.log("Port:", options.port);
      console.log("URL:", options.url);
      console.log("Container Name:", options.containerName);
      console.log("Secret: ***");
      console.log("Username: ***");
      console.log("Password: ***");
      console.log(line);

      const docker = new Docker();
      console.log("Checking Docker connection...");
      const isDockerConnected = await checkDockerConnection(docker);
      if (!isDockerConnected) {
        console.error(
          error(
            "Cannot connect to Docker. Please ensure Docker is installed and running."
          )
        );
        process.exit(1);
      }
      console.log("Docker connection successful.");

      console.log("Pulling Docker image...");
      await pullImage(docker, options.imageUrl);

      console.log("Creating Docker container...");
      const container = await createContainer(docker, options);

      console.log("Starting Docker container...");
      await container.start();

      console.log(line);
      console.log(success("DIYWS installed and running!"));
      console.log(success("Access it at:", chalk.blueBright(options.url)));
    } catch (err) {
      if (err instanceof Error) {
        console.error(error("Installation failed:", err.message));
      } else {
        console.error(error("Installation failed (unknown error):", err));
      }
      process.exit(1);
    }
  });

program.parse();
