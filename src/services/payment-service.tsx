import type { Payment, User, Service, Booking } from "@prisma/client";

interface PaymentWithRelations extends Payment {
  recipient: User;
  service: Service;
  booking: Booking;
}

interface PaymentResponse {
  payment?: PaymentWithRelations | null;
  payments?: PaymentWithRelations[] | null;
  error?: any;
  errorMessage?: string;
  stats?: PaymentStats | null;
}

interface PaymentStats {
  totalEarnings: number;
  totalTransactions: number;
  averagePayment: number;
}

interface PaymentCreateData {
  transactionTime: Date;
  paymentAmount: number;
  status: string;
  description?: string;
  bookingId: string;
  serviceId: string;
  recipientId: string;
}

interface PaymentUpdateData {
  status?: string;
  description?: string;
}

/**
 * Creates a new payment
 */
export async function initiatePayment(
  paymentData: PaymentCreateData
): Promise<PaymentResponse> {
  try {
    const res = await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentData),
    });
    if (!res.ok) throw new Error("Failed to initiate payment");
    const data = await res.json();
    return { payment: data.payment };
  } catch (error) {
    console.error("Error in initiatePayment:", error);
    return {
      payment: null,
      error,
      errorMessage: "Failed to initiate payment",
    };
  }
}

/**
 * Fetches payment details
 */
export async function fetchPaymentDetails(
  paymentId: string
): Promise<PaymentResponse> {
  try {
    const res = await fetch(`/api/payments/${paymentId}`);
    if (!res.ok) throw new Error("Failed to fetch payment details");
    const data = await res.json();
    return { payment: data.payment };
  } catch (error) {
    console.error("Error in fetchPaymentDetails:", error);
    return {
      payment: null,
      error,
      errorMessage: "Failed to fetch payment details",
    };
  }
}

/**
 * Updates payment status
 */
export async function updatePaymentStatus(
  paymentId: string,
  paymentData: PaymentUpdateData
): Promise<PaymentResponse> {
  try {
    const res = await fetch(`/api/payments/${paymentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentData),
    });
    if (!res.ok) throw new Error("Failed to update payment");
    const data = await res.json();
    return { payment: data.payment };
  } catch (error) {
    console.error("Error in updatePaymentStatus:", error);
    return {
      payment: null,
      error,
      errorMessage: "Failed to update payment",
    };
  }
}

/**
 * Fetches payment statistics
 */
export async function fetchPaymentStats(
  recipientId: string
): Promise<PaymentResponse> {
  try {
    const res = await fetch(`/api/payments/stats/${recipientId}`);
    if (!res.ok) throw new Error("Failed to fetch payment stats");
    const data = await res.json();
    return { stats: data.stats };
  } catch (error) {
    console.error("Error in fetchPaymentStats:", error);
    return {
      stats: null,
      error,
      errorMessage: "Failed to fetch payment statistics",
    };
  }
}
