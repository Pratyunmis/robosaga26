import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      rollNo: string | null;
      branch: string | null;
      phoneNo: string | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role?: string;
    rollNo?: string | null;
    branch?: string | null;
    phoneNo?: string | null;
    joinedAt?: Date | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: string;
    rollNo: string | null;
    branch: string | null;
    phoneNo: string | null;
  }
}
