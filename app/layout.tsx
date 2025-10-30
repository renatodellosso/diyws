"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import ServerStateContext from "@/lib/ServerStateContext";
import { ServerState } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";
import LoadingScreen from "@/components/screens/LoadingScreen";
import Header from "@/components/Header";
import { throwOnError } from "@/lib/utils";
import { getSession, signIn } from "next-auth/react";
import { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [serverState, setServerState] = useState<ServerState>();
  const [lastUpdated, setLastUpdated] = useState<Date>();
  const [pingTimeMs, setPingTimeMs] = useState<number>();

  async function updateServerState() {
    const start = performance.now();
    const res = await api.serverState.get().then(throwOnError);
    const state = await res.json();
    setServerState(state);
    setLastUpdated(new Date());
    setPingTimeMs(performance.now() - start);
  }
  const update = useCallback(
    (update: (prev: ServerState) => Partial<ServerState>) => {
      setServerState((prevState) => ({
        ...prevState!,
        ...update(prevState!),
      }));
    },
    [setServerState]
  );

  useEffect(() => {}, []);

  useEffect(() => {
    getSession().then((session) => {
      if (!session?.user) {
        signIn();
        return;
      }

      updateServerState();
      setInterval(updateServerState, 5000);
    });
  }, []);

  return (
    <html lang="en">
      <title>
        {`${
          !serverState
            ? "Loading..."
            : `${serverState?.services.filter((service) => service.container?.State === "running").length}/${serverState?.services.length}
            Services Running`
        } | DIYWS`}
      </title>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-base-200`}
      >
        {serverState ? (
          <ServerStateContext
            value={{
              ...serverState,
              lastUpdated,
              pingTimeMs,
              fetch: updateServerState,
              update,
            }}
          >
            <Toaster position="top-right" />
            <Header />
            {children}
          </ServerStateContext>
        ) : (
          <LoadingScreen />
        )}
      </body>
    </html>
  );
}
