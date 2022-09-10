declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_BASE_URL_API_PROD: string;
      NEXT_PUBLIC_BASE_URL_API_DEV: string;
      NEXT_PUBLIC_BASE_URL_SOCKET_DEV: string;
      NEXT_PUBLIC_BASE_URL_SOCKET_PROD: string;
    }
  }
}

export {};
