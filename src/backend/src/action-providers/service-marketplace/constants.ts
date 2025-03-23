import { testnet } from "@recallnet/chains";

export type NetworkType = 'testnet' | 'mainnet';

export const RECALL_NETWORKS = {
  testnet,
  // Use testnet for both since mainnet might not be available yet
  mainnet: testnet,
} as const;

export const RECALL_PORTAL_URLS: Record<NetworkType, string> = {
  testnet: "https://portal.recall.network",
  mainnet: "https://portal.recall.network",
};

export const RECALL_EXPLORER_URLS: Record<NetworkType, string> = {
  testnet: "https://explorer.recall.network",
  mainnet: "https://explorer.recall.network",
};

export const SERVICE_MARKETPLACE_DESCRIPTION = "Implementation of a service marketplace using Recall Network";

export const SERVICE_MARKETPLACE_ACTION_NAMES = {
  // Recall basic operations
  CREATE_CLIENT: "createRecallClient",
  GET_BALANCE: "getRecallBalance",
  
  // Service provider actions
  CREATE_SERVICE_LISTING: "createServiceListing",
  UPDATE_SERVICE_LISTING: "updateServiceListing",
  LIST_PROVIDER_SERVICES: "listProviderServices",
  
  // Client actions
  QUERY_AVAILABLE_SERVICES: "queryAvailableServices",
  BOOK_SERVICE: "bookService",
  LIST_CLIENT_BOOKINGS: "listClientBookings",
  REPORT_SERVICE_ISSUE: "reportServiceIssue",
  
  // Agent actions
  RELEASE_FUNDS: "releaseFundsToProvider",
  REFUND_CLIENT: "refundClient",
  RECORD_SERVICE_COMPLETION: "recordServiceCompletion",
  RESOLVE_DISPUTE: "resolveDispute",
};

export const ERROR_MESSAGES = {
  NETWORK_MISMATCH: "Network mismatch. Make sure you're on the correct network.",
  INSUFFICIENT_BALANCE: "Insufficient balance for the operation.",
  FAILED_CLIENT_CREATION: "Failed to create Recall client.",
  MISSING_PRIVATE_KEY: "Missing private key in environment variables.",
  MISSING_CLIENT: "Recall client not initialized. Please create a client first.",
  
  // Service marketplace specific errors
  INVALID_SERVICE_DATA: "Invalid service data. Please check your input.",
  SERVICE_NOT_FOUND: "Service listing not found.",
  BOOKING_FAILED: "Failed to book the service.",
  SERVICE_ALREADY_BOOKED: "This service is already booked.",
  UNAUTHORIZED_ACTION: "You are not authorized to perform this action.",
  PAYMENT_FAILED: "Payment transaction failed.",
  INVALID_BOOKING_ID: "Invalid booking ID.",
  DISPUTE_RESOLUTION_FAILED: "Failed to resolve the dispute."
}; 