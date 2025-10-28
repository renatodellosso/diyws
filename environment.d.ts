declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXTAUTH_URL: string;
      NEXTAUTH_SECRET: string;
      USERNAME: string;
      PASSWORD: string;
    }
  }
}

export {};
