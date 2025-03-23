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

export const RECALL_TEST_DESCRIPTION = "Test implementation of the Recall Network SDK";

export const RECALL_ACTION_NAMES = {
  CREATE_CLIENT: "createRecallClient",
  GET_BALANCE: "getRecallBalance",
  RETRIEVE_DATA: "retrieveRecallData",
  STORE_DATA: "storeRecallData",
  PURCHASE_CREDIT: "purchaseRecallCredit",
  CREATE_BUCKET: "createRecallBucket",
  ADD_OBJECT: "addObjectToBucket",
  QUERY_OBJECTS: "queryBucketObjects",
  GET_OBJECT: "getBucketObject",
};

export const ERROR_MESSAGES = {
  NETWORK_MISMATCH: "Network mismatch. Make sure you're on the correct network.",
  INSUFFICIENT_BALANCE: "Insufficient balance for the operation.",
  FAILED_CLIENT_CREATION: "Failed to create Recall client.",
  MISSING_PRIVATE_KEY: "Missing private key in environment variables.",
  MISSING_CLIENT: "Recall client not initialized. Please create a client first.",
  FAILED_CREDIT_PURCHASE: "Failed to purchase credit.",
  FAILED_BUCKET_CREATION: "Failed to create bucket.",
  FAILED_OBJECT_ADDITION: "Failed to add object to bucket.",
  FAILED_OBJECT_QUERY: "Failed to query objects in bucket.",
  FAILED_OBJECT_RETRIEVAL: "Failed to retrieve object from bucket."
}; 