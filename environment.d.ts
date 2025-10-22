declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_BASE_URL: string;
      NEXTAUTH_URL: string;
      NEXTAUTH_SECRET: string;
      USERNAME: string;
      PASSWORD: string;
    }
  }
}

export {};
