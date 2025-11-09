import { Follower } from "@/lib/types";

export default function FollowerCard({ follower }: { follower: Follower }) {
  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body">
        <h3 className="card-title">{follower.name}</h3>
        <p>ID: {follower.id}</p>
      </div>
    </div>
  );
}
