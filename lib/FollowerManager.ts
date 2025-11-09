import { Follower } from "./types";

export default class FollowerManager {
  followers: Set<Follower>;

  constructor() {
    this.followers = new Set();
  }

  addFollower(follower: Follower) {
    this.followers.add(follower);
  }

  removeFollower(follower: Follower) {
    this.followers.delete(follower);
  }

  listFollowers(): Follower[] {
    return Array.from(this.followers);
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
