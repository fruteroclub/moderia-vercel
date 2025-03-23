import type { User, Service, Booking, Payment } from "@prisma/client";

interface UserWithRelations extends User {
  providedServices: Service[];
  bookings: Booking[];
  payments: Payment[];
}

export interface UserResponse {
  user?: UserWithRelations | null;
  users?: UserWithRelations[] | null;
  error?: any;
  errorMessage?: string;
  stats?: UserStats | null;
}

interface UserStats {
  providedServices: number;
  bookings: number;
  totalEarnings: number;
}

interface UserCreateData {
  walletAddress: string;
  name?: string;
  email?: string;
}

export interface UserUpdateData {
  name?: string;
  email?: string;
}

/**
 * Fetches a user by their wallet address
 */
export async function fetchUserByWallet(
  walletAddress: string
): Promise<UserResponse> {
  try {
    const res = await fetch(`/api/users/wallet/${walletAddress}`);
    if (!res.ok) throw new Error("Failed to fetch user");
    const data = await res.json();
    return { user: data.user };
  } catch (error) {
    console.error("Error in fetchUserByWallet:", error);
    return {
      user: null,
      error,
      errorMessage: "Failed to fetch user by wallet address",
    };
  }
}

/**
 * Fetches a user by their ID
 */
export async function fetchUserProfile(userId: string): Promise<UserResponse> {
  try {
    const res = await fetch(`/api/users/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch user profile");
    const data = await res.json();
    return { user: data.user };
  } catch (error) {
    console.error("Error in fetchUserProfile:", error);
    return {
      user: null,
      error,
      errorMessage: "Failed to fetch user profile",
    };
  }
}

/**
 * Fetches all users
 */
export async function fetchAllUsers(): Promise<UserResponse> {
  try {
    const res = await fetch("/api/users");
    if (!res.ok) throw new Error("Failed to fetch users");
    const data = await res.json();
    return { users: data.users };
  } catch (error) {
    console.error("Error in fetchAllUsers:", error);
    return {
      users: null,
      error,
      errorMessage: "Failed to fetch users",
    };
  }
}

/**
 * Creates a new user
 */
export async function registerUser(
  userData: UserCreateData
): Promise<UserResponse> {
  try {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (!res.ok) throw new Error("Failed to register user");
    const data = await res.json();
    return { user: data.user };
  } catch (error) {
    console.error("Error in registerUser:", error);
    return {
      user: null,
      error,
      errorMessage: "Failed to register user",
    };
  }
}

/**
 * Updates a user's profile
 */
export async function updateUserProfile(
  userId: string,
  userData: UserUpdateData
): Promise<UserResponse> {
  try {
    const res = await fetch(`/api/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (!res.ok) throw new Error("Failed to update user profile");
    const data = await res.json();
    return { user: data.user };
  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    return {
      user: null,
      error,
      errorMessage: "Failed to update user profile",
    };
  }
}

/**
 * Fetches user statistics
 */
export async function fetchUserStats(userId: string): Promise<UserResponse> {
  try {
    const res = await fetch(`/api/users/${userId}/stats`);
    if (!res.ok) throw new Error("Failed to fetch user stats");
    const data = await res.json();
    return { stats: data.stats };
  } catch (error) {
    console.error("Error in fetchUserStats:", error);
    return {
      stats: null,
      error,
      errorMessage: "Failed to fetch user statistics",
    };
  }
}

/**
 * Fetches user's provided services
 */
export async function fetchUserProvidedServices(
  userId: string
): Promise<UserResponse> {
  try {
    const res = await fetch(`/api/users/${userId}/services`);
    if (!res.ok) throw new Error("Failed to fetch user services");
    const data = await res.json();
    return { user: { ...data.user, providedServices: data.services } };
  } catch (error) {
    console.error("Error in fetchUserProvidedServices:", error);
    return {
      user: null,
      error,
      errorMessage: "Failed to fetch user provided services",
    };
  }
}

/**
 * Fetches user's bookings
 */
export async function fetchUserBookings(userId: string): Promise<UserResponse> {
  try {
    const res = await fetch(`/api/users/${userId}/bookings`);
    if (!res.ok) throw new Error("Failed to fetch user bookings");
    const data = await res.json();
    return { user: { ...data.user, bookings: data.bookings } };
  } catch (error) {
    console.error("Error in fetchUserBookings:", error);
    return {
      user: null,
      error,
      errorMessage: "Failed to fetch user bookings",
    };
  }
}

/**
 * Fetches user's payment history
 */
export async function fetchUserPayments(userId: string): Promise<UserResponse> {
  try {
    const res = await fetch(`/api/users/${userId}/payments`);
    if (!res.ok) throw new Error("Failed to fetch user payments");
    const data = await res.json();
    return { user: { ...data.user, payments: data.payments } };
  } catch (error) {
    console.error("Error in fetchUserPayments:", error);
    return {
      user: null,
      error,
      errorMessage: "Failed to fetch user payments",
    };
  }
}
