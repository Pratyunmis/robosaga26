"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
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
              <Card className="bg-linear-to-br from-gray-900 to-black border-2 border-yellow-400/50">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4">
                    {session.user?.image ? (
                      <div className="relative w-32 h-32 mx-auto">
                        <Image
                          height={200}
                          width={200}
                          aria-label={`${session.user.name} Profile Picture`}
                          src={session.user.image}
                          alt={session.user.name || "User"}
                          className="rounded-full border-4 border-yellow-400 object-cover"
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
                      <span className="text-sm font-medium">{session.user.branch}</span>
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
                      Joined {session.user.joinedAt ? new Date(session.user.joinedAt).toLocaleDateString() : "Unknown"}
                    </span>
                  </div>
                  <Button
                    variant="pacman"
                    className="w-full mt-6 bg-red-500 hover:bg-red-600 flex items-center justify-center space-x-2"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
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
              <Card className="bg-linear-to-br from-gray-900 to-black border-2 border-yellow-400/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-yellow-400">
                    <Users className="w-6 h-6" />
                    <span>Team Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-4">
                    You haven&apos;t joined a team yet. Create or join a team to
                    participate in events!
                  </p>
                  <Button
                    variant="pacman"
                    onClick={() => router.push("/teams")}
                  >
                    Go to Teams
                  </Button>
                </CardContent>
              </Card>

              {/* Activity Stats */}
              <Card className="bg-linear-to-br from-gray-900 to-black border-2 border-yellow-400/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-yellow-400">
                    <Trophy className="w-6 h-6" />
                    <span>Activity & Stats</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-black/50 p-4 rounded-lg border border-yellow-400/30">
                      <div className="text-3xl font-bold text-yellow-400">
                        0
                      </div>
                      <div className="text-sm font-medium text-gray-400 mt-1">
                        Events Joined
                      </div>
                    </div>
                    <div className="bg-black/50 p-4 rounded-lg border border-yellow-400/30">
                      <div className="text-3xl font-bold text-yellow-400">
                        0
                      </div>
                      <div className="text-sm font-medium text-gray-400 mt-1">
                        Points Earned
                      </div>
                    </div>
                    <div className="bg-black/50 p-4 rounded-lg border border-yellow-400/30">
                      <div className="text-3xl font-bold text-yellow-400">
                        -
                      </div>
                      <div className="text-sm font-medium text-gray-400 mt-1">Rank</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-linear-to-br from-gray-900 to-black border-2 border-yellow-400/50">
                <CardHeader>
                  <CardTitle className="text-yellow-400">
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="border-yellow-400/50 hover:border-yellow-400 hover:bg-yellow-400/10"
                    onClick={() => router.push("/events")}
                  >
                    Browse Events
                  </Button>
                  <Button
                    variant="outline"
                    className="border-yellow-400/50 hover:border-yellow-400 hover:bg-yellow-400/10"
                    onClick={() => router.push("/leaderboard")}
                  >
                    View Leaderboard
                  </Button>
                  <Button
                    variant="outline"
                    className="border-yellow-400/50 hover:border-yellow-400 hover:bg-yellow-400/10"
                    onClick={() => router.push("/hackaway")}
                  >
                    HackAway Details
                  </Button>
                  <Button
                    variant="outline"
                    className="border-yellow-400/50 hover:border-yellow-400 hover:bg-yellow-400/10"
                    onClick={() => router.push("/contact")}
                  >
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
