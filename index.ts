import { createServer, IncomingMessage } from "http";
import next from "next";

const dev = process.env.NODE_ENV !== "production";

console.log(`Starting server in ${dev ? "development" : "production"} mode`);

async function startServer(
  app: ReturnType<typeof next>,
  port: number,
  name: string,
  requestFilter: (req: IncomingMessage) => boolean
) {
  await app.prepare();

  const handle = app.getRequestHandler();

  createServer((req, res) => {
    if (!requestFilter(req)) {
      res.statusCode = 403;
      res.end("Forbidden");
      return;
    }
    handle(req, res);
  }).listen(port, () => {
    console.log(`Server ${name} listening on http://localhost:${port}`);
  });
}

async function registerFollowerWithLeader() {
  const leaderIp = process.env.LEADER_IP;
  const followerPort = process.env.FOLLOWER_PORT;

  if (!leaderIp || !followerPort) {
    console.error("LEADER_IP and FOLLOWER_PORT must be set for follower nodes");
    return;
  }

  const followerId = process.env.FOLLOWER_ID;
  const followerName = process.env.FOLLOWER_NAME;

  if (!followerId) {
    console.error("FOLLOWER_ID must be set for follower nodes");
    return;
  }

  if (!followerName) {
    console.error("FOLLOWER_NAME must be set for follower nodes");
    return;
  }

  const res = await fetch(`http://${leaderIp}:${followerPort}/api/follower`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: followerId, name: followerName }),
  });

  if (res.ok) {
    console.log("Successfully registered with leader node");
  } else {
    console.error(
      `Failed to register with leader node: ${res.status} ${res.statusText}`
    );
  }
}

if (process.env.IS_LEADER === "true") {
  const leaderPort = parseInt(process.env.LEADER_PORT, 10);
  const leader = next({ dev });
  startServer(leader, leaderPort, "Web Interface (Leader Node)", (req) => {
    if (!req.url) return false;
    // Filter out API requests
    return !req.url.startsWith("/api/follower");
  }).then(registerFollowerWithLeader);
} else {
  registerFollowerWithLeader();
}

const followerPort = parseInt(process.env.FOLLOWER_PORT, 10);

const follower = next({ dev });

startServer(follower, followerPort, "Follower Node", (req) => {
  if (!req.url) return false;
  // Filter out page requests
  return req.url.startsWith("/api/follower");
});
