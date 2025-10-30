import Docker from "dockerode";
import { Command } from "@commander-js/extra-typings";

const PRODUCTION_IMAGE_URL = "ghcr.io/renatodellosso/diyws:latest";
const line = "-".repeat(40);

const program = new Command()
  .name("install")
  .description("Install DIYWS on this machine")
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
  .requiredOption("-s, --secret <string>", "Secret key")
  .requiredOption("-U, --username <string>", "Admin username")
  .requiredOption("-P, --password <string>", "Admin password")
  .action(async (options) => {
    options.url = options.url.replace("%p", options.port.toString());

    console.log("Installing DIYWS with the following options:");
    console.log(`Port: ${options.port}`);
    console.log(`URL: ${options.url}`);
    console.log(`Secret: ***`);
    console.log(`Username: ***`);
    console.log(`Password: ***`);
    console.log(line);

    const docker = new Docker();
    console.log("Checking Docker connection...");
    try {
      await docker.ping();
      console.log("Docker is running.");
    } catch (error) {
      console.error(
        "Error: Unable to connect to Docker. Please ensure Docker is installed and running."
      );
      process.exit(1);
    }

    console.log("Pulling Docker image...");
    await new Promise<void>((resolve, reject) => {
      docker.pull(
        PRODUCTION_IMAGE_URL,
        (err: unknown, stream: NodeJS.ReadableStream) => {
          if (err) {
            console.error("Error pulling image:", err);
            return reject(err);
          }
          docker.modem.followProgress(stream!, (pullErr, output) => {
            if (pullErr) {
              console.error("Error during image pull:", pullErr);
              return reject(pullErr);
            }
            console.log("Docker image pulled successfully.");
            resolve();
          });
        }
      );
    });

    console.log("Creating Docker container...");
    const container = await docker.createContainer({
      Image: PRODUCTION_IMAGE_URL,
      name: "diyws",
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
      },
    });

    console.log("Starting Docker container...");
    await container.start();

    console.log(line);
    console.log("DIYWS installed and running!");
    console.log(`Access it at: ${options.url}`);
  });

program.parse();
