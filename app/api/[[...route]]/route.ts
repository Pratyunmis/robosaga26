import { db } from "@/db";
import { teamMembers, teams, users, joinRequests } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, desc, and } from "drizzle-orm";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import type { Context } from "hono";

// Team size constraints
const MIN_TEAM_SIZE = 2;
const MAX_TEAM_SIZE = 4;

// Define session type
type Session = {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
};

// Define context variables
type Variables = {
  session: Session;
};

const app = new Hono<{ Variables: Variables }>().basePath("/api");

// Helper function to get session from cookie
async function getSessionFromCookie() {
  const session = await auth();
  return session;
}

// Middleware to verify authenticated user
async function requireAuth(
  c: Context<{ Variables: Variables }>,
  next: () => Promise<void>
) {
  const session = await getSessionFromCookie();

  if (!session?.user?.id) {
    return c.json({ error: "Unauthorized - Please log in" }, 401);
  }

  c.set("session", session as Session);
  await next();
}

// Admin middleware
async function requireAdmin(
  c: Context<{ Variables: Variables }>,
  next: () => Promise<void>
) {
  const session = await getSessionFromCookie();

  if (!session?.user?.id) {
    return c.json({ error: "Unauthorized - Please log in" }, 401);
  }

  if (session.user.role !== "admin") {
    return c.json({ error: "Forbidden - Admin access required" }, 403);
  }

  c.set("session", session as Session);
  await next();
}

app.get("/hello", (c) => {
  return c.json({
    message: "Hello Next.js!",
  });
});

// Public route - Get team by slug
app.get("/teams/:slug", async (c) => {
  try {
    const slug = c.req.param("slug");

    const [team] = await db
      .select()
      .from(teams)
      .where(eq(teams.slug, slug))
      .limit(1);

    if (!team) {
      return c.json({ error: "Team not found" }, 404);
    }

    const members = await db
      .select({
        userId: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
        role: teamMembers.role,
      })
      .from(teamMembers)
      .innerJoin(users, eq(teamMembers.userId, users.id))
      .where(eq(teamMembers.teamId, team.id));

    return c.json({
      team: {
        id: team.id,
        name: team.name,
        slug: team.slug,
        leaderId: team.leaderId,
        createdAt: team.createdAt,
      },
      members,
    });
  } catch (error) {
    console.error("Error fetching team:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Public route - Get leaderboard
app.get("/leaderboard", async (c) => {
  try {
    const allTeams = await db
      .select({
        id: teams.id,
        name: teams.name,
        slug: teams.slug,
        score: teams.score,
        createdAt: teams.createdAt,
      })
      .from(teams)
      .orderBy(desc(teams.score));

    const teamsWithMembers = await Promise.all(
      allTeams.map(async (team) => {
        const members = await db
          .select()
          .from(teamMembers)
          .where(eq(teamMembers.teamId, team.id));

        return {
          id: team.id,
          teamName: team.name,
          slug: team.slug,
          points: team.score,
          members: members.length,
          createdAt: team.createdAt,
        };
      })
    );

    const rankedTeams = teamsWithMembers.map((team, index) => ({
      ...team,
      rank: index + 1,
    }));

    return c.json({ teams: rankedTeams });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Apply authentication middleware
app.use("/teams/user/*", requireAuth);
app.use("/teams/create", requireAuth);
app.use("/teams/join/*", requireAuth);
app.use("/teams/requests/*", requireAuth);
app.use("/teams/members/*", requireAuth);
app.use("/teams/leave", requireAuth);
app.use("/admin/*", requireAuth);

// ============ ADMIN ROUTES ============

// Admin route - Get all teams with members
app.get("/admin/teams", async (c) => {
  try {
    const allTeams = await db
      .select()
      .from(teams)
      .orderBy(desc(teams.createdAt));

    const teamsWithMembers = await Promise.all(
      allTeams.map(async (team) => {
        const members = await db
          .select({
            userId: users.id,
            userName: users.name,
            userEmail: users.email,
            userImage: users.image,
            phoneNo: users.phoneNo,
            role: teamMembers.role,
            joinedAt: teamMembers.joinedAt,
          })
          .from(teamMembers)
          .innerJoin(users, eq(teamMembers.userId, users.id))
          .where(eq(teamMembers.teamId, team.id));

        return {
          ...team,
          members,
        };
      })
    );

    return c.json({
      teams: teamsWithMembers,
      totalTeams: teamsWithMembers.length,
    });
  } catch (error) {
    console.error("Error fetching admin teams:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// ============ TEAM ROUTES ============

// Get current user's team with full details
app.get("/teams/user/me", async (c) => {
  try {
    const session = c.get("session");

    const [membership] = await db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.userId, session.user.id))
      .limit(1);

    if (!membership) {
      return c.json({ team: null });
    }

    const [team] = await db
      .select()
      .from(teams)
      .where(eq(teams.id, membership.teamId))
      .limit(1);

    if (!team) {
      return c.json({ team: null });
    }

    const members = await db
      .select({
        userId: teamMembers.userId,
        userName: users.name,
        userEmail: users.email,
        userImage: users.image,
        role: teamMembers.role,
        joinedAt: teamMembers.joinedAt,
      })
      .from(teamMembers)
      .innerJoin(users, eq(teamMembers.userId, users.id))
      .where(eq(teamMembers.teamId, team.id));

    // Get pending join requests if user is leader
    let pendingRequests: Array<{
      id: string;
      userId: string;
      userName: string | null;
      userEmail: string | null;
      userImage: string | null;
      createdAt: Date;
    }> = [];
    
    if (team.leaderId === session.user.id) {
      const requests = await db
        .select({
          id: joinRequests.id,
          userId: joinRequests.userId,
          userName: users.name,
          userEmail: users.email,
          userImage: users.image,
          createdAt: joinRequests.createdAt,
        })
        .from(joinRequests)
        .innerJoin(users, eq(joinRequests.userId, users.id))
        .where(
          and(
            eq(joinRequests.teamId, team.id),
            eq(joinRequests.status, "pending")
          )
        );
      pendingRequests = requests;
    }

    const isLeader = team.leaderId === session.user.id;

    return c.json({
      team: {
        ...team,
        members,
        pendingRequests,
        isLeader,
        minTeamSize: MIN_TEAM_SIZE,
        maxTeamSize: MAX_TEAM_SIZE,
      },
    });
  } catch (error) {
    console.error("Error fetching user team:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Create a new team
app.post("/teams/create", async (c) => {
  try {
    const session = c.get("session");
    const body = await c.req.json();
    const teamName = body.teamName;

    const existingMember = await db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.userId, session.user.id))
      .limit(1);

    if (existingMember.length > 0) {
      return c.json(
        { error: "You are already in a team, cannot create a new one" },
        400
      );
    }

    if (!teamName || teamName.trim().length === 0) {
      return c.json({ error: "Team name is required" }, 400);
    }

    const slug =
      teamName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") +
      "-" +
      Math.random().toString(36).substring(2, 8);

    // Create team with current user as leader
    const [newTeam] = await db
      .insert(teams)
      .values({
        name: teamName,
        slug: slug,
        leaderId: session.user.id,
      })
      .returning();

    // Add creator as first member with leader role
    await db.insert(teamMembers).values({
      teamId: newTeam.id,
      userId: session.user.id,
      role: "leader",
    });

    return c.json({ success: true, slug: newTeam.slug });
  } catch (error) {
    console.error("Error creating team:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Request to join a team (creates pending request)
app.post("/teams/join/request", async (c) => {
  try {
    const session = c.get("session");
    const body = await c.req.json();
    const slug = body.slug;

    if (!slug || slug.trim().length === 0) {
      return c.json({ error: "Team code is required" }, 400);
    }

    const [team] = await db
      .select()
      .from(teams)
      .where(eq(teams.slug, slug))
      .limit(1);

    if (!team) {
      return c.json({ error: "Team not found with this code" }, 404);
    }

    // Check team size
    const currentMembers = await db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.teamId, team.id));

    if (currentMembers.length >= MAX_TEAM_SIZE) {
      return c.json({ error: `Team is full (max ${MAX_TEAM_SIZE} members)` }, 400);
    }

    // Check if user is already a member of any team
    const existingMember = await db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.userId, session.user.id))
      .limit(1);

    if (existingMember.length > 0) {
      return c.json({ error: "You are already in a team" }, 400);
    }

    // Check if there's already a pending request
    const existingRequest = await db
      .select()
      .from(joinRequests)
      .where(
        and(
          eq(joinRequests.teamId, team.id),
          eq(joinRequests.userId, session.user.id),
          eq(joinRequests.status, "pending")
        )
      )
      .limit(1);

    if (existingRequest.length > 0) {
      return c.json({ error: "You already have a pending request to join this team" }, 400);
    }

    // Create join request
    await db.insert(joinRequests).values({
      teamId: team.id,
      userId: session.user.id,
      status: "pending",
    });

    return c.json({ success: true, message: "Join request sent! Waiting for leader approval.", teamName: team.name });
  } catch (error) {
    console.error("Error requesting to join team:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Leader accepts join request
app.post("/teams/requests/accept", async (c) => {
  try {
    const session = c.get("session");
    const body = await c.req.json();
    const { requestId } = body;

    if (!requestId) {
      return c.json({ error: "Request ID is required" }, 400);
    }

    // Get the request
    const [request] = await db
      .select()
      .from(joinRequests)
      .where(eq(joinRequests.id, requestId))
      .limit(1);

    if (!request) {
      return c.json({ error: "Request not found" }, 404);
    }

    // Verify requester is the team leader
    const [team] = await db
      .select()
      .from(teams)
      .where(eq(teams.id, request.teamId))
      .limit(1);

    if (!team || team.leaderId !== session.user.id) {
      return c.json({ error: "Only the team leader can accept requests" }, 403);
    }

    // Check team size again
    const currentMembers = await db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.teamId, team.id));

    if (currentMembers.length >= MAX_TEAM_SIZE) {
      return c.json({ error: `Team is full (max ${MAX_TEAM_SIZE} members)` }, 400);
    }

    // Check if user is not already in a team
    const existingMember = await db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.userId, request.userId))
      .limit(1);

    if (existingMember.length > 0) {
      // Update request status and inform
      await db
        .update(joinRequests)
        .set({ status: "rejected" })
        .where(eq(joinRequests.id, requestId));
      return c.json({ error: "User is already in another team" }, 400);
    }

    // Add user to team
    await db.insert(teamMembers).values({
      teamId: team.id,
      userId: request.userId,
      role: "member",
    });

    // Update request status
    await db
      .update(joinRequests)
      .set({ status: "accepted" })
      .where(eq(joinRequests.id, requestId));

    return c.json({ success: true, message: "Member added to team!" });
  } catch (error) {
    console.error("Error accepting request:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Leader rejects join request
app.post("/teams/requests/reject", async (c) => {
  try {
    const session = c.get("session");
    const body = await c.req.json();
    const { requestId } = body;

    if (!requestId) {
      return c.json({ error: "Request ID is required" }, 400);
    }

    const [request] = await db
      .select()
      .from(joinRequests)
      .where(eq(joinRequests.id, requestId))
      .limit(1);

    if (!request) {
      return c.json({ error: "Request not found" }, 404);
    }

    const [team] = await db
      .select()
      .from(teams)
      .where(eq(teams.id, request.teamId))
      .limit(1);

    if (!team || team.leaderId !== session.user.id) {
      return c.json({ error: "Only the team leader can reject requests" }, 403);
    }

    await db
      .update(joinRequests)
      .set({ status: "rejected" })
      .where(eq(joinRequests.id, requestId));

    return c.json({ success: true, message: "Request rejected" });
  } catch (error) {
    console.error("Error rejecting request:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Leader removes a member
app.post("/teams/members/remove", async (c) => {
  try {
    const session = c.get("session");
    const body = await c.req.json();
    const { memberId } = body;

    if (!memberId) {
      return c.json({ error: "Member ID is required" }, 400);
    }

    // Get user's team
    const [membership] = await db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.userId, session.user.id))
      .limit(1);

    if (!membership) {
      return c.json({ error: "You are not in a team" }, 400);
    }

    const [team] = await db
      .select()
      .from(teams)
      .where(eq(teams.id, membership.teamId))
      .limit(1);

    if (!team || team.leaderId !== session.user.id) {
      return c.json({ error: "Only the team leader can remove members" }, 403);
    }

    if (memberId === session.user.id) {
      return c.json({ error: "You cannot remove yourself. Transfer leadership first or delete the team." }, 400);
    }

    // Remove the member
    await db
      .delete(teamMembers)
      .where(
        and(
          eq(teamMembers.teamId, team.id),
          eq(teamMembers.userId, memberId)
        )
      );

    return c.json({ success: true, message: "Member removed from team" });
  } catch (error) {
    console.error("Error removing member:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Member leaves team
app.post("/teams/leave", async (c) => {
  try {
    const session = c.get("session");

    const [membership] = await db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.userId, session.user.id))
      .limit(1);

    if (!membership) {
      return c.json({ error: "You are not in a team" }, 400);
    }

    const [team] = await db
      .select()
      .from(teams)
      .where(eq(teams.id, membership.teamId))
      .limit(1);

    if (team?.leaderId === session.user.id) {
      return c.json({ error: "Team leader cannot leave. Transfer leadership first or delete the team." }, 400);
    }

    await db
      .delete(teamMembers)
      .where(
        and(
          eq(teamMembers.teamId, membership.teamId),
          eq(teamMembers.userId, session.user.id)
        )
      );

    return c.json({ success: true, message: "You have left the team" });
  } catch (error) {
    console.error("Error leaving team:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Get user's pending join requests
app.get("/teams/user/requests", async (c) => {
  try {
    const session = c.get("session");

    const requests = await db
      .select({
        id: joinRequests.id,
        teamId: joinRequests.teamId,
        teamName: teams.name,
        teamSlug: teams.slug,
        status: joinRequests.status,
        createdAt: joinRequests.createdAt,
      })
      .from(joinRequests)
      .innerJoin(teams, eq(joinRequests.teamId, teams.id))
      .where(eq(joinRequests.userId, session.user.id));

    return c.json({ requests });
  } catch (error) {
    console.error("Error fetching user requests:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Onboarding route handlers
app.post("/onboarding", async (c) => {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return c.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await c.req.json();
    const { rollno, branch, phoneNo } = body;

    if (!rollno || !branch || !phoneNo) {
      return c.json(
        { message: "Roll number, branch, and phone number are required" },
        { status: 400 }
      );
    }

    await db
      .update(users)
      .set({
        rollNo: rollno,
        branch,
        phoneNo,
      })
      .where(eq(users.id, session.user.id));

    return c.json({ message: "Profile updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating profile:", error);
    return c.json({ message: "Internal server error" }, { status: 500 });
  }
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
