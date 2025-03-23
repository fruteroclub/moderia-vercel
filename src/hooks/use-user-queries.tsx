import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchUserByWallet,
  fetchUserProvidedServices,
  fetchUserBookings,
  fetchUserPayments,
  fetchUserStats,
  type UserResponse,
  type UserUpdateData,
} from "@/services/user-service";
import { toast } from "sonner";

// Query keys
export const userKeys = {
  all: ["users"] as const,
  wallet: (address: string) => ["users", "wallet", address] as const,
  services: (userId: string) => ["users", userId, "services"] as const,
  bookings: (userId: string) => ["users", userId, "bookings"] as const,
  payments: (userId: string) => ["users", userId, "payments"] as const,
  stats: (userId: string) => ["users", userId, "stats"] as const,
};

export function useUserByWallet(walletAddress: string) {
  return useQuery({
    queryKey: userKeys.wallet(walletAddress),
    queryFn: () => fetchUserByWallet(walletAddress),
    enabled: !!walletAddress,
  });
}

export function useUserServices(userId: string) {
  return useQuery({
    queryKey: userKeys.services(userId),
    queryFn: () => fetchUserProvidedServices(userId),
    enabled: !!userId,
  });
}

export function useUserBookings(userId: string) {
  return useQuery({
    queryKey: userKeys.bookings(userId),
    queryFn: () => fetchUserBookings(userId),
    enabled: !!userId,
  });
}

export function useUserPayments(userId: string) {
  return useQuery({
    queryKey: userKeys.payments(userId),
    queryFn: () => fetchUserPayments(userId),
    enabled: !!userId,
  });
}

export function useUserStats(userId: string) {
  return useQuery({
    queryKey: userKeys.stats(userId),
    queryFn: () => fetchUserStats(userId),
    enabled: !!userId,
  });
}
