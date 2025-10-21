"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import ServerStateContext from "@/lib/ServerStateContext";
import { ServerState } from "@/lib/types";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import LoadingScreen from "@/components/screens/LoadingScreen";

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

  async function updateServerState() {
    console.log("Updating server state...");
    const res = await api.serverState.get();
    const state = await res.json();
    setServerState(state);
    setLastUpdated(new Date());
    console.log("Server state updated:", state);
  }

  useEffect(() => {
    updateServerState();
    const interval = setInterval(updateServerState, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {serverState ? (
          <ServerStateContext
            value={{ ...serverState, lastUpdated: lastUpdated! }}
          >
            <Toaster position="top-right" />
            {children}
          </ServerStateContext>
        ) : (
          <LoadingScreen />
        )}
      </body>
    </html>
  );
}
