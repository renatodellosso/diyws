import { createServer } from "http";
import next from "next";

const dev = process.env.NODE_ENV !== "production";

console.log(`Starting server in ${dev ? "development" : "production"} mode`);

async function startServer(
  app: ReturnType<typeof next>,
  port: number,
  name: string
) {
  await app.prepare();

  const handle = app.getRequestHandler();

  createServer((req, res) => {
    handle(req, res);
  }).listen(port, () => {
    console.log(`Server ${name} listening on http://localhost:${port}`);
  });
}

const leaderPort = parseInt(process.env.LEADER_PORT, 10);
const followerPort = parseInt(process.env.FOLLOWER_PORT, 10);

const leader = next({ dev });
const follower = next({ dev });
startServer(leader, leaderPort, "Web Interface (Leader Node)");
startServer(follower, followerPort, "Follower Node");
