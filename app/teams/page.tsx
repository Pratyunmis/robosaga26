"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserTeam, useCreateTeam, useJoinTeam } from "@/hooks/useTeams";
import { Users, Copy, UserCircle } from "lucide-react";
import Image from "next/image";

export default function TeamsPage() {
  const [activeTab, setActiveTab] = useState<"create" | "join">("create");
  const [teamName, setTeamName] = useState("");
  const [teamCode, setTeamCode] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [generatedSlug, setGeneratedSlug] = useState<string | null>(null);

  // React Query hooks
  const { data: userTeam, isLoading: loadingTeam } = useUserTeam();
  const createTeamMutation = useCreateTeam();
  const joinTeamMutation = useJoinTeam();

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setGeneratedSlug(null);

    try {
      const result = await createTeamMutation.mutateAsync(teamName);

      if (result.success) {
        setMessage({ type: "success", text: "Team created successfully!" });
        setGeneratedSlug(result.slug);
        setTeamName("");
      }
    } catch (error) {
      setMessage({
        type: "error",
        text:
          (error as { response?: { data?: { error?: string } } }).response?.data
            ?.error || "Failed to create team",
      });
    }
  };

  const handleJoinTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      const result = await joinTeamMutation.mutateAsync(teamCode);

      if (result.success) {
        setMessage({
          type: "success",
          text: `Successfully joined team: ${result.teamName}!`,
        });
        setTeamCode("");
      }
    } catch (error) {
      setMessage({
        type: "error",
        text:
          (error as { response?: { data?: { error?: string } } }).response?.data
            ?.error || "Failed to join team",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setMessage({ type: "success", text: "Team code copied to clipboard!" });
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
            Team <span className="text-yellow-400">Registration</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Create a team or join an existing one to participate in RoboSaga
            &apos;26
          </motion.p>
        </div>
      </section>

      {/* Current Team Section */}
      {!loadingTeam && userTeam && (
        <section className="pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-linear-to-br from-gray-900 to-black border-2 border-yellow-400/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl text-yellow-400 flex items-center gap-2">
                        <Users className="w-6 h-6" />
                        {userTeam.name}
                      </CardTitle>
                      <CardDescription className="text-gray-400 mt-2">
                        Team Code:{" "}
                        <code className="text-yellow-400 bg-black/50 px-2 py-1 rounded">
                          {userTeam.slug}
                        </code>
                        <Button
                          type="button"
                          onClick={() => copyToClipboard(userTeam.slug)}
                          variant="ghost"
                          className="ml-2 text-yellow-400 hover:text-yellow-300 h-8 w-8 p-0"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Team Members ({userTeam.members.length})
                  </h3>
                  <div className="space-y-3">
                    {userTeam.members.map(
                      (
                        member: {
                          userId: string;
                          userName: string | null;
                          userEmail: string | null;
                          userImage: string | null;
                        },
                        index: number
                      ) => (
                        <motion.div
                          key={member.userId}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-4 p-3 bg-black/30 rounded-lg border border-yellow-400/20 hover:border-yellow-400/50 transition-colors"
                        >
                          {member.userImage ? (
                            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-yellow-400">
                              <Image
                                src={member.userImage}
                                alt={member.userName || "User"}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-yellow-400/20 border-2 border-yellow-400 flex items-center justify-center">
                              <UserCircle className="w-8 h-8 text-yellow-400" />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="font-semibold text-white">
                              {member.userName || "Anonymous"}
                            </p>
                            <p className="text-sm text-gray-400">
                              {member.userEmail}
                            </p>
                          </div>
                          {index === 0 && (
                            <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold">
                              Leader
                            </span>
                          )}
                        </motion.div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      )}

      {/* Team Registration */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-900 p-1 rounded-full inline-flex">
              <button
                onClick={() => setActiveTab("create")}
                className={`px-8 py-3 rounded-full font-bold transition-all ${
                  activeTab === "create"
                    ? "bg-yellow-400 text-black"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Create Team
              </button>
              <button
                onClick={() => setActiveTab("join")}
                className={`px-8 py-3 rounded-full font-bold transition-all ${
                  activeTab === "join"
                    ? "bg-yellow-400 text-black"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Join Team
              </button>
            </div>
          </div>

          {/* Message Display */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-lg ${
                message.type === "success"
                  ? "bg-green-500/20 border border-green-500 text-green-400"
                  : "bg-red-500/20 border border-red-500 text-red-400"
              }`}
            >
              {message.text}
            </motion.div>
          )}

          {/* Create Team Form */}
          {activeTab === "create" && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="bg-linear-to-br from-gray-900 to-black border-2 border-yellow-400/50">
                <CardHeader>
                  <CardTitle className="text-2xl text-yellow-400">
                    Create New Team
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Start your team and invite others using the generated team
                    code
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateTeam} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Team Name
                      </label>
                      <Input
                        type="text"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        placeholder="Enter your team name"
                        required
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="pacman"
                      className="w-full"
                      disabled={createTeamMutation.isPending}
                    >
                      {createTeamMutation.isPending
                        ? "Creating..."
                        : "Create Team"}
                    </Button>

                    {generatedSlug && (
                      <div className="bg-green-500/10 border border-green-500/50 p-4 rounded-lg">
                        <p className="text-green-400 font-semibold mb-2">
                          🎉 Team Created! Share this code with your teammates:
                        </p>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 bg-black/50 px-4 py-2 rounded text-yellow-400 font-mono">
                            {generatedSlug}
                          </code>
                          <Button
                            type="button"
                            onClick={() => copyToClipboard(generatedSlug)}
                            variant="outline"
                            className="border-yellow-400 text-yellow-400"
                          >
                            Copy
                          </Button>
                        </div>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Join Team Form */}
          {activeTab === "join" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="bg-linear-to-br from-gray-900 to-black border-2 border-yellow-400/50">
                <CardHeader>
                  <CardTitle className="text-2xl text-yellow-400">
                    Join Existing Team
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Enter the team code shared by your team leader
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleJoinTeam} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Team Code
                      </label>
                      <Input
                        type="text"
                        value={teamCode}
                        onChange={(e) => setTeamCode(e.target.value)}
                        placeholder="Enter team code (e.g., team-name-abc123)"
                        required
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        Ask your team leader for the unique team code
                      </p>
                    </div>

                    <Button
                      type="submit"
                      variant="pacman"
                      className="w-full"
                      disabled={joinTeamMutation.isPending}
                    >
                      {joinTeamMutation.isPending ? "Joining..." : "Join Team"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </section>

      {/* Guidelines Section */}
      <section className="py-20 bg-black/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-12"
          >
            Team <span className="text-yellow-400">Guidelines</span>
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="bg-linear-to-br from-gray-900 to-black border-2 border-yellow-400/50 h-full">
                <CardHeader>
                  <CardTitle className="text-xl text-yellow-400">
                    📋 Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-gray-300">
                  <p>✓ Teams of 2-4 members</p>
                  <p>✓ Must be logged in to create/join</p>
                  <p>✓ One team per participant</p>
                  <p>✓ Team name must be unique</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-linear-to-br from-gray-900 to-black border-2 border-yellow-400/50 h-full">
                <CardHeader>
                  <CardTitle className="text-xl text-yellow-400">
                    💡 Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-gray-300">
                  <p>✓ Choose a memorable team name</p>
                  <p>✓ Share team code securely</p>
                  <p>✓ Verify members before events</p>
                  <p>✓ Contact support for issues</p>
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
