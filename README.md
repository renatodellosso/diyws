# DIY Web Services

DIYWS is AWS/GCP on your own hardware.

DIYWS provides a remote-monitoring and management interface for Docker, so you can easily host software on your old laptop in the corner.

## Resource Usage

DIYWS is designed to be lightweight. It consumes ~150 MB of RAM and uses ~0.1% CPU (on a M4 Pro chip).

## Installation & Set Up

1. Download `compose.yaml` from the repository.
1. Add a `.env` file based on `.env.template`
1. Run `docker compose up`

## Distributed Architecture

DIYWS supports multiple nodes, allowing you to manage several devices from a single interface.

Here's how it works:

- Each follower node controls Docker on its own machine.
- The leader node serves the web interface and acts as a follower node.
- The web interface is served on one port, while follower nodes communicate on another port.
- Follower nodes have the IP address of the leader node configured in their `.env` files.
- The leader node maintains a list of follower nodes and their IP addresses.
- The web interface allows users to select which node to manage.
- Follower API routes are under the `/api/follower` path. They are inaccessible on the main port for security reasons.
