import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";

interface TeamMember {
  userId: string;
  userName: string | null;
  userEmail: string | null;
  userImage: string | null;
  role: "leader" | "member";
  joinedAt: Date;
}

interface JoinRequest {
  id: string;
  userId: string;
  userName: string | null;
  userEmail: string | null;
  userImage: string | null;
  createdAt: Date;
}

interface Team {
  id: string;
  name: string;
  slug: string;
  leaderId: string;
  score: number;
  createdAt: Date;
  members: TeamMember[];
  pendingRequests: JoinRequest[];
  isLeader: boolean;
  minTeamSize: number;
  maxTeamSize: number;
}

interface UserJoinRequest {
  id: string;
  teamId: string;
  teamName: string;
  teamSlug: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
}

// Fetch user's team
export const useUserTeam = () => {
  return useQuery({
    queryKey: ["userTeam"],
    queryFn: async () => {
      const { data } = await axios.get("/teams/user/me");
      return data.team as Team | null;
    },
  });
};

// Fetch user's join requests
export const useUserJoinRequests = () => {
  return useQuery({
    queryKey: ["userJoinRequests"],
    queryFn: async () => {
      const { data } = await axios.get("/teams/user/requests");
      return data.requests as UserJoinRequest[];
    },
  });
};

// Create team mutation
export const useCreateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (teamName: string) => {
      const { data } = await axios.post("/teams/create", { teamName });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userTeam"] });
    },
  });
};

// Request to join team mutation
export const useJoinTeamRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (slug: string) => {
      const { data } = await axios.post("/teams/join/request", { slug });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userTeam"] });
      queryClient.invalidateQueries({ queryKey: ["userJoinRequests"] });
    },
  });
};

// Accept join request mutation (leader only)
export const useAcceptJoinRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: string) => {
      const { data } = await axios.post("/teams/requests/accept", { requestId });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userTeam"] });
    },
  });
};

// Reject join request mutation (leader only)
export const useRejectJoinRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: string) => {
      const { data } = await axios.post("/teams/requests/reject", { requestId });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userTeam"] });
    },
  });
};

// Remove member mutation (leader only)
export const useRemoveMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (memberId: string) => {
      const { data } = await axios.post("/teams/members/remove", { memberId });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userTeam"] });
    },
  });
};

// Leave team mutation
export const useLeaveTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await axios.post("/teams/leave");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userTeam"] });
    },
  });
};

// Legacy hook for backward compatibility
export const useJoinTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (slug: string) => {
      const { data } = await axios.post("/teams/join/request", { slug });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userTeam"] });
      queryClient.invalidateQueries({ queryKey: ["userJoinRequests"] });
    },
  });
};
