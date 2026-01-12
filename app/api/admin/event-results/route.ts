import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/admin/current-user";
import { db } from "@/db";
import { eventRegistrations, teams } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { eventId, teamId, rank, marks } = body;

    if (!eventId || !teamId) {
      return new NextResponse("Missing eventId or teamId", { status: 400 });
    }

    const existingRegistration = await db.query.eventRegistrations.findFirst({
      where: and(
        eq(eventRegistrations.eventId, eventId),
        eq(eventRegistrations.teamId, teamId)
      ),
    });

    if (!existingRegistration) {
      return new NextResponse("Registration not found", { status: 404 });
    }

    const previousScore = existingRegistration.score || 0;
    const scoreDiff = marks - previousScore;

    // Update the event registration with score and rank
    await db
      .update(eventRegistrations)
      .set({
        score: marks,
        rank: rank,
      })
      .where(
        and(
          eq(eventRegistrations.eventId, eventId),
          eq(eventRegistrations.teamId, teamId)
        )
      );
    
    // Update team score with the difference
    await db
      .update(teams)
      .set({
        score: sql<number>`${teams.score} + ${scoreDiff}`,
      })
      .where(eq(teams.id, teamId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[EVENT_RESULTS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { eventId, teamId } = body;

    if (!eventId || !teamId) {
      return new NextResponse("Missing eventId or teamId", { status: 400 });
    }

    // Get current marks before resetting
    const existingRegistration = await db.query.eventRegistrations.findFirst({
      where: and(
        eq(eventRegistrations.eventId, eventId),
        eq(eventRegistrations.teamId, teamId)
      ),
    });

    if (!existingRegistration) {
      return new NextResponse("Registration not found", { status: 404 });
    }

    const marksToRemove = existingRegistration.score || 0;

    // Reset score and rank
    await db
      .update(eventRegistrations)
      .set({
        score: 0,
        rank: null,
      })
      .where(
        and(
          eq(eventRegistrations.eventId, eventId),
          eq(eventRegistrations.teamId, teamId)
        )
      );
    
    // Reset score from the team
    await db
      .update(teams)
      .set({
        score: sql<number>`${teams.score} - ${marksToRemove}`,
      })
      .where(eq(teams.id, teamId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[EVENT_RESULTS_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
