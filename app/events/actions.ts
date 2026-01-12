"use server";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { events, eventRegistrations, teamMembers, teams } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type RegistrationState = {
  success?: boolean;
  error?: string;
  message?: string;
  alreadyRegistered?: boolean;
};

export async function registerForEvent(eventSlug: string): Promise<RegistrationState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in to register." };
  }

  // 1. Check if user is in a team
  const userTeamMember = await db.query.teamMembers.findFirst({
    where: eq(teamMembers.userId, session.user.id),
  });

  if (!userTeamMember) {
    return { error: "You must join or create a team to register for events." };
  }

  const teamId = userTeamMember.teamId;

  // 2. Find the event
  const event = await db.query.events.findFirst({
    where: eq(events.slug, eventSlug),
  });

  if (!event) {
    return { error: "Event not found." };
  }

  // 3. Check if team is already registered
  const existingRegistration = await db.query.eventRegistrations.findFirst({
    where: and(
      eq(eventRegistrations.teamId, teamId),
      eq(eventRegistrations.eventId, event.id)
    ),
  });

  if (existingRegistration) {
    return { 
      success: false, 
      alreadyRegistered: true,
      message: "Your team is already registered for this event." 
    };
  }

  // 4. Register the team
  try {
    await db.insert(eventRegistrations).values({
      eventId: event.id,
      teamId: teamId,
    });
    
    revalidatePath("/events");
    return { success: true, message: "Successfully registered!" };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Failed to register. Please try again." };
  }
}

export async function getUserEventRegistrations() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const userTeamMember = await db.query.teamMembers.findFirst({
    where: eq(teamMembers.userId, session.user.id),
  });

  if (!userTeamMember) return [];

  if (!userTeamMember) return [];

  const results = await db
    .select({ slug: events.slug })
    .from(eventRegistrations)
    .innerJoin(events, eq(eventRegistrations.eventId, events.id))
    .where(eq(eventRegistrations.teamId, userTeamMember.teamId));

  return results.map((r) => r.slug);
}

export async function getEvents() {
  const result = await db
    .select({
      id: events.id,
      name: events.name,
      slug: events.slug,
      description: events.description,
      date: events.date,
    })
    .from(events)
    .where(eq(events.isActive, true));
  
  return result;
}
