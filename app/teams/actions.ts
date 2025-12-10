"use server";

import { db } from "@/db";
import { teams, teamMembers, users } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function getUserTeam() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return null;
  }

  // Find user's team membership
  const [membership] = await db
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.userId, session.user.id))
    .limit(1);

  if (!membership) {
    return null;
  }

  // Get team details
  const [team] = await db
    .select()
    .from(teams)
    .where(eq(teams.id, membership.teamId))
    .limit(1);

  if (!team) {
    return null;
  }

  // Get all team members with user details
  const members = await db
    .select({
      userId: teamMembers.userId,
      userName: users.name,
      userEmail: users.email,
      userImage: users.image,
    })
    .from(teamMembers)
    .innerJoin(users, eq(teamMembers.userId, users.id))
    .where(eq(teamMembers.teamId, team.id));

  return {
    ...team,
    members,
  };
}

export async function createTeam(formData: FormData) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error("You must be logged in to create a team");
  }

  const teamName = formData.get("teamName") as string;

  if (session.user.id) {
    // Check if user is already in a team
    const existingMember = await db.select().from(teamMembers).where(eq(teamMembers.userId, session.user.id)).limit(1);
    if (existingMember.length > 0) {
      throw new Error("You are already in a team, Cannot create a new one");
    }
  }
  
  if (!teamName || teamName.trim().length === 0) {
    throw new Error("Team name is required");
  }

  // Generate a unique slug
  const slug = teamName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") +
    "-" +
    Math.random().toString(36).substring(2, 8);

  // Create team
  const [newTeam] = await db
    .insert(teams)
    .values({
      name: teamName,
      slug: slug,
    })
    .returning();

  // Add creator as first member
  await db.insert(teamMembers).values({
    teamId: newTeam.id,
    userId: session.user.id,
  });

  return { success: true, slug: newTeam.slug };
}

export async function joinTeam(formData: FormData) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error("You must be logged in to join a team");
  }

  const slug = formData.get("slug") as string;
  
  if (!slug || slug.trim().length === 0) {
    throw new Error("Team code is required");
  }

  // Find team by slug
  const [team] = await db
    .select()
    .from(teams)
    .where(eq(teams.slug, slug))
    .limit(1);

  if (!team) {
    throw new Error("Team not found with this code");
  }

  // Check if user is already a member
  const existingMember = await db
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.userId, session.user.id))
    .limit(1);

  if (existingMember.length > 0) {
    throw new Error("You are already in a team");
  }

  // Add user to team
  await db.insert(teamMembers).values({
    teamId: team.id,
    userId: session.user.id,
  });

  return { success: true, teamName: team.name };
}
