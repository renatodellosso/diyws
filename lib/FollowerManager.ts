import DataService from "./DataService";
import {
  Follower,
  FollowerRegistry,
  FollowerState,
  LocalFollowerState,
} from "./types";

namespace FollowerManager {
  async function getFollowerRegistry(): Promise<FollowerRegistry> {
    return DataService.readFollowerRegistry();
  }

  export async function addFollower(follower: Follower) {
    const registry = await getFollowerRegistry();
    registry[follower.id] = follower;
    await DataService.writeFollowerRegistry(registry);
    console.log(
      `Added follower: ${follower.name} (${follower.ip}). There are now ${Object.keys(registry).length} followers.`
    );
  }

  export async function removeFollower(id: string) {
    const registry = await getFollowerRegistry();
    delete registry[id];
    await DataService.writeFollowerRegistry(registry);
    console.log(
      `Removed follower with ID: ${id}. There are now ${
        Object.keys(registry).length
      } followers.`
    );
  }

  export async function listFollowers(): Promise<Follower[]> {
    return Object.values(getFollowerRegistry());
  }

  export async function getFollowerStates(): Promise<FollowerState[]> {
    const registry = await getFollowerRegistry();
    const states = await Promise.all(
      Object.values(registry).map(getFollowerState)
    );

    return states;
  }

  export async function getFollowerState(
    follower: Follower
  ): Promise<FollowerState> {
    const req = await fetch(
      `http://${follower.ip}:${process.env.FOLLOWER_PORT}/api/follower/serverState`,
      {
        method: "GET",
      }
    );

    if (!req.ok) {
      throw new Error(
        `Failed to fetch follower state from ${follower.name} (${follower.ip})`
      );
    }

    const localState = (await req.json()) as LocalFollowerState;

    return {
      ...follower,
      ...localState,
    };
  }

  export async function getFollowerById(
    followerId: string
  ): Promise<Follower | null> {
    const registry = await getFollowerRegistry();
    return registry[followerId] || null;
  }

  /**
   *
   * @param follower
   * @param path must contain a leading slash. Relative to /api/follower on the follower.
   * @param method
   * @param body
   * @returns
   */
  export async function forwardRequestToFollower(
    follower: Follower,
    path: string,
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    body?: any
  ) {
    const req = await fetch(
      `http://${follower.ip}:${process.env.FOLLOWER_PORT}/api/follower${path}`,
      {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!req.ok) {
      throw new Error(
        `Failed to forward request to follower ${follower.name} (${follower.ip})`
      );
    }

    console.log(
      `FORWARDED ${method} ${path} ${req.status} (follower ${follower.name} [${follower.ip}])`
    );
  }
}

export default FollowerManager;
