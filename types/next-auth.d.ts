import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      isDefaultPassword?: boolean; // Nova flag apenas em memória
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
    isDefaultPassword?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    isDefaultPassword?: boolean;
  }
}
