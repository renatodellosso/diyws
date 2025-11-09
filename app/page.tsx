"use client";

import ContainerCard from "@/components/ContainerCard";
import FollowerCard from "@/components/FollowerCard";
import ImageCard from "@/components/ImageCard";
import ServiceCard from "@/components/ServiceCard";
import VolumeCard from "@/components/VolumeCard";
import ServerStateContext from "@/lib/ServerStateContext";
import Link from "next/link";
import { useContext } from "react";
import { FiPlus } from "react-icons/fi";

export default function Dashboard() {
  const serverState = useContext(ServerStateContext);

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
        {serverState.followers.length === 0 ? (
          <p>No followers found.</p>
        ) : (
          serverState.followers.map((follower) => (
            <FollowerCard key={follower.id} follower={follower} />
          ))
        )}
      </div>

      <div className="divider mx-4" />

      {/* <div>
        <h2 className="text-2xl mb-1">Resource Usage</h2>
        {serverState.resourceUsage ? (
          <ResourceUsageCard resourceUsage={serverState.resourceUsage} />
        ) : (
          <p>No resource usage data available.</p>
        )}
      </div> */}

      <div className="divider mx-4" />

      <div>
        <h2 className="text-2xl mb-1">Containers</h2>
        <div className="flex flex-col gap-2">
          {serverState.containers.length === 0 ? (
            <p>No containers found.</p>
          ) : (
            serverState.containers.map((container) => (
              <ContainerCard
                key={container.Id}
                container={container}
                updateServerState={serverState.update}
              />
            ))
          )}
        </div>
      </div>

      <div className="divider mx-4" />

      <div>
        <h2 className="text-2xl mb-1">Images</h2>
        <div className="flex flex-col gap-2">
          {serverState.images.length === 0 ? (
            <p>No images found.</p>
          ) : (
            serverState.images.map((image) => (
              <ImageCard key={image.Id} image={image} />
            ))
          )}
        </div>
      </div>

      <div className="divider mx-4" />

      <div>
        <h2 className="text-2xl mb-1">Volumes</h2>
        <div className="flex flex-col gap-2">
          {serverState.volumes.length === 0 ? (
            <p>No volumes found.</p>
          ) : (
            serverState.volumes
              .sort((a, b) => a.Name.localeCompare(b.Name))
              .map((volume) => <VolumeCard key={volume.Name} volume={volume} />)
          )}
        </div>
      </div>
    </div>
  );
}
