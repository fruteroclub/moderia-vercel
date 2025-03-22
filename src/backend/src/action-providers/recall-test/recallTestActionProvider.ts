import { z } from "zod";
import {
  ActionProvider,
  CreateAction,
  Network,
  EvmWalletProvider
} from "@coinbase/agentkit";
import { testnet } from "@recallnet/chains";
import { RecallClient } from "@recallnet/sdk/client";
import { createWalletClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { 
  RECALL_ACTION_NAMES, 
  RECALL_NETWORKS, 
  RECALL_TEST_DESCRIPTION, 
  ERROR_MESSAGES 
} from "./constants.js";
import { 
  CreateRecallClientSchema, 
  GetRecallBalanceSchema,
  RetrieveRecallDataSchema,
  StoreRecallDataSchema,
  PurchaseRecallCreditSchema,
  CreateRecallBucketSchema,
  AddObjectToBucketSchema,
  QueryBucketObjectsSchema,
  GetBucketObjectSchema
} from "./schemas.js";

/**
 * RecallTestActionProvider provides actions for interacting with the Recall Network
 * This includes creating a client, storing and retrieving data
 */
export class RecallTestActionProvider extends ActionProvider<EvmWalletProvider> {
  private recallClient: RecallClient | null = null;
  private currentNetwork: string | null = null;
  private buckets: Record<string, string> = {}; // Map to store created bucket IDs

  constructor() {
    super("recall-test", []);
  }

  @CreateAction({
    name: RECALL_ACTION_NAMES.CREATE_CLIENT,
    description: "Create a Recall client for interacting with the Recall Network",
    schema: CreateRecallClientSchema,
  })
  async createRecallClient(
    walletProvider: EvmWalletProvider,
    args: z.infer<typeof CreateRecallClientSchema>
  ): Promise<string> {
    try {
      const privateKey = process.env.WALLET_PRIVATE_KEY;
      
      if (!privateKey) {
        return ERROR_MESSAGES.MISSING_PRIVATE_KEY;
      }

      const chainConfig = RECALL_NETWORKS[args.networkName];
      this.currentNetwork = args.networkName;

      // Create a wallet client from the private key
      const walletClient = createWalletClient({
        account: privateKeyToAccount(privateKey as `0x${string}`),
        chain: chainConfig,
        transport: http(),
      });

      // Create a Recall client from the wallet client
      this.recallClient = new RecallClient({ walletClient });

      return `Successfully created Recall client for ${args.networkName} network.`;
    } catch (error) {
      return `${ERROR_MESSAGES.FAILED_CLIENT_CREATION} Error: ${error instanceof Error ? error.message : String(error)}`;
    }
  }

  @CreateAction({
    name: RECALL_ACTION_NAMES.GET_BALANCE,
    description: "Get the balance of a Recall account",
    schema: GetRecallBalanceSchema,
  })
  async getRecallBalance(
    walletProvider: EvmWalletProvider,
    args: z.infer<typeof GetRecallBalanceSchema>
  ): Promise<string> {
    try {
      if (!this.recallClient) {
        return ERROR_MESSAGES.MISSING_CLIENT;
      }

      let address = args.address;
      
      if (!address && this.recallClient.walletClient && this.recallClient.walletClient.account) {
        // If no address provided, use the connected wallet address
        address = this.recallClient.walletClient.account.address;
      }

      if (!address) {
        return "No address provided and no wallet connected.";
      }

      // Here you would implement the actual balance check
      // This is a placeholder for demonstration
      const balance = "1.0 RCL"; // Replace with actual balance query

      return `Balance for ${address}: ${balance}`;
    } catch (error) {
      return `Failed to get balance. Error: ${error instanceof Error ? error.message : String(error)}`;
    }
  }

  @CreateAction({
    name: RECALL_ACTION_NAMES.STORE_DATA,
    description: "Store data on the Recall network",
    schema: StoreRecallDataSchema,
  })
  async storeRecallData(
    walletProvider: EvmWalletProvider,
    args: z.infer<typeof StoreRecallDataSchema>
  ): Promise<string> {
    try {
      if (!this.recallClient) {
        return ERROR_MESSAGES.MISSING_CLIENT;
      }

      // Here you would implement the actual data storage
      // This is a placeholder for demonstration
      const txResult = { hash: "0x123...456" }; // Replace with actual tx result

      return `Successfully stored data with key: ${args.key}. Transaction hash: ${txResult.hash}`;
    } catch (error) {
      return `Failed to store data. Error: ${error instanceof Error ? error.message : String(error)}`;
    }
  }

  @CreateAction({
    name: RECALL_ACTION_NAMES.RETRIEVE_DATA,
    description: "Retrieve data from the Recall network",
    schema: RetrieveRecallDataSchema,
  })
  async retrieveRecallData(
    walletProvider: EvmWalletProvider,
    args: z.infer<typeof RetrieveRecallDataSchema>
  ): Promise<string> {
    try {
      if (!this.recallClient) {
        return ERROR_MESSAGES.MISSING_CLIENT;
      }

      // Here you would implement the actual data retrieval
      // This is a placeholder for demonstration
      const data = { value: "Example data for " + args.key }; // Replace with actual retrieved data

      return `Retrieved data for key ${args.key}: ${JSON.stringify(data.value)}`;
    } catch (error) {
      return `Failed to retrieve data. Error: ${error instanceof Error ? error.message : String(error)}`;
    }
  }

  @CreateAction({
    name: RECALL_ACTION_NAMES.PURCHASE_CREDIT,
    description: "Purchase credits on the Recall network",
    schema: PurchaseRecallCreditSchema,
  })
  async purchaseRecallCredit(
    walletProvider: EvmWalletProvider,
    args: z.infer<typeof PurchaseRecallCreditSchema>
  ): Promise<string> {
    try {
      if (!this.recallClient) {
        return ERROR_MESSAGES.MISSING_CLIENT;
      }

      // Set up credit manager
      const creditManager = this.recallClient.creditManager();
      
      // Buy credits with the specified amount of ETH
      const parsedAmount = parseEther(args.amount);
      const { meta: creditMeta } = await creditManager.buy(parsedAmount);
      
      if (creditMeta?.tx?.transactionHash) {
        return `Successfully purchased credits with ${args.amount} ETH. Transaction hash: ${creditMeta.tx.transactionHash}`;
      } else {
        return `Credits purchased, but transaction hash not available.`;
      }
    } catch (error) {
      return `${ERROR_MESSAGES.FAILED_CREDIT_PURCHASE} Error: ${error instanceof Error ? error.message : String(error)}`;
    }
  }

  @CreateAction({
    name: RECALL_ACTION_NAMES.CREATE_BUCKET,
    description: "Create a new bucket on the Recall network",
    schema: CreateRecallBucketSchema,
  })
  async createRecallBucket(
    walletProvider: EvmWalletProvider,
    args: z.infer<typeof CreateRecallBucketSchema>
  ): Promise<string> {
    try {
      if (!this.recallClient) {
        return ERROR_MESSAGES.MISSING_CLIENT;
      }

      const bucketManager = this.recallClient.bucketManager();
      
      // Create a new bucket
      const { result: { bucket } } = await bucketManager.create();
      
      // Store the bucket ID with a name if provided
      const bucketName = args.name || `bucket-${Date.now()}`;
      this.buckets[bucketName] = bucket;
      
      return `Successfully created bucket with ID: ${bucket}. You can refer to this bucket as "${bucketName}" in future operations.`;
    } catch (error) {
      return `${ERROR_MESSAGES.FAILED_BUCKET_CREATION} Error: ${error instanceof Error ? error.message : String(error)}`;
    }
  }

  @CreateAction({
    name: RECALL_ACTION_NAMES.ADD_OBJECT,
    description: "Add an object to a bucket on the Recall network",
    schema: AddObjectToBucketSchema,
  })
  async addObjectToBucket(
    walletProvider: EvmWalletProvider,
    args: z.infer<typeof AddObjectToBucketSchema>
  ): Promise<string> {
    try {
      if (!this.recallClient) {
        return ERROR_MESSAGES.MISSING_CLIENT;
      }

      // Resolve the bucket ID (either direct ID or name reference)
      const bucketId = this.buckets[args.bucket] || args.bucket;
      
      const bucketManager = this.recallClient.bucketManager();
      
      // Convert the content string to a Uint8Array
      const content = new TextEncoder().encode(args.content);
      
      // Create a File object with the content
      const contentType = args.contentType || "text/plain";
      const file = new File([content], "file.txt", { type: contentType });
      
      // Add the object to the bucket - cast bucket ID to proper hex type
      const { meta: addMeta } = await bucketManager.add(bucketId as `0x${string}`, args.key, file);
      
      if (addMeta?.tx?.transactionHash) {
        return `Successfully added object "${args.key}" to bucket ${bucketId}. Transaction hash: ${addMeta.tx.transactionHash}`;
      } else {
        return `Successfully added object "${args.key}" to bucket ${bucketId}.`;
      }
    } catch (error) {
      return `${ERROR_MESSAGES.FAILED_OBJECT_ADDITION} Error: ${error instanceof Error ? error.message : String(error)}`;
    }
  }

  @CreateAction({
    name: RECALL_ACTION_NAMES.QUERY_OBJECTS,
    description: "Query objects in a bucket on the Recall network",
    schema: QueryBucketObjectsSchema,
  })
  async queryBucketObjects(
    walletProvider: EvmWalletProvider,
    args: z.infer<typeof QueryBucketObjectsSchema>
  ): Promise<string> {
    try {
      if (!this.recallClient) {
        return ERROR_MESSAGES.MISSING_CLIENT;
      }

      // Resolve the bucket ID (either direct ID or name reference)
      const bucketId = this.buckets[args.bucket] || args.bucket;
      
      const bucketManager = this.recallClient.bucketManager();
      
      // Query objects in the bucket - cast bucket ID to proper hex type
      const queryOptions = args.prefix ? { prefix: args.prefix } : undefined;
      const { result: { objects } } = await bucketManager.query(bucketId as `0x${string}`, queryOptions);
      
      if (objects && objects.length > 0) {
        return `Found ${objects.length} objects in bucket ${bucketId}:\n${JSON.stringify(objects, null, 2)}`;
      } else {
        return `No objects found in bucket ${bucketId}${args.prefix ? ` with prefix "${args.prefix}"` : ''}.`;
      }
    } catch (error) {
      return `${ERROR_MESSAGES.FAILED_OBJECT_QUERY} Error: ${error instanceof Error ? error.message : String(error)}`;
    }
  }

  @CreateAction({
    name: RECALL_ACTION_NAMES.GET_OBJECT,
    description: "Get an object from a bucket on the Recall network",
    schema: GetBucketObjectSchema,
  })
  async getBucketObject(
    walletProvider: EvmWalletProvider,
    args: z.infer<typeof GetBucketObjectSchema>
  ): Promise<string> {
    try {
      if (!this.recallClient) {
        return ERROR_MESSAGES.MISSING_CLIENT;
      }

      // Resolve the bucket ID (either direct ID or name reference)
      const bucketId = this.buckets[args.bucket] || args.bucket;
      
      const bucketManager = this.recallClient.bucketManager();
      
      // Get the object from the bucket - cast bucket ID to proper hex type
      const { result: object } = await bucketManager.get(bucketId as `0x${string}`, args.key);
      
      if (object) {
        // Convert the binary data to text
        const contents = new TextDecoder().decode(object);
        return `Retrieved object "${args.key}" from bucket ${bucketId}:\n${contents}`;
      } else {
        return `Object "${args.key}" not found in bucket ${bucketId}.`;
      }
    } catch (error) {
      return `${ERROR_MESSAGES.FAILED_OBJECT_RETRIEVAL} Error: ${error instanceof Error ? error.message : String(error)}`;
    }
  }

  supportsNetwork = (network: Network) => network.protocolFamily === "evm";
}

export const recallTestActionProvider = () => new RecallTestActionProvider(); 