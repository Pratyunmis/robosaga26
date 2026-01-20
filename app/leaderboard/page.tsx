"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Medal, Loader2 } from "lucide-react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { useEffect, useRef, useCallback } from "react";

interface Team {
  rank: number;
  id: string;
  teamName: string;
  slug: string;
  points: number;
  members: number;
  createdAt: Date;
}

interface LeaderboardResponse {
  teams: Team[];
  pagination: {
    page: number;
    limit: number;
    totalTeams: number;
    totalPages: number;
    hasMore: boolean;
  };
  stats: {
    totalTeams: number;
    totalParticipants: number;
    highestScore: number;
  };
}

interface StatsResponse {
  teams: Team[];
  totalTeams: number;
  totalParticipants: number;
  highestScore: number;
}

const ITEMS_PER_PAGE = 10;

export default function LeaderboardPage() {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Fetch paginated leaderboard data with infinite scroll
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["leaderboard"],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await axios.get<LeaderboardResponse>(
        `/leaderboard?page=${pageParam}&limit=${ITEMS_PER_PAGE}`,
      );
      return data;
    },
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasMore ? lastPage.pagination.page + 1 : undefined,
    initialPageParam: 1,
    staleTime: 30000, // 30 seconds cache on client
    refetchInterval: 60000, // Refetch every 60 seconds for live updates
  });

  
  const { data: statsData } = useQuery({
    queryKey: ["leaderboard-stats"],
    queryFn: async () => {
      const { data } = await axios.get<StatsResponse>("/leaderboard?all=true");
      return data;
    },
    staleTime: 30000,
    refetchInterval: 60000,
  });

  // Flatten paginated data
  const allTeams = data?.pages.flatMap((page) => page.teams) || [];
  const topThree = allTeams.slice(0, 3);
  const stats = statsData || data?.pages[0]?.stats;

  // Intersection Observer for infinite scroll
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "100px",
      threshold: 0.1,
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-black via-blue-950 to-black text-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400 mb-4"></div>
            <p className="text-xl text-gray-300">Loading leaderboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-b from-black via-blue-950 to-black text-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-xl text-red-400 mb-4">
              Failed to load leaderboard
            </p>
            <p className="text-gray-400">Please try again later</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // No data state
  if (allTeams.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-b from-black via-blue-950 to-black text-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Trophy className="w-16 h-16 mx-auto text-yellow-400 mb-4" />
            <p className="text-xl text-gray-300">No teams registered yet</p>
            <p className="text-gray-400 mt-2">Be the first to join!</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const getMedalColor = (rank: number) => {
    if (rank === 1) return "from-yellow-400 to-yellow-600";
    if (rank === 2) return "from-gray-300 to-gray-500";
    if (rank === 3) return "from-orange-400 to-orange-600";
    return "from-gray-700 to-gray-900";
  };

  const getMedalIcon = (rank: number) => {
    if (rank === 1)
      return <Trophy className="w-16 h-16 mx-auto text-yellow-600" />;
    if (rank === 2)
      return <Medal className="w-16 h-16 mx-auto text-gray-500" />;
    if (rank === 3)
      return <Medal className="w-16 h-16 mx-auto text-orange-500" />;
    return null;
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-black via-blue-950 to-black text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-20 left-20 w-4 h-4 bg-yellow-400 rounded-full"
            animate={{ y: [0, -20, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-40 right-20 w-3 h-3 bg-yellow-400 rounded-full"
            animate={{ y: [0, -15, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            <span className="text-yellow-400">Leaderboard</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Live rankings of all participating teams in RoboSaga &apos;26
          </motion.p>
        </div>
      </section>

      {/* Top 3 Podium */}
      {topThree.length >= 3 && (
        <section className="pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {/* 2nd Place */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="md:order-1 order-2"
              >
                <Card
                  className={`bg-linear-to-br ${getMedalColor(
                    2,
                  )} border-2 border-gray-300 text-center pt-8`}
                >
                  <div className="mb-4">{getMedalIcon(2)}</div>
                  <div className="text-xl font-bold text-black mb-2">
                    2nd Place
                  </div>
                  <CardContent>
                    <div className="text-2xl font-bold text-black mb-2">
                      {topThree[1].teamName}
                    </div>
                    <div className="text-4xl font-bold text-black mb-2">
                      {topThree[1].points}
                    </div>
                    <div className="text-sm text-black/70">points</div>
                    <div className="mt-4 text-sm text-black/70">
                      {topThree[1].members} members
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* 1st Place */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="md:order-2 order-1"
              >
                <Card
                  className={`bg-linear-to-br ${getMedalColor(
                    1,
                  )} border-2 border-yellow-400 text-center pt-8 transform md:scale-110`}
                >
                  <div className="mb-4">{getMedalIcon(1)}</div>
                  <div className="text-2xl font-bold text-black mb-2 flex items-center justify-center gap-2">
                    <Trophy className="w-6 h-6" /> CHAMPION{" "}
                    <Trophy className="w-6 h-6" />
                  </div>
                  <CardContent>
                    <div className="text-3xl font-bold text-black mb-2">
                      {topThree[0].teamName}
                    </div>
                    <div className="text-5xl font-bold text-black mb-2">
                      {topThree[0].points}
                    </div>
                    <div className="text-lg text-black/70">points</div>
                    <div className="mt-4 text-sm text-black/70">
                      {topThree[0].members} members
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* 3rd Place */}
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="md:order-3 order-3"
              >
                <Card
                  className={`bg-linear-to-br ${getMedalColor(
                    3,
                  )} border-2 border-orange-400 text-center pt-8`}
                >
                  <div className="mb-4">{getMedalIcon(3)}</div>
                  <div className="text-xl font-bold text-black mb-2">
                    3rd Place
                  </div>
                  <CardContent>
                    <div className="text-2xl font-bold text-black mb-2">
                      {topThree[2].teamName}
                    </div>
                    <div className="text-4xl font-bold text-black mb-2">
                      {topThree[2].points}
                    </div>
                    <div className="text-sm text-black/70">points</div>
                    <div className="mt-4 text-sm text-black/70">
                      {topThree[2].members} members
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Full Leaderboard Table */}
      <section className="pb-20 bg-black/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-8"
          >
            Full <span className="text-yellow-400">Rankings</span>
          </motion.h2>

          <div className="bg-linear-to-br from-gray-900 to-black border-2 border-yellow-400/50 rounded-lg overflow-hidden overflow-x-auto">
            <div className="min-w-[600px]">
              {/* Table Header */}
              <div className="bg-yellow-400 text-black font-bold grid grid-cols-12 gap-4 p-4">
                <div className="col-span-1 text-center">Rank</div>
                <div className="col-span-5">Team Name</div>
                <div className="col-span-2 text-center">Points</div>
                <div className="col-span-2 text-center">Members</div>
                <div className="col-span-2 text-center">Team Code</div>
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-gray-800">
                {allTeams.map((team) => (
                  <div
                    key={team.id}
                    className="grid grid-cols-12 gap-4 p-4 hover:bg-yellow-400/10 transition-colors"
                  >
                    <div className="col-span-1 text-center font-bold text-yellow-400 flex items-center justify-center gap-1">
                      {team.rank <= 3 &&
                        (team.rank === 1 ? (
                          <Trophy className="w-5 h-5" />
                        ) : (
                          <Medal className="w-5 h-5" />
                        ))}
                      <span>{team.rank}</span>
                    </div>
                    <div className="col-span-5 font-semibold">
                      {team.teamName}
                    </div>
                    <div className="col-span-2 text-center font-bold text-yellow-400">
                      {team.points}
                    </div>
                    <div className="col-span-2 text-center text-gray-400">
                      {team.members}
                    </div>
                    <div className="col-span-2 text-center text-gray-400 text-sm">
                      {team.slug}
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Trigger & Indicator */}
              <div ref={loadMoreRef} className="py-4 text-center">
                {isFetchingNextPage && (
                  <div className="flex items-center justify-center gap-2 text-gray-400">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Loading more teams...</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Note */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-gray-500 text-sm mt-8"
          >
            * Leaderboard is updated in real-time during the event
          </motion.p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl font-bold text-yellow-400 mb-2">
                {stats?.totalTeams || allTeams.length}
              </div>
              <div className="text-gray-400">Total Teams</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl font-bold text-yellow-400 mb-2">
                {stats?.totalParticipants || 0}
              </div>
              <div className="text-gray-400">Participants</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl font-bold text-yellow-400 mb-2">
                {stats?.highestScore || 0}
              </div>
              <div className="text-gray-400">Highest Score</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl font-bold text-yellow-400 mb-2">6</div>
              <div className="text-gray-400">Active Events</div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
