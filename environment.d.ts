declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXTAUTH_URL: string;
      NEXTAUTH_SECRET: string;
      USERNAME: string;
      PASSWORD: string;
      LEADER_PORT: string;
      FOLLOWER_PORT: string;
      LEADER_IP: string;
      NODE_ENV: "development" | "production";
    }
  }
}

export {};
