import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchUserProfile,
  fetchUserStats,
  fetchUserProvidedServices,
  fetchUserBookings,
  fetchUserPayments,
  updateUserProfile,
  type UserResponse,
  type UserUpdateData,
} from "@/services/user-service";
import { toast } from "sonner";

// Query keys for better caching and invalidation
export const mentorKeys = {
  all: ["mentor"] as const,
  profile: (userId: string) => ["mentor", "profile", userId] as const,
  stats: (userId: string) => ["mentor", "stats", userId] as const,
  services: (userId: string) => ["mentor", "services", userId] as const,
  bookings: (userId: string) => ["mentor", "bookings", userId] as const,
  payments: (userId: string) => ["mentor", "payments", userId] as const,
};

export function useMentorProfile(userId: string) {
  return useQuery({
    queryKey: mentorKeys.profile(userId),
    queryFn: () => fetchUserProfile(userId),
    enabled: !!userId,
  });
}

export function useMentorStats(userId: string) {
  return useQuery({
    queryKey: mentorKeys.stats(userId),
    queryFn: () => fetchUserStats(userId),
    enabled: !!userId,
  });
}

export function useMentorServices(userId: string) {
  return useQuery({
    queryKey: mentorKeys.services(userId),
    queryFn: () => fetchUserProvidedServices(userId),
    enabled: !!userId,
  });
}

export function useMentorBookings(userId: string) {
  return useQuery({
    queryKey: mentorKeys.bookings(userId),
    queryFn: () => fetchUserBookings(userId),
    enabled: !!userId,
  });
}

export function useMentorPayments(userId: string) {
  return useQuery({
    queryKey: mentorKeys.payments(userId),
    queryFn: () => fetchUserPayments(userId),
    enabled: !!userId,
  });
}

export function useUpdateMentorProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UserUpdateData }) =>
      updateUserProfile(userId, data),
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: mentorKeys.profile(variables.userId),
      });
      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update profile", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    },
  });
}

// Session related mutations
export function useStartSession() {
  return useMutation({
    mutationFn: async ({
      sessionTitle,
      meetingLink,
    }: {
      sessionTitle: string;
      meetingLink: string;
    }) => {
      const response = await fetch("/api/sessions/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionTitle, meetingLink }),
      });
      if (!response.ok) throw new Error("Failed to start session");
      return response.json();
    },
    onSuccess: () => {
      toast.success("Session started successfully");
    },
    onError: (error) => {
      toast.error("Failed to start session", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    },
  });
}

export function useEndSession() {
  return useMutation({
    mutationFn: async ({ meetingId }: { meetingId: string }) => {
      const response = await fetch("/api/sessions/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meetingId }),
      });
      if (!response.ok) throw new Error("Failed to end session");
      return response.json();
    },
    onSuccess: () => {
      toast.success("Session ended successfully");
    },
    onError: (error) => {
      toast.error("Failed to end session", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    },
  });
}

export function useUpdateMentorSettings() {
  return useMutation({
    mutationFn: async ({
      meetingLink,
      hourlyRate,
    }: {
      meetingLink: string;
      hourlyRate: string;
    }) => {
      const response = await fetch("/api/mentor/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meetingLink, hourlyRate }),
      });
      if (!response.ok) throw new Error("Failed to update settings");
      return response.json();
    },
    onSuccess: () => {
      toast.success("Settings updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update settings", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    },
  });
}
