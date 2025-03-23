import { z } from "zod";

// Basic Recall operations schemas - similar to recall-test
export const CreateRecallClientSchema = z.object({
  networkName: z.enum(["testnet", "mainnet"]),
  userType: z.enum(["agent", "provider", "client"]).describe("The type of user (agent, service provider, or client)"),
});

export const GetRecallBalanceSchema = z.object({
  address: z.string().optional(),
  userType: z.enum(["agent", "provider", "client"]).optional(),
});

// Service provider schemas
export const CreateServiceListingSchema = z.object({
  serviceType: z.string().describe("Type of service (e.g., 'French language teaching')"),
  providerName: z.string().describe("Name of the service provider"),
  startTime: z.string().describe("Start time in UTC format"),
  endTime: z.string().describe("End time in UTC format"),
  price: z.number().positive().describe("Price in USDC"),
  walletAddress: z.string().describe("Wallet address for payment"),
  meetingLink: z.string().optional().describe("Video call link (Zoom, Google Meet, Jitsi)"),
  description: z.string().optional().describe("Optional detailed description of the service"),
});

export const UpdateServiceListingSchema = z.object({
  serviceId: z.string().describe("ID of the service to update (bucket object key)"),
  updates: CreateServiceListingSchema.partial(),
});

export const ListProviderServicesSchema = z.object({
  status: z.enum(["available", "booked", "completed", "all"]).default("all"),
});

// Client schemas
export const QueryAvailableServicesSchema = z.object({
  serviceType: z.string().optional().describe("Optional filter by service type"),
  startTimeMin: z.string().optional().describe("Optional filter by minimum start time"),
  startTimeMax: z.string().optional().describe("Optional filter by maximum start time"),
  priceMin: z.number().optional().describe("Optional filter by minimum price"),
  priceMax: z.number().optional().describe("Optional filter by maximum price"),
});

export const BookServiceSchema = z.object({
  serviceId: z.string().describe("ID of the service to book"),
  clientName: z.string().describe("Name of the client"),
  clientEmail: z.string().email().optional().describe("Email of the client"),
  specialRequests: z.string().optional().describe("Any special requests or notes"),
});

export const ListClientBookingsSchema = z.object({
  status: z.enum(["upcoming", "past", "all"]).default("all"),
});

export const ReportServiceIssueSchema = z.object({
  bookingId: z.string().describe("ID of the booking with an issue"),
  issueType: z.enum(["no-show", "quality", "technical", "other"]),
  description: z.string().describe("Description of the issue"),
});

// Agent schemas
export const ReleaseFundsSchema = z.object({
  bookingId: z.string().describe("ID of the completed booking"),
  amount: z.number().positive().describe("Amount to release to the provider"),
});

export const RefundClientSchema = z.object({
  bookingId: z.string().describe("ID of the booking to refund"),
  amount: z.number().positive().describe("Amount to refund to the client"),
  reason: z.string().describe("Reason for the refund"),
});

export const RecordServiceCompletionSchema = z.object({
  bookingId: z.string().describe("ID of the completed booking"),
  notes: z.string().optional().describe("Notes from the session"),
  rating: z.number().min(1).max(5).optional().describe("Rating of the service (1-5)"),
});

export const ResolveDisputeSchema = z.object({
  bookingId: z.string().describe("ID of the booking with a dispute"),
  resolution: z.enum(["full_refund", "partial_refund", "no_refund"]),
  amount: z.number().optional().describe("Amount for partial refund"),
  notes: z.string().describe("Notes explaining the resolution"),
});

// Type exports
export type CreateRecallClientInput = z.infer<typeof CreateRecallClientSchema>;
export type GetRecallBalanceInput = z.infer<typeof GetRecallBalanceSchema>;

export type CreateServiceListingInput = z.infer<typeof CreateServiceListingSchema>;
export type UpdateServiceListingInput = z.infer<typeof UpdateServiceListingSchema>;
export type ListProviderServicesInput = z.infer<typeof ListProviderServicesSchema>;

export type QueryAvailableServicesInput = z.infer<typeof QueryAvailableServicesSchema>;
export type BookServiceInput = z.infer<typeof BookServiceSchema>;
export type ListClientBookingsInput = z.infer<typeof ListClientBookingsSchema>;
export type ReportServiceIssueInput = z.infer<typeof ReportServiceIssueSchema>;

export type ReleaseFundsInput = z.infer<typeof ReleaseFundsSchema>;
export type RefundClientInput = z.infer<typeof RefundClientSchema>;
export type RecordServiceCompletionInput = z.infer<typeof RecordServiceCompletionSchema>;
export type ResolveDisputeInput = z.infer<typeof ResolveDisputeSchema>; 