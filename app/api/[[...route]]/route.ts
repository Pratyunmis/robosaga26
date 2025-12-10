import { db } from '@/db'
import { teamMembers, teams, users } from '@/db/schema'
import { auth } from '@/lib/auth'
import { eq, desc } from 'drizzle-orm'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import type { Context } from 'hono'

// Define session type
type Session = {
  user: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

// Define context variables
type Variables = {
  session: Session
}

const app = new Hono<{ Variables: Variables }>().basePath('/api')

// Helper function to get session from cookie
async function getSessionFromCookie() {
  // NextAuth stores session in a cookie, we can verify it through auth()
  const session = await auth()
  return session
}

// Middleware to verify authenticated user
async function requireAuth(c: Context<{ Variables: Variables }>, next: () => Promise<void>) {
  const session = await getSessionFromCookie()
  
  if (!session?.user?.id) {
    return c.json({ error: 'Unauthorized - Please log in' }, 401)
  }
  
  c.set('session', session as Session)
  await next()
}

app.get('/hello', (c) => {
  return c.json({
    message: 'Hello Next.js!',
  })
})

// Public route - Get team by slug
app.get("/teams/:slug", async (c) => {
  try {
    const slug = c.req.param("slug");

    // Find team by slug
    const [team] = await db
      .select()
      .from(teams)
      .where(eq(teams.slug, slug))
      .limit(1);

    if (!team) {
      return c.json(
        { error: "Team not found" },
        404
      );
    }

    // Get team members
    const members = await db
      .select({
        userId: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
      })
      .from(teamMembers)
      .innerJoin(users, eq(teamMembers.userId, users.id))
      .where(eq(teamMembers.teamId, team.id));

    return c.json({
      team: {
        id: team.id,
        name: team.name,
        slug: team.slug,
        createdAt: team.createdAt,
      },
      members,
    });
  } catch (error) {
    console.error("Error fetching team:", error);
    return c.json(
      { error: "Internal server error" },
      500
    );
  }
});

// Public route - Get leaderboard
app.get("/leaderboard", async (c) => {
  try {
    // Get all teams with member count
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

    // Get member counts for each team
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

    // Add rank to teams (already sorted by score desc)
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

// Apply authentication middleware to protected routes
app.use('/teams/user/*', requireAuth)
app.use('/teams/create', requireAuth)
app.use('/teams/join', requireAuth)

// Protected route - Get current user's team
app.get("/teams/user/me", async (c) => {
  try {
    const session = c.get('session');

    // Find user's team membership
    const [membership] = await db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.userId, session.user.id))
      .limit(1);

    if (!membership) {
      return c.json({ team: null });
    }

    // Get team details
    const [team] = await db
      .select()
      .from(teams)
      .where(eq(teams.id, membership.teamId))
      .limit(1);

    if (!team) {
      return c.json({ team: null });
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

    return c.json({
      team: {
        ...team,
        members,
      },
    });
  } catch (error) {
    console.error("Error fetching user team:", error);
    return c.json(
      { error: "Internal server error" },
      500
    );
  }
});

// Protected route - Create a new team
app.post("/teams/create", async (c) => {
  try {
    const session = c.get('session');
    const body = await c.req.json();
    const teamName = body.teamName;

    // Check if user is already in a team
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

    // Generate a unique slug
    const slug =
      teamName
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

    return c.json({ success: true, slug: newTeam.slug });
  } catch (error) {
    console.error("Error creating team:", error);
    return c.json(
      { error: "Internal server error" },
      500
    );
  }
});

// Protected route - Join a team
app.post("/teams/join", async (c) => {
  try {
    const session = c.get('session');
    const body = await c.req.json();
    const slug = body.slug;

    if (!slug || slug.trim().length === 0) {
      return c.json({ error: "Team code is required" }, 400);
    }

    // Find team by slug
    const [team] = await db
      .select()
      .from(teams)
      .where(eq(teams.slug, slug))
      .limit(1);

    if (!team) {
      return c.json({ error: "Team not found with this code" }, 404);
    }

    // Check if user is already a member
    const existingMember = await db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.userId, session.user.id))
      .limit(1);

    if (existingMember.length > 0) {
      return c.json({ error: "You are already in a team" }, 400);
    }

    // Add user to team
    await db.insert(teamMembers).values({
      teamId: team.id,
      userId: session.user.id,
    });

    return c.json({ success: true, teamName: team.name });
  } catch (error) {
    console.error("Error joining team:", error);
    return c.json(
      { error: "Internal server error" },
      500
    );
  }
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)