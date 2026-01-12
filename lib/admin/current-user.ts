import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export type CurrentUser = {
  id: string;
  email: string;
  name: string;
  avatar: string;
  role: "admin" | "user";
  rollNo: string | null;
  branch: string | null;
} | null;

export async function getCurrentUser(): Promise<CurrentUser> {
  const session = await auth();
  
  if (!session?.user?.id) {
    return null;
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email || "",
    name: user.name || user.email?.split("@")[0] || "User",
    avatar: user.image || "",
    role: user.role as "admin" | "user",
    rollNo: user.rollNo,
    branch: user.branch,
  };
}

export async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized - Please log in");
  }

  if (user.role !== "admin") {
    throw new Error(`Access denied. Required role: admin. Current role: ${user.role}`);
  }

  return user;
}
