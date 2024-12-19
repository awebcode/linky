import type { Role } from "@prisma/client";

//* ENV CONFIGURATION FOR GLOBAL SCOPE *//
namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    PORT: string;
    CLIENT_URI: string;
    ACCESS_TOKEN_EXPIRE: number;
  }
}

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        role: Role;
      };
    }
  }
}
