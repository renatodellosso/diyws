"use client";

import ContainerCard from "@/components/ContainerCard";
import ImageCard from "@/components/ImageCard";
import ServiceCard from "@/components/ServiceCard";
import ServerStateContext from "@/lib/ServerStateContext";
import Link from "next/link";
import { useContext } from "react";
import { FiPlus } from "react-icons/fi";

export default function Dashboard() {
  const serverState = useContext(ServerStateContext);

  return (
    <div className="p-4 bg-base-200">
      <h1 className="text-4xl">Dashboard</h1>

      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-2xl mb-1">Services</h2>
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
    </div>
  );
}
