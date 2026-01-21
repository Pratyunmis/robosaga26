"use server";

import { db } from "@/db";
import { events, problemStatementSettings, hackAwayRegistrations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { eventFormSchema, EventFormData } from "./schemas";

import { getCurrentUser } from "./current-user";

export async function createEvent(data: EventFormData) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return { success: false, error: "Unauthorized: Only admins can manage events" };
    }

    const validated = eventFormSchema.parse(data);
    
    await db.insert(events).values({
      ...validated,
      startTime: new Date(validated.startTime),
      endTime: new Date(validated.endTime),
    });

    revalidatePath("/admin/dashboard/events");
    return { success: true };
  } catch (error) {
    console.error("Failed to create event:", error);
    return { success: false, error: "Failed to create event" };
  }
}

export async function updateEvent(id: string, data: EventFormData) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return { success: false, error: "Unauthorized: Only admins can manage events" };
    }

    const validated = eventFormSchema.parse(data);
    
    await db
      .update(events)
      .set({
        ...validated,
        startTime: new Date(validated.startTime),
        endTime: new Date(validated.endTime),
      })
      .where(eq(events.id, id));

    revalidatePath("/admin/dashboard/events");
    return { success: true };
  } catch (error) {
    console.error("Failed to update event:", error);
    return { success: false, error: "Failed to update event" };
  }
}

export async function deleteEvent(id: string) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return { success: false, error: "Unauthorized: Only admins can manage events" };
    }

    await db.delete(events).where(eq(events.id, id));
    revalidatePath("/admin/dashboard/events");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete event:", error);
    return { success: false, error: "Failed to delete event" };
  }
}

// Problem statement titles for reference
const PS_TITLES: Record<number, string> = {
  1: "The Reviewer Who Never Sleeps",
  2: "Seeing the World with One Sensor",
  3: "Finding the Way, One Step at a Time",
  4: "Glove-Controlled Drift Racer: Master Every Move!",
  5: "TrekBot – A Simple Quadruped Walking Robot",
  6: "ChordMate – Never Play the Wrong Chord Again!",
  7: "Drip-Sync: No More Guesswork!",
  8: "Automated Railway Track Fault Detector",
  9: "Agentic AI for Intelligent Personal Financial Decision-Making",
  10: "RescueNet – Every Minute Knows Where to Go",
  11: "Salil's Inbox – Signal, Not Noise",
  12: "Multi-Modal Severity Quantifier",
};

export async function updateProblemStatementMaxParticipants(
  problemStatementId: number, 
  maxParticipants: number
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return { success: false, error: "Unauthorized: Only admins can update max participants" };
    }

    if (problemStatementId < 1 || problemStatementId > 12) {
      return { success: false, error: "Invalid problem statement ID" };
    }

    if (maxParticipants < 1 || maxParticipants > 100) {
      return { success: false, error: "Max participants must be between 1 and 100" };
    }

    // Try to update or insert - we use raw SQL to handle potential table absence
    try {
      // First try to check if record exists
      let existing = null;
      try {
        existing = await db.query.problemStatementSettings.findFirst({
          where: eq(problemStatementSettings.id, problemStatementId),
        });
      } catch {
        // Table might not exist, we'll create the record
      }

      if (existing) {
        // Update existing
        await db
          .update(problemStatementSettings)
          .set({ 
            maxParticipants, 
            updatedAt: new Date() 
          })
          .where(eq(problemStatementSettings.id, problemStatementId));
      } else {
        // Insert new
        await db.insert(problemStatementSettings).values({
          id: problemStatementId,
          title: PS_TITLES[problemStatementId] || `Problem Statement ${problemStatementId}`,
          maxParticipants,
          isActive: true,
          updatedAt: new Date(),
        });
      }

      revalidatePath("/admin/dashboard/hackaway");
      revalidatePath("/hackaway");
      return { success: true };
    } catch (dbError) {
      console.error("Database error:", dbError);
      return { success: false, error: "Database table not available. Please run migrations first." };
    }
  } catch (error) {
    console.error("Failed to update max participants:", error);
    return { success: false, error: "Failed to update max participants" };
  }
}

// Update HackAway registration (rank, isQualified, pptLink)
export async function updateHackawayRegistration(
  registrationId: string,
  data: {
    rank?: number | null;
    isQualified?: boolean;
    pptLink?: string | null;
  }
) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "admin" && user.role !== "moderator")) {
      return { success: false, error: "Unauthorized: Only admins can update registrations" };
    }

    // Validate rank if provided
    if (data.rank !== undefined && data.rank !== null) {
      if (data.rank < 1 || data.rank > 100) {
        return { success: false, error: "Rank must be between 1 and 100" };
      }
    }

    // Validate pptLink if provided
    if (data.pptLink !== undefined && data.pptLink !== null && data.pptLink !== "") {
      try {
        new URL(data.pptLink);
      } catch {
        return { success: false, error: "Invalid PPT link URL" };
      }
    }

    await db
      .update(hackAwayRegistrations)
      .set({
        ...(data.rank !== undefined && { rank: data.rank }),
        ...(data.isQualified !== undefined && { isQualified: data.isQualified }),
        ...(data.pptLink !== undefined && { pptLink: data.pptLink || null }),
      })
      .where(eq(hackAwayRegistrations.id, registrationId));

    revalidatePath("/admin/dashboard/hackaway");
    return { success: true };
  } catch (error) {
    console.error("Failed to update hackaway registration:", error);
    return { success: false, error: "Failed to update registration" };
  }
}
