import { Follower } from "./types";

export default class FollowerManager {
  followers: {
    [id: string]: Follower;
  };

  constructor() {
    this.followers = {};
  }

  addFollower(follower: Follower) {
    this.followers[follower.id] = follower;
  }

  removeFollower(id: string) {
    delete this.followers[id];
  }

  listFollowers(): Follower[] {
    return Object.values(this.followers);
  }
}

export function getFollowerManager(): FollowerManager {
  const typedGlobal = global as typeof globalThis & {
    followerManager?: FollowerManager;
  };

  if (!typedGlobal.followerManager) {
    typedGlobal.followerManager = new FollowerManager();
  }
  return typedGlobal.followerManager;
}
