import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/admin/current-user";
import { updateTeamScore } from "@/lib/admin/queries";

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { teamId, score } = await request.json();

    if (!teamId || score === undefined) {
      return NextResponse.json(
        { error: "Team ID and score are required" },
        { status: 400 }
      );
    }

    if (typeof score !== "number" || score < 0) {
      return NextResponse.json(
        { error: "Score must be a non-negative number" },
        { status: 400 }
      );
    }

    const updatedTeam = await updateTeamScore(teamId, score);

    return NextResponse.json({
      success: true,
      team: updatedTeam,
    });
  } catch (error) {
    console.error("Error updating team score:", error);
    return NextResponse.json(
      { error: "Failed to update team score" },
      { status: 500 }
    );
  }
}
