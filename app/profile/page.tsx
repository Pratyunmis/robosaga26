"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUserTeamProfile } from "@/hooks/useTeams";
import {
  Mail,
  Calendar,
  LogOut,
  User,
  Trophy,
  Users,
  Phone,
  GraduationCap,
  Hash,
} from "lucide-react";
import Image from "next/image";
import PacmanLoader from "@/components/PacmanLoader";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const { data: teamData, isLoading: loadingTeam } = useUserTeamProfile();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-linear-to-b from-black via-blue-950 to-black text-white flex items-center justify-center">
        <PacmanLoader />
      </div>
    );
  }

  if (!session) {
    return null;
  }

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

        <div className="max-w-7xl mx-auto px-4 sm font-medium:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              My <span className="text-yellow-400">Profile</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Manage your account and view your RoboSaga &apos;26 activity
            </p>
          </motion.div>

          {/* Profile Card */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* User Info Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="md:col-span-1"
            >
              <Card className="bg-black/40 backdrop-blur-md border border-yellow-400/30 overflow-hidden relative group">
                <div className="absolute inset-0 bg-yellow-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="text-center pb-2 relative z-10">
                  <div className="mx-auto mb-6 relative inline-block">
                    <motion.div
                      className="absolute -inset-1 bg-linear-to-r from-yellow-400 to-yellow-600 rounded-full blur opacity-75"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    {session.user?.image ? (
                      <div className="relative w-32 h-32 mx-auto">
                        <Image
                          height={128}
                          width={128}
                          aria-label={`${session.user.name} Profile Picture`}
                          src={session.user.image}
                          alt={session.user.name || "User"}
                          className="rounded-full border-2 border-black relative z-10 object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-32 h-32 mx-auto bg-yellow-400 rounded-full flex items-center justify-center border-4 border-yellow-400">
                        <User className="w-16 h-16 text-black" />
                      </div>
                    )}
                  </div>
                  <CardTitle className="text-2xl text-yellow-400">
                    {session.user?.name || "Anonymous User"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3 text-gray-300">
                    <Mail className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm font-medium break-all">
                      {session.user?.email || "No email"}
                    </span>
                  </div>
                  {session.user?.rollNo && (
                    <div className="flex items-center space-x-3 text-gray-300">
                      <Hash className="w-5 h-5 text-yellow-400" />
                      <span className="text-sm font-medium">
                        Roll No: {session.user.rollNo}
                      </span>
                    </div>
                  )}
                  {session.user?.branch && (
                    <div className="flex items-center space-x-3 text-gray-300">
                      <GraduationCap className="w-5 h-5 text-yellow-400" />
                      <span className="text-sm font-medium">
                        {session.user.branch}
                      </span>
                    </div>
                  )}
                  {session.user?.phoneNo && (
                    <div className="flex items-center space-x-3 text-gray-300">
                      <Phone className="w-5 h-5 text-yellow-400" />
                      <span className="text-sm font-medium">
                        +91 {session.user.phoneNo}
                      </span>
                    </div>
                  )}
                  {session.user?.role && (
                    <div className="flex items-center space-x-3 text-gray-300">
                      <User className="w-5 h-5 text-yellow-400" />
                      <span className="text-sm font-medium capitalize">
                        Role: {session.user.role}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center space-x-3 text-gray-300">
                    <Calendar className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm font-medium">
                      Joined{" "}
                      {session.user.joinedAt
                        ? new Date(session.user.joinedAt).toLocaleDateString()
                        : "Unknown"}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-8 border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500 transition-all duration-300"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Activity Cards */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="md:col-span-2 space-y-6"
            >
              {/* Team Info */}
              <Card className="bg-black/40 backdrop-blur-md border border-yellow-400/30">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-2xl text-yellow-400">
                    <Users className="w-6 h-6" />
                    <span>Team Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-yellow-400/5 rounded-xl p-6 border border-yellow-400/10">
                    {loadingTeam ? (
                      <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                      </div>
                    ) : teamData ? (
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-400">Team Name</p>
                          <p className="text-xl font-bold text-yellow-400">
                            {teamData.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Your Role</p>
                          <p className="text-lg capitalize text-white">
                            {teamData.userRole}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-2">Members</p>
                          <div className="flex flex-wrap gap-2">
                            {teamData.members.map((m) => (
                              <div
                                key={m.userId}
                                title={m.userName || "Member"}
                                className="relative"
                              >
                                {m.userImage ? (
                                  <Image
                                    src={m.userImage}
                                    alt={m.userName || "Member"}
                                    width={30}
                                    height={30}
                                    className="rounded-full border border-yellow-400"
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-gray-700 border border-yellow-400 flex items-center justify-center text-xs">
                                    {m.userName?.charAt(0)}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                        <Button
                          className="w-full cursor-pointer bg-yellow-400 text-black hover:bg-yellow-500 font-bold"
                          onClick={() => router.push(`/team`)}
                        >
                          View Team Details
                        </Button>
                      </div>
                    ) : (
                      <>
                        <p className="text-gray-300 mb-6 text-lg">
                          You haven&apos;t joined a team yet. Create or join a
                          team to participate in events!
                        </p>
                        <Button
                          className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold px-8"
                          onClick={() => router.push("/team")}
                        >
                          Go to Teams
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Activity Stats */}
              <Card className="bg-black/40 backdrop-blur-md border border-yellow-400/30">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-2xl text-yellow-400">
                    <Trophy className="w-6 h-6" />
                    <span>Activity & Stats</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-black/60 p-6 rounded-2xl border border-yellow-400/20 shadow-lg shadow-yellow-400/5"
                    >
                      <div className="text-4xl font-bold text-yellow-400 mb-2">
                        {teamData?.eventsJoined || 0}
                      </div>
                      <div className="text-sm font-medium text-gray-400">
                        Events Joined
                      </div>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-black/60 p-6 rounded-2xl border border-yellow-400/20 shadow-lg shadow-yellow-400/5"
                    >
                      <div className="text-4xl font-bold text-yellow-400 mb-2">
                        {teamData?.score || 0}
                      </div>
                      <div className="text-sm font-medium text-gray-400">
                        Points Earned
                      </div>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-black/60 p-6 rounded-2xl border border-yellow-400/20 shadow-lg shadow-yellow-400/5"
                    >
                      <div className="text-4xl font-bold text-yellow-400 mb-2">
                        {teamData?.rank ? `#${teamData.rank}` : "-"}
                      </div>
                      <div className="text-sm font-medium text-gray-400">
                        Rank
                      </div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-black/40 backdrop-blur-md border border-yellow-400/30">
                <CardHeader>
                  <CardTitle className="text-2xl text-yellow-400">
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-auto py-4 border-yellow-400/30 text-black cursor-pointer hover:bg-yellow-400 hover:text-black transition-all duration-300 text-lg group"
                    onClick={() => router.push("/events")}
                  >
                    <Calendar className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    Browse Events
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-4 border-yellow-400/30 text-black cursor-pointer hover:bg-yellow-400 hover:text-black transition-all duration-300 text-lg group"
                    onClick={() => router.push("/leaderboard")}
                  >
                    <Trophy className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    View Leaderboard
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-4 border-yellow-400/30 text-black cursor-pointer hover:bg-yellow-400 hover:text-black transition-all duration-300 text-lg group"
                    onClick={() => router.push("/hackaway")}
                  >
                    <Hash className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    HackAway Details
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-4 border-yellow-400/30 text-black cursor-pointer hover:bg-yellow-400 hover:text-black transition-all duration-300 text-lg group"
                    onClick={() => router.push("/contact")}
                  >
                    <Phone className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    Contact Us
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
