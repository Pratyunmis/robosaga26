import NextAuth from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/db/index"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
 
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  cookies: {
    pkceCodeVerifier: {
      name: "next-auth.pkce.code_verifier",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    async signIn() {
      // Allow all users to sign in
      return true;
    },
    async jwt({ token, user, trigger }) {
      // Initial sign in - fetch user data from database
      if (user) {
        const dbUser = await db
          .select()
          .from(users)
          .where(eq(users.id, user.id!))
          .limit(1);
        
        if (dbUser.length > 0) {
          token.id = dbUser[0].id;
          token.role = dbUser[0].role;
          token.rollNo = dbUser[0].rollNo;
          token.branch = dbUser[0].branch;
          token.phoneNo = dbUser[0].phoneNo;
          token.joinedAt = dbUser[0].createdAt;
        } else {
          token.id = user.id!;
          token.role = user.role || "user";
          token.rollNo = null;
          token.branch = null;
          token.phoneNo = null;
          token.joinedAt = null;
        }
      }
      
      // Update session (when update() is called)
      if (trigger === "update" && token.id) {
        const dbUser = await db
          .select()
          .from(users)
          .where(eq(users.id, token.id as string))
          .limit(1);
        
        if (dbUser.length > 0) {
          token.role = dbUser[0].role;
          token.rollNo = dbUser[0].rollNo;
          token.phoneNo = dbUser[0].phoneNo;
          token.branch = dbUser[0].branch;
          token.joinedAt = dbUser[0].createdAt;
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.rollNo = token.rollNo as string | null;
        session.user.branch = token.branch as string | null;
        session.user.phoneNo = token.phoneNo as string | null;
        session.user.joinedAt = token.joinedAt as Date | null;
      }
      return session;
    },
  },
})