import { db } from "@/db";
import { teams, teamMembers, users, joinRequests, events, eventRegistrations } from "@/db/schema";
import { count, desc, sql, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

export async function getAdminStats() {
  'use cache'
  cacheLife('hours') // 1 hour

  const [usersCount] = await db.select({ count: count() }).from(users);
  const [teamsCount] = await db.select({ count: count() }).from(teams);
  const [membersCount] = await db.select({ count: count() }).from(teamMembers);
  const [pendingRequestsCount] = await db
    .select({ count: count() })
    .from(joinRequests)
    .where(sql`${joinRequests.status} = 'pending'`);
  const [eventsCount] = await db.select({ count: count() }).from(events);
  const [registrationsCount] = await db.select({ count: count() }).from(eventRegistrations);

  // Recent users (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [recentUsersCount] = await db
    .select({ count: count() })
    .from(users)
    .where(sql`${users.createdAt} >= ${sevenDaysAgo}`);

  // Recent teams (last 7 days)
  const [recentTeamsCount] = await db
    .select({ count: count() })
    .from(teams)
    .where(sql`${teams.createdAt} >= ${sevenDaysAgo}`);

  return {
    totalUsers: usersCount.count,
    totalTeams: teamsCount.count,
    totalMembers: membersCount.count,
    pendingRequests: pendingRequestsCount.count,
    recentUsers: recentUsersCount.count,
    recentTeams: recentTeamsCount.count,
    totalEvents: eventsCount.count,
    totalRegistrations: registrationsCount.count,
  };
}

export async function getAllUsers() {
  "use cache"

  cacheLife('minutes')
  cacheTag("users")
  const allUsers = await db
    .select()
    .from(users)
    .orderBy(desc(users.createdAt));

  return allUsers;
}

export async function getAllTeams() {
  "use cache"

  cacheLife('minutes')
  cacheTag("teams")
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
        .innerJoin(users, sql`${teamMembers.userId} = ${users.id}`)
        .where(sql`${teamMembers.teamId} = ${team.id}`);

      return {
        ...team,
        members,
      };
    })
  );

  return teamsWithMembers;
}

// Get all events from database
export async function getAllEvents() {
  'use cache'
  cacheLife('hours') // 1 hour

  const allEvents = await db
    .select()
    .from(events)
    .orderBy(desc(events.createdAt));

  return allEvents;
}


// Get all registrations with event and team details
export async function getAllRegistrations() {
  "use cache"

  cacheLife('minutes')
  cacheTag("registrations")
  const registrations = await db
    .select({
      id: eventRegistrations.id,
      eventId: eventRegistrations.eventId,
      teamId: eventRegistrations.teamId,
      score: eventRegistrations.score,
      rank: eventRegistrations.rank,
      registeredAt: eventRegistrations.registeredAt,
      eventName: events.name,
      eventCategory: events.category,
      eventSlug: events.slug,
      teamName: teams.name,
      teamSlug: teams.slug,
    })
    .from(eventRegistrations)
    .innerJoin(events, eq(eventRegistrations.eventId, events.id))
    .innerJoin(teams, eq(eventRegistrations.teamId, teams.id))
    .orderBy(desc(eventRegistrations.registeredAt));

  return registrations;
}

// Get registrations for a specific event
export async function getEventRegistrations(eventId: string) {
  "use cache"

  cacheLife('minutes')
  cacheTag("registrations")
  const registrations = await db
    .select({
      id: eventRegistrations.id,
      teamId: eventRegistrations.teamId,
      score: eventRegistrations.score,
      rank: eventRegistrations.rank,
      registeredAt: eventRegistrations.registeredAt,
      teamName: teams.name,
      teamSlug: teams.slug,
      teamScore: teams.score,
    })
    .from(eventRegistrations)
    .innerJoin(teams, eq(eventRegistrations.teamId, teams.id))
    .where(eq(eventRegistrations.eventId, eventId))
    .orderBy(desc(eventRegistrations.registeredAt));

  return registrations;
}

export async function getEventDetails(eventId: string) {
  const event = await db.query.events.findFirst({
    where: eq(events.id, eventId),
  });

  if (!event) return null;

  const registrations = await db
    .select({
      id: eventRegistrations.id,
      registered_at: eventRegistrations.registeredAt,
      teams: {
        id: teams.id,
        name: teams.name,
        slug: teams.slug,
        team_leader_id: teams.leaderId,
      },
      event_results: {
         rank: eventRegistrations.rank,
         marks: eventRegistrations.score,
         declared_at: eventRegistrations.registeredAt, // Placeholder as we don't have separate declared_at
      }
    })
    .from(eventRegistrations)
    .innerJoin(teams, eq(eventRegistrations.teamId, teams.id))
    .where(eq(eventRegistrations.eventId, eventId))
    .orderBy(desc(eventRegistrations.registeredAt));

  // Transform to match expected format
  const formattedRegistrations = registrations.map(reg => ({
    id: reg.id,
    registered_at: reg.registered_at?.toISOString() || new Date().toISOString(),
    teams: reg.teams,
    event_results: [{
      rank: reg.event_results.rank || 0,
      marks: reg.event_results.marks || 0,
      declared_at: reg.event_results.declared_at?.toISOString() || new Date().toISOString(),
    }]
  }));

  return {
    event: {
      ...event,
      max_score: event.maxScore,
    },
    registrations: formattedRegistrations,
  };
}

export async function updateTeamScore(teamId: string, score: number) {
  const [updatedTeam] = await db
    .update(teams)
    .set({ score })
    .where(eq(teams.id, teamId))
    .returning();

  return updatedTeam;
}

export async function getAnalyticsData() {
  'use cache'
  cacheLife('hours') // 1 hour

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Get all users
  const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));
  
  // Get all teams
  const allTeams = await db.select().from(teams).orderBy(desc(teams.createdAt));

  // Calculate stats
  const totalUsers = allUsers.length;
  const recentUsers = allUsers.filter(u => u.createdAt && u.createdAt >= sevenDaysAgo).length;
  const monthlyUsers = allUsers.filter(u => u.createdAt && u.createdAt >= thirtyDaysAgo).length;
  
  const totalTeams = allTeams.length;
  const recentTeams = allTeams.filter(t => t.createdAt && t.createdAt >= sevenDaysAgo).length;

  // User growth data (last 30 days)
  const userGrowthMap = new Map<string, number>();
  allUsers
    .filter(u => u.createdAt && u.createdAt >= thirtyDaysAgo)
    .forEach(user => {
      const date = user.createdAt!.toISOString().split("T")[0];
      userGrowthMap.set(date, (userGrowthMap.get(date) || 0) + 1);
    });

  const userGrowthData = Array.from(userGrowthMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Branch distribution
  const branchMap = new Map<string, number>();
  allUsers.forEach(user => {
    if (user.branch) {
      branchMap.set(user.branch, (branchMap.get(user.branch) || 0) + 1);
    }
  });

  const branchDistribution = Array.from(branchMap.entries())
    .map(([branch, count]) => ({ branch, count }))
    .sort((a, b) => b.count - a.count);

  // Hourly activity (last 7 days)
  const hourMap = new Map<number, number>();
  allUsers
    .filter(u => u.createdAt && u.createdAt >= sevenDaysAgo)
    .forEach(user => {
      const hour = user.createdAt!.getHours();
      hourMap.set(hour, (hourMap.get(hour) || 0) + 1);
    });

  const hourlyActivity = Array.from(hourMap.entries())
    .map(([hour, count]) => ({ hour, count }))
    .sort((a, b) => a.hour - b.hour);

  return {
    userGrowthData,
    branchDistribution,
    hourlyActivity,
    stats: {
      totalUsers,
      recentUsers,
      monthlyUsers,
      totalTeams,
      recentTeams,
    },
  };
}
