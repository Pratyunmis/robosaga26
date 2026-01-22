"use server";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { hackAwayRegistrations, teamMembers, teams, users, problemStatementSettings } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Default problem statements with their titles
const DEFAULT_PROBLEM_STATEMENTS = [
  { id: 1, title: "The Reviewer Who Never Sleeps", maxParticipants: 10 },
  { id: 2, title: "Seeing the World with One Sensor", maxParticipants: 10 },
  { id: 3, title: "Finding the Way, One Step at a Time", maxParticipants: 10 },
  { id: 4, title: "Glove-Controlled Drift Racer: Master Every Move!", maxParticipants: 10 },
  { id: 5, title: "TrekBot – A Simple Quadruped Walking Robot", maxParticipants: 10 },
  { id: 6, title: "ChordMate – Never Play the Wrong Chord Again!", maxParticipants: 10 },
  { id: 7, title: "Drip-Sync: No More Guesswork!", maxParticipants: 10 },
  { id: 8, title: "Automated Railway Track Fault Detector", maxParticipants: 10 },
  { id: 9, title: "Agentic AI for Intelligent Personal Financial Decision-Making", maxParticipants: 10 },
  { id: 10, title: "RescueNet – Every Minute Knows Where to Go", maxParticipants: 10 },
  { id: 11, title: "Salil's Inbox – Signal, Not Noise", maxParticipants: 10 },
  { id: 12, title: "Multi-Modal Severity Quantifier", maxParticipants: 10 },
];

export type HackawayRegistrationState = {
  success?: boolean;
  error?: string;
  message?: string;
  alreadyRegistered?: boolean;
  teamName?: string;
  teamMembers?: { name: string | null; email: string | null }[];
  problemStatementNo?: number;
};

// Get problem statement settings (with defaults if not in DB)
export async function getProblemStatementSettings() {
  // Try to get settings from DB, fallback to empty if table doesn't exist
  let settings: { id: number; title: string; maxParticipants: number; isActive: boolean | null }[] = [];
  try {
    settings = await db.select().from(problemStatementSettings);
  } catch {
    // Table might not exist yet, use defaults
    console.log("problem_statement_settings table not found, using defaults");
  }
  
  // Create a map of existing settings
  const settingsMap = new Map(settings.map(s => [s.id, s]));
  
  // Merge with defaults
  return DEFAULT_PROBLEM_STATEMENTS.map(ps => {
    const existing = settingsMap.get(ps.id);
    return {
      id: ps.id,
      title: existing?.title || ps.title,
      maxParticipants: existing?.maxParticipants ?? ps.maxParticipants,
      isActive: existing?.isActive ?? true,
    };
  });
}

// Get the user's team with members
export async function getUserTeamWithMembers() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in." };
  }

  // Check if user is in a team
  const userTeamMember = await db.query.teamMembers.findFirst({
    where: eq(teamMembers.userId, session.user.id),
  });

  if (!userTeamMember) {
    return { error: "You must join or create a team to register." };
  }

  const teamId = userTeamMember.teamId;

  // Get team details
  const team = await db.query.teams.findFirst({
    where: eq(teams.id, teamId),
  });

  if (!team) {
    return { error: "Team not found." };
  }

  // Get all team members
  const members = await db
    .select({
      name: users.name,
      email: users.email,
    })
    .from(teamMembers)
    .innerJoin(users, eq(teamMembers.userId, users.id))
    .where(eq(teamMembers.teamId, teamId));

  // Check if already registered for HackAway
  const existingRegistration = await db.query.hackAwayRegistrations.findFirst({
    where: eq(hackAwayRegistrations.teamId, teamId),
  });

  return {
    teamId,
    teamName: team.name,
    teamMembers: members,
    alreadyRegistered: !!existingRegistration,
    existingProblemStatement: existingRegistration?.problemStatementNo,
  };
}

// Register for HackAway with max participant check
export async function registerForHackaway(
  problemStatementNo: number
): Promise<HackawayRegistrationState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in to register." };
  }

  // Check if user is in a team
  const userTeamMember = await db.query.teamMembers.findFirst({
    where: eq(teamMembers.userId, session.user.id),
  });

  if (!userTeamMember) {
    return { error: "You must join or create a team to register for HackAway." };
  }

  const teamId = userTeamMember.teamId;

  // Get team details
  const team = await db.query.teams.findFirst({
    where: eq(teams.id, teamId),
  });

  if (!team) {
    return { error: "Team not found." };
  }

  // Check if already registered
  const existingRegistration = await db.query.hackAwayRegistrations.findFirst({
    where: eq(hackAwayRegistrations.teamId, teamId),
  });

  if (existingRegistration) {
    return {
      success: false,
      alreadyRegistered: true,
      message: "Your team is already registered for HackAway.",
      problemStatementNo: existingRegistration.problemStatementNo,
    };
  }

  // Get problem statement settings
  const psSettings = await getProblemStatementSettings();
  const selectedPS = psSettings.find(ps => ps.id === problemStatementNo);
  
  if (!selectedPS) {
    return { error: "Invalid problem statement selected." };
  }
  
  if (!selectedPS.isActive) {
    return { error: "This problem statement is not available for registration." };
  }

  // Check current registration count for this problem statement
  const [countResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(hackAwayRegistrations)
    .where(eq(hackAwayRegistrations.problemStatementNo, problemStatementNo));
  
  const currentCount = countResult?.count || 0;
  
  if (currentCount >= selectedPS.maxParticipants) {
    return { 
      error: `Maximum participants (${selectedPS.maxParticipants}) reached for "${selectedPS.title}". Please select a different problem statement.` 
    };
  }

  // Get team members for confirmation
  const members = await db
    .select({
      name: users.name,
      email: users.email,
    })
    .from(teamMembers)
    .innerJoin(users, eq(teamMembers.userId, users.id))
    .where(eq(teamMembers.teamId, teamId));

  // Validate team size (minimum 2, maximum 4 members)
  const memberCount = members.length;
  if (memberCount < 2) {
    return { 
      error: "Your team must have at least 2 members to register for HackAway. Please add more members to your team." 
    };
  }
  if (memberCount > 4) {
    return { 
      error: "Your team has more than 4 members. HackAway teams can have a maximum of 4 members. Please adjust your team size." 
    };
  }

  // Register the team
  try {
    await db.insert(hackAwayRegistrations).values({
      teamId: teamId,
      problemStatementNo: problemStatementNo,
    });

    revalidatePath("/hackaway");
    return {
      success: true,
      message: "Successfully registered for HackAway!",
      teamName: team.name,
      teamMembers: members,
      problemStatementNo: problemStatementNo,
    };
  } catch (error) {
    console.error("HackAway registration error:", error);
    return { error: "Failed to register. Please try again." };
  }
}

// Get registration counts per problem statement with max limits
export async function getHackawayRegistrationStats() {
  const results = await db
    .select({
      problemStatementNo: hackAwayRegistrations.problemStatementNo,
      count: sql<number>`count(*)`,
    })
    .from(hackAwayRegistrations)
    .groupBy(hackAwayRegistrations.problemStatementNo);

  // Get problem statement settings
  const psSettings = await getProblemStatementSettings();
  
  // Create stats with max info
  const stats: Record<number, { count: number; max: number; isFull: boolean }> = {};
  
  psSettings.forEach(ps => {
    const regCount = results.find(r => r.problemStatementNo === ps.id)?.count || 0;
    stats[ps.id] = {
      count: regCount,
      max: ps.maxParticipants,
      isFull: regCount >= ps.maxParticipants,
    };
  });

  return stats;
}

// Check if user's team is registered
export async function checkHackawayRegistration() {
  const session = await auth();
  if (!session?.user?.id) {
    return { isRegistered: false };
  }

  const userTeamMember = await db.query.teamMembers.findFirst({
    where: eq(teamMembers.userId, session.user.id),
  });

  if (!userTeamMember) {
    return { isRegistered: false, noTeam: true };
  }

  const existingRegistration = await db.query.hackAwayRegistrations.findFirst({
    where: eq(hackAwayRegistrations.teamId, userTeamMember.teamId),
  });

  if (existingRegistration) {
    // Get team name
    const team = await db.query.teams.findFirst({
      where: eq(teams.id, userTeamMember.teamId),
    });

    return {
      isRegistered: true,
      teamName: team?.name,
      problemStatementNo: existingRegistration.problemStatementNo,
    };
  }

  return { isRegistered: false };
}
