"use client";

import FollowerCard from "@/components/FollowerCard";
import FollowerDashboard from "@/components/FollowerDashboard";
import ServiceCard from "@/components/ServiceCard";
import ServerStateContext from "@/lib/ServerStateContext";
import Link from "next/link";
import { useContext, useState } from "react";
import { FiPlus } from "react-icons/fi";

export default function Dashboard() {
  const serverState = useContext(ServerStateContext);

  const [selectedFollowerId, setSelectedFollowerId] = useState<string>(
    Object.values(serverState.followers)[0]?.id || ""
  );

  return (
    <div className="p-4">
      <h1 className="text-4xl">Dashboard</h1>

      <div>
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-2xl">Services</h2>
          <Link
            href="/service/create"
            className="rounded-full hover:bg-base-200 hover:shadow-sm transition-all duration-300 p-2 cursor-pointer"
          >
            <FiPlus size={24} />
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          {serverState.services.length === 0 ? (
            <p>No services found.</p>
          ) : (
            serverState.services.map((service) => (
              <ServiceCard
                key={service.config.name}
                service={service}
                container={
                  serverState.containers.find((c) =>
                    c.Names.some((name) => name === `/${service.config.name}`)
                  )!
                }
                image={
                  serverState.images.find((img) =>
                    img.RepoTags?.includes(service.config.image)
                  )!
                }
                updateServerState={serverState.update}
              />
            ))
          )}
        </div>
      </div>

      <div className="divider mx-4" />

      <h2 className="text-2xl mb-1">Followers</h2>
      <div className="flex flex-col gap-2">
        {Object.values(serverState.followers).length === 0 ? (
          <p>No followers found.</p>
        ) : (
          Object.values(serverState.followers).map((follower) => (
            <FollowerCard key={follower.id} follower={follower} />
          ))
        )}
      </div>

      <div className="divider mx-4" />

      <h2 className="text-2xl mb-1 flex items-center">
        <span className="mb-1">Follower:</span>
        <select
          onChange={(e) => setSelectedFollowerId(e.target.value)}
          value={selectedFollowerId}
          className="ml-2 select select-xl"
        >
          {Object.values(serverState.followers).map((follower) => (
            <option key={follower.id} value={follower.id}>
              {follower.name}
            </option>
          ))}
        </select>
      </h2>

      <FollowerDashboard follower={serverState.followers[selectedFollowerId]} />
    </div>
  );
}
