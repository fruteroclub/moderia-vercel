import type {
  Booking,
  User,
  Service,
  CompletionRecord,
  Payment,
} from "@prisma/client";

interface BookingWithRelations extends Booking {
  client: User;
  service: Service;
  completions: CompletionRecord[];
  payments: Payment[];
}

interface BookingResponse {
  booking?: BookingWithRelations | null;
  bookings?: BookingWithRelations[] | null;
  error?: any;
  errorMessage?: string;
  status?: BookingStatus | null;
}

interface BookingStatus {
  status: string;
  isPaid: boolean;
  isCompleted: boolean;
  lastCompletion: Date | null;
}

interface BookingCreateData {
  clientName: string;
  clientEmail?: string;
  specialRequests?: string;
  bookingTime: Date;
  clientId: string;
  serviceId: string;
}

interface BookingUpdateData {
  clientName?: string;
  clientEmail?: string;
  specialRequests?: string;
  bookingTime?: Date;
  status?: string;
}

/**
 * Creates a new booking
 */
export async function createBookingRequest(
  bookingData: BookingCreateData
): Promise<BookingResponse> {
  try {
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    });
    if (!res.ok) throw new Error("Failed to create booking");
    const data = await res.json();
    return { booking: data.booking };
  } catch (error) {
    console.error("Error in createBookingRequest:", error);
    return {
      booking: null,
      error,
      errorMessage: "Failed to create booking",
    };
  }
}

/**
 * Fetches booking details
 */
export async function fetchBookingDetails(
  bookingId: string
): Promise<BookingResponse> {
  try {
    const res = await fetch(`/api/bookings/${bookingId}`);
    if (!res.ok) throw new Error("Failed to fetch booking details");
    const data = await res.json();
    return { booking: data.booking };
  } catch (error) {
    console.error("Error in fetchBookingDetails:", error);
    return {
      booking: null,
      error,
      errorMessage: "Failed to fetch booking details",
    };
  }
}

/**
 * Updates a booking
 */
export async function updateBookingDetails(
  bookingId: string,
  bookingData: BookingUpdateData
): Promise<BookingResponse> {
  try {
    const res = await fetch(`/api/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    });
    if (!res.ok) throw new Error("Failed to update booking");
    const data = await res.json();
    return { booking: data.booking };
  } catch (error) {
    console.error("Error in updateBookingDetails:", error);
    return {
      booking: null,
      error,
      errorMessage: "Failed to update booking",
    };
  }
}

/**
 * Fetches booking status
 */
export async function fetchBookingStatus(
  bookingId: string
): Promise<BookingResponse> {
  try {
    const res = await fetch(`/api/bookings/${bookingId}/status`);
    if (!res.ok) throw new Error("Failed to fetch booking status");
    const data = await res.json();
    return { status: data.status };
  } catch (error) {
    console.error("Error in fetchBookingStatus:", error);
    return {
      status: null,
      error,
      errorMessage: "Failed to fetch booking status",
    };
  }
}
