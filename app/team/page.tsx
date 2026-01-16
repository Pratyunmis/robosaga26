"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useUserTeam,
  useCreateTeam,
  useJoinTeamRequest,
  useAcceptJoinRequest,
  useRejectJoinRequest,
  useRemoveMember,
  useLeaveTeam,
  useUserJoinRequests,
  useDeleteTeam,
} from "@/hooks/useTeams";
import {
  Users,
  Copy,
  UserCircle,
  Crown,
  UserMinus,
  Check,
  X,
  Clock,
  LogOut,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Spinner } from "@/components/ui/spinner";

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
  const {
    data: userTeam,
    isLoading: loadingTeam,
    refetch: refetchTeam,
  } = useUserTeam();
  const { data: userRequests } = useUserJoinRequests();
  const createTeamMutation = useCreateTeam();
  const joinRequestMutation = useJoinTeamRequest();
  const acceptRequestMutation = useAcceptJoinRequest();
  const rejectRequestMutation = useRejectJoinRequest();
  const removeMemberMutation = useRemoveMember();
  const leaveTeamMutation = useLeaveTeam();
  const deleteTeamMutation = useDeleteTeam();
  const [isDeleteTeamDialogOpen, setIsDeleteTeamDialogOpen] = useState(false);
  const [teamIdToDelete, setTeamIdToDelete] = useState<string | null>(null);

  const [isRemoveMemberDialogOpen, setIsRemoveMemberDialogOpen] =
    useState(false);
  const [memberToRemove, setMemberToRemove] = useState<{
    id: string;
    name: string;
  } | null>(null);

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
        toast.success("Team created successfully!");
      }
    } catch (error) {
      const errorMsg =
        (error as { response?: { data?: { error?: string } } }).response?.data
          ?.error || "Failed to create team";
      setMessage({ type: "error", text: errorMsg });
      toast.error(errorMsg);
    }
  };

  const handleJoinRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      const result = await joinRequestMutation.mutateAsync(teamCode);

      if (result.success) {
        setMessage({
          type: "success",
          text:
            result.message || `Request sent to join team: ${result.teamName}!`,
        });
        setTeamCode("");
        toast.success(result.message || "Join request sent!");
      }
    } catch (error) {
      const errorMsg =
        (error as { response?: { data?: { error?: string } } }).response?.data
          ?.error || "Failed to send join request";
      setMessage({ type: "error", text: errorMsg });
      toast.error(errorMsg);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await acceptRequestMutation.mutateAsync(requestId);
      toast.success("Member added to team!");
      refetchTeam();
    } catch (error) {
      const errorMsg =
        (error as { response?: { data?: { error?: string } } }).response?.data
          ?.error || "Failed to accept request";
      toast.error(errorMsg);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await rejectRequestMutation.mutateAsync(requestId);
      toast.success("Request rejected");
      refetchTeam();
    } catch (error) {
      const errorMsg =
        (error as { response?: { data?: { error?: string } } }).response?.data
          ?.error || "Failed to reject request";
      toast.error(errorMsg);
    }
  };

  const handleRemoveMemberClick = (memberId: string, memberName: string) => {
    setMemberToRemove({ id: memberId, name: memberName });
    setIsRemoveMemberDialogOpen(true);
  };

  const handleConfirmRemoveMember = async () => {
    if (!memberToRemove) return;

    try {
      await removeMemberMutation.mutateAsync(memberToRemove.id);
      toast.success("Member removed from team");
      setIsRemoveMemberDialogOpen(false);
      refetchTeam();
    } catch (error) {
      const errorMsg =
        (error as { response?: { data?: { error?: string } } }).response?.data
          ?.error || "Failed to remove member";
      toast.error(errorMsg);
    }
  };

  const handleLeaveTeam = async () => {
    if (!confirm("Are you sure you want to leave this team?")) {
      return;
    }

    try {
      await leaveTeamMutation.mutateAsync();
      toast.success("You have left the team");
      refetchTeam();
    } catch (error) {
      const errorMsg =
        (error as { response?: { data?: { error?: string } } }).response?.data
          ?.error || "Failed to leave team";
      toast.error(errorMsg);
    }
  };

  const handleDeleteTeamClick = (teamId: string) => {
    setTeamIdToDelete(teamId);
    setIsDeleteTeamDialogOpen(true);
  };

  const handleConfirmDeleteTeam = async () => {
    if (!teamIdToDelete) return;

    try {
      await deleteTeamMutation.mutateAsync(teamIdToDelete);
      toast.success("Team deleted successfully");
      setIsDeleteTeamDialogOpen(false);
      refetchTeam();
    } catch (error) {
      const errorMsg =
        (error as { response?: { data?: { error?: string } } }).response?.data
          ?.error || "Failed to delete team";
      toast.error(errorMsg);
    }
  };

  // ... inside render: replace confirm logic
  // And at the end, render Dialog

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Team code copied to clipboard!");
    setMessage({ type: "success", text: "Team code copied to clipboard!" });
  };

  const pendingRequests =
    userRequests?.filter((r) => r.status === "pending") || [];

  if (loadingTeam) {
    return (
      <div className="min-h-screen bg-linear-to-b from-black via-blue-950 to-black text-white antialiased">
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="relative flex items-center justify-center">
              <Spinner className="w-12 h-12 text-yellow-400" />
              <div className="absolute inset-0 rounded-full border-2 border-yellow-400/20 animate-ping" />
            </div>
            <p className="text-yellow-400 font-mono text-sm tracking-[0.3em] animate-pulse">
              LOADING TEAM DATA
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-black via-blue-950 to-black text-white antialiased">
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
            Create a team or request to join an existing one. Teams require 2-4
            members to participate in RoboSaga &apos;26
          </motion.p>
        </div>
      </section>

      {/* Pending Join Requests Section (if user has pending requests) */}
      {pendingRequests.length > 0 && !userTeam && (
        <section className="pb-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-linear-to-br from-gray-900 to-black border-2 border-yellow-400/50">
                <CardHeader>
                  <CardTitle className="text-xl text-yellow-400 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Pending Join Requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pendingRequests.map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-yellow-400/20"
                      >
                        <div>
                          <p className="font-semibold text-white">
                            {request.teamName}
                          </p>
                          <p className="text-sm text-gray-400">
                            Code: {request.teamSlug}
                          </p>
                        </div>
                        <span className="bg-yellow-400/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-bold">
                          Waiting for approval
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      )}

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
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <CardTitle className="text-2xl text-yellow-400 flex items-center gap-2">
                        <Users className="w-6 h-6" />
                        {userTeam.name}
                        {userTeam.isLeader && (
                          <Crown className="w-5 h-5 text-yellow-400" />
                        )}
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
                    <div className="text-right">
                      <p className="text-sm text-gray-400">
                        Members: {userTeam.members.length}/
                        {userTeam.maxTeamSize}
                      </p>
                      <p className="text-sm text-gray-400">
                        Min required: {userTeam.minTeamSize}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Team Members */}
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Team Members ({userTeam.members.length})
                  </h3>
                  <div className="space-y-3 mb-6">
                    {userTeam.members.map(
                      (
                        member: {
                          userId: string;
                          userName: string | null;
                          userEmail: string | null;
                          userImage: string | null;
                          role: string;
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
                            <div className="relative w-12 h-12 shrink-0 rounded-full overflow-hidden border-2 border-yellow-400">
                              <Image
                                src={member.userImage}
                                alt={member.userName || "User"}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 shrink-0 rounded-full bg-yellow-400/20 border-2 border-yellow-400 flex items-center justify-center">
                              <UserCircle className="w-8 h-8 text-yellow-400" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-white truncate">
                              {member.userName || "Anonymous"}
                            </p>
                            <p className="text-sm text-gray-400 truncate">
                              {member.userEmail}
                            </p>
                          </div>
                          {member.role === "leader" && (
                            <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold shrink-0">
                              Leader
                            </span>
                          )}
                          {userTeam.isLeader && member.role !== "leader" && (
                            <Button
                              type="button"
                              onClick={() =>
                                handleRemoveMemberClick(
                                  member.userId,
                                  member.userName || "this member"
                                )
                              }
                              variant="ghost"
                              className="text-red-400 hover:text-red-300 hover:bg-red-400/10 cursor-pointer shrink-0"
                              disabled={removeMemberMutation.isPending}
                            >
                              <UserMinus className="w-4 h-4" />
                            </Button>
                          )}
                        </motion.div>
                      )
                    )}
                  </div>

                  {/* Pending Join Requests (Leader Only) */}
                  {userTeam.isLeader &&
                    userTeam.pendingRequests &&
                    userTeam.pendingRequests.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-yellow-400/20">
                        <h3 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center gap-2">
                          <Clock className="w-5 h-5" />
                          Join Requests ({userTeam.pendingRequests.length})
                        </h3>
                        <div className="space-y-3">
                          {userTeam.pendingRequests.map(
                            (request: {
                              id: string;
                              userId: string;
                              userName: string | null;
                              userEmail: string | null;
                              userImage: string | null;
                            }) => (
                              <motion.div
                                key={request.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-4 p-3 bg-yellow-400/5 rounded-lg border border-yellow-400/30"
                              >
                                {request.userImage ? (
                                  <div className="relative w-10 h-10 shrink-0 rounded-full overflow-hidden border-2 border-yellow-400">
                                    <Image
                                      src={request.userImage}
                                      alt={request.userName || "User"}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-10 h-10 shrink-0 rounded-full bg-yellow-400/20 border-2 border-yellow-400 flex items-center justify-center">
                                    <UserCircle className="w-6 h-6 text-yellow-400" />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-white truncate">
                                    {request.userName || "Anonymous"}
                                  </p>
                                  <p className="text-sm text-gray-400 truncate">
                                    {request.userEmail}
                                  </p>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                  <Button
                                    type="button"
                                    onClick={() =>
                                      handleAcceptRequest(request.id)
                                    }
                                    variant="outline"
                                    className="border-green-500 text-green-500 hover:bg-green-500/10"
                                    disabled={
                                      acceptRequestMutation.isPending ||
                                      userTeam.members.length >=
                                        userTeam.maxTeamSize
                                    }
                                  >
                                    <Check className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    onClick={() =>
                                      handleRejectRequest(request.id)
                                    }
                                    variant="outline"
                                    className="border-red-500 text-red-500 hover:bg-red-500/10"
                                    disabled={rejectRequestMutation.isPending}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              </motion.div>
                            )
                          )}
                        </div>
                        {userTeam.members.length >= userTeam.maxTeamSize && (
                          <p className="mt-3 text-sm text-yellow-400">
                            ⚠️ Team is full. Cannot accept more members.
                          </p>
                        )}
                      </div>
                    )}

                  {/* Actions Section */}
                  <div className="mt-6 pt-6 border-t border-yellow-400/20">
                    {!userTeam.isLeader ? (
                      <Button
                        type="button"
                        onClick={handleLeaveTeam}
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-500/10"
                        disabled={leaveTeamMutation.isPending}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        {leaveTeamMutation.isPending
                          ? "Leaving..."
                          : "Leave Team"}
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-sm text-red-400 mb-2">
                          Danger Zone: Deleting the team will remove all
                          members.
                        </p>
                        <Button
                          type="button"
                          onClick={() => handleDeleteTeamClick(userTeam.id)}
                          variant="outline"
                          className="border-red-500 text-red-500 cursor-pointer hover:text-red-500 hover:bg-red-500/10"
                          disabled={deleteTeamMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          {deleteTeamMutation.isPending
                            ? "Deleting..."
                            : "Delete Team"}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      )}

      {/* Team Registration (if not in a team) */}
      {!loadingTeam && !userTeam && (
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
            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`mb-6 p-4 rounded-lg ${
                    message.type === "success"
                      ? "bg-green-500/20 border border-green-500 text-green-400"
                      : "bg-red-500/20 border border-red-500 text-red-400"
                  }`}
                >
                  {message.text}
                </motion.div>
              )}
            </AnimatePresence>

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
                      Start your team as the leader. Share the team code with
                      others to let them request to join.
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
                            🎉 Team Created! Share this code with your
                            teammates:
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
                          <p className="text-sm text-gray-400 mt-2">
                            ⚠️ You need at least {2} members to participate in
                            events.
                          </p>
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
                      Request to Join Team
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Enter the team code. The team leader will need to approve
                      your request.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleJoinRequest} className="space-y-6">
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
                          Ask your team leader for the unique team code. They
                          will need to approve your request.
                        </p>
                      </div>

                      <Button
                        type="submit"
                        variant="pacman"
                        className="w-full"
                        disabled={joinRequestMutation.isPending}
                      >
                        {joinRequestMutation.isPending
                          ? "Sending Request..."
                          : "Request to Join"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </section>
      )}

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
                  <p>
                    ✓ Teams of <strong>2-4 members</strong>
                  </p>
                  <p>✓ Must be logged in to create/join</p>
                  <p>✓ One team per participant</p>
                  <p>✓ Team name must be unique</p>
                  <p>✓ Leader approval required to join</p>
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
                  <p>✓ Share team code only with trusted members</p>
                  <p>✓ Leader can remove members if needed</p>
                  <p>✓ Contact support for issues</p>
                  <p>✓ Non-leaders can leave the team anytime</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />

      <Dialog
        open={isDeleteTeamDialogOpen}
        onOpenChange={setIsDeleteTeamDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px] bg-black/90 border-red-500/50 text-white">
          <DialogHeader>
            <DialogTitle className="text-red-500 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Delete Team
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete this team? This action cannot be
              undone and will remove all members permanently.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-3">
            <Button
              variant="ghost"
              onClick={() => setIsDeleteTeamDialogOpen(false)}
              className="text-gray-400 cursor-pointer hover:text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDeleteTeam}
              className="bg-red-500 cursor-pointer hover:bg-red-600 text-white"
              disabled={deleteTeamMutation.isPending}
            >
              {deleteTeamMutation.isPending ? "Deleting..." : "Delete Team"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={isRemoveMemberDialogOpen}
        onOpenChange={setIsRemoveMemberDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px] bg-black/90 border-yellow-400/50 text-white">
          <DialogHeader>
            <DialogTitle className="text-yellow-400 flex items-center gap-2">
              <UserMinus className="w-5 h-5" />
              Remove Member
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to remove{" "}
              <span className="text-white font-bold">
                {memberToRemove?.name}
              </span>{" "}
              from the team?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-3">
            <Button
              variant="ghost"
              onClick={() => setIsRemoveMemberDialogOpen(false)}
              className="text-gray-400 cursor-pointer hover:text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmRemoveMember}
              className="bg-red-500 cursor-pointer hover:bg-red-600 text-white"
              disabled={removeMemberMutation.isPending}
            >
              {removeMemberMutation.isPending ? "Removing..." : "Remove Member"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
