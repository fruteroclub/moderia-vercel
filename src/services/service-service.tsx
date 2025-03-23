import type {
  Service,
  User,
  Booking,
  CompletionRecord,
  Payment,
  Transcript,
} from "@prisma/client";

interface ServiceWithRelations extends Service {
  provider: User;
  bookings: Booking[];
  completions: CompletionRecord[];
  payments: Payment[];
  transcript?: Transcript;
}

interface ServiceResponse {
  service?: ServiceWithRelations | null;
  services?: ServiceWithRelations[] | null;
  error?: any;
  errorMessage?: string;
  metrics?: ServiceMetrics | null;
}

interface ServiceMetrics {
  totalBookings: number;
  averageRating: number;
  totalRevenue: number;
}

interface ServiceCreateData {
  serviceType: string;
  providerName: string;
  startTime: Date;
  endTime: Date;
  price: number;
  meetingLink?: string;
  description?: string;
  providerId: string;
}

interface ServiceUpdateData {
  serviceType?: string;
  providerName?: string;
  startTime?: Date;
  endTime?: Date;
  price?: number;
  meetingLink?: string;
  description?: string;
  status?: string;
}

/**
 * Fetches available services
 */
export async function fetchAvailableServices(): Promise<ServiceResponse> {
  try {
    const res = await fetch("/api/services/available");
    if (!res.ok) throw new Error("Failed to fetch available services");
    const data = await res.json();
    return { services: data.services };
  } catch (error) {
    console.error("Error in fetchAvailableServices:", error);
    return {
      services: null,
      error,
      errorMessage: "Failed to fetch available services",
    };
  }
}

/**
 * Fetches a service by ID
 */
export async function fetchServiceDetails(
  serviceId: string
): Promise<ServiceResponse> {
  try {
    const res = await fetch(`/api/services/${serviceId}`);
    if (!res.ok) throw new Error("Failed to fetch service details");
    const data = await res.json();
    return { service: data.service };
  } catch (error) {
    console.error("Error in fetchServiceDetails:", error);
    return {
      service: null,
      error,
      errorMessage: "Failed to fetch service details",
    };
  }
}

/**
 * Creates a new service
 */
export async function createNewService(
  serviceData: ServiceCreateData
): Promise<ServiceResponse> {
  try {
    const res = await fetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(serviceData),
    });
    if (!res.ok) throw new Error("Failed to create service");
    const data = await res.json();
    return { service: data.service };
  } catch (error) {
    console.error("Error in createNewService:", error);
    return {
      service: null,
      error,
      errorMessage: "Failed to create service",
    };
  }
}

/**
 * Updates a service
 */
export async function updateServiceDetails(
  serviceId: string,
  serviceData: ServiceUpdateData
): Promise<ServiceResponse> {
  try {
    const res = await fetch(`/api/services/${serviceId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(serviceData),
    });
    if (!res.ok) throw new Error("Failed to update service");
    const data = await res.json();
    return { service: data.service };
  } catch (error) {
    console.error("Error in updateServiceDetails:", error);
    return {
      service: null,
      error,
      errorMessage: "Failed to update service",
    };
  }
}

/**
 * Fetches service metrics
 */
export async function fetchServiceMetrics(
  serviceId: string
): Promise<ServiceResponse> {
  try {
    const res = await fetch(`/api/services/${serviceId}/metrics`);
    if (!res.ok) throw new Error("Failed to fetch service metrics");
    const data = await res.json();
    return { metrics: data.metrics };
  } catch (error) {
    console.error("Error in fetchServiceMetrics:", error);
    return {
      metrics: null,
      error,
      errorMessage: "Failed to fetch service metrics",
    };
  }
}
