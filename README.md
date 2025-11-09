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

- Each follower node will control Docker on its own machine.
- The leader node will serve the web interface and act as a follower node.
- The web interface will be served on one port, while follower nodes will communicate on another port.
- Follower nodes will have the IP address of the leader node configured in their `.env` files.
- The leader node will maintain a list of follower nodes and their IP addresses.
- The web interface will allow users to select which node to manage.
