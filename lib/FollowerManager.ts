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
}

export default FollowerManager;
