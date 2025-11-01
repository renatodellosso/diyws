# DIY Web Services

DIYWS is AWS/GCP on your own hardware.

DIYWS provides a remote-monitoring and management interface for Docker, so you can easily host software on your old laptop in the corner.

## Resource Usage

DIYWS is designed to be lightweight. It consumes ~150 MB of RAM and uses ~0.1% CPU (on a M4 Pro chip).

## Installation & Set Up

1. Clone the repository
1. Run `pnpm install` to install dependencies
1. Run `pnpm run setup` to set up the application (see options below)
1. You're done! DIYWS is now running and accessible at the specified URL. It will automatically start when Docker starts.

### Set Up Script Options

- `-s, --secret <secret>`: A secret key used for authentication (required)
- `-U, --username <username>`: The username for authentication (required)
- `-P, --password <password>`: The password for authentication (required)
- `-p, --port <port>`: The port number on which the server will listen (default: 3000)
- `-u, --url <url>`: The base URL for the application (default: http://localhost). %p will be replaced with the specified port number.
- `-c, --container-name <container-name>`: The name of the Docker container to manage (default: diyws)
- `-i, --image-url <image-url>`: The Docker image URL to use for the container (default: ghcr.io/renatodellosso/diyws:latest)

## Distributed Architecture (WIP)

DIYWS is currently being overhauled to support multiple nodes, allowing you to manage several devices from a single interface.

Here's the plan:

- Each node will control Docker on its own machine.
- One node will act as the leader, serving the web interface and coordinating with other nodes, in addition to managing its own Docker instance.
- MDNS will be used for automatic discovery of nodes on the same network.
