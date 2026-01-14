"use server";

import { db } from "@/db";
import { events } from "@/db/schema";
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
