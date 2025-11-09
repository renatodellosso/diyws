# DIY Web Services

DIYWS is AWS/GCP on your own hardware.

DIYWS provides a remote-monitoring and management interface for Docker, so you can easily host software on your old laptop in the corner.

## Resource Usage

DIYWS is designed to be lightweight. It consumes ~150 MB of RAM and uses ~0.1% CPU (on a M4 Pro chip).

## Installation & Set Up

1. Download `compose.yaml` from the repository.
1. Add a `.env` file based on `.env.template`
1. Run `docker compose up`

## Distributed Architecture (WIP)

DIYWS is currently being overhauled to support multiple nodes, allowing you to manage several devices from a single interface.

Here's the plan:

- Each node will control Docker on its own machine.
- One node will act as the leader, serving the web interface and coordinating with other nodes, in addition to managing its own Docker instance.
- MDNS will be used for automatic discovery of nodes on the same network.
