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
  SERVICE_MARKETPLACE_ACTION_NAMES, 
  RECALL_NETWORKS, 
  SERVICE_MARKETPLACE_DESCRIPTION, 
  ERROR_MESSAGES,
  RECALL_PORTAL_URLS,
  RECALL_EXPLORER_URLS,
  NetworkType
} from "./constants.js";
import {
  CreateRecallClientSchema,
  GetRecallBalanceSchema,
  CreateServiceListingSchema,
  UpdateServiceListingSchema,
  ListProviderServicesSchema,
  QueryAvailableServicesSchema,
  BookServiceSchema,
  ListClientBookingsSchema,
  ReportServiceIssueSchema,
  ReleaseFundsSchema,
  RefundClientSchema,
  RecordServiceCompletionSchema,
  ResolveDisputeSchema
} from "./schemas.js";

// Type definitions
interface ServiceListing {
  serviceType: string;
  providerName: string;
  startTime: string;
  endTime: string;
  price: number;
  walletAddress: string;
  meetingLink?: string;
  description?: string;
  status: "available" | "booked" | "completed" | "cancelled";
  id: string;
}

interface Booking {
  serviceId: string;
  clientName: string;
  clientEmail?: string;
  specialRequests?: string;
  bookingTime: string;
  status: "confirmed" | "completed" | "cancelled" | "disputed";
  id: string;
}

/**
 * ServiceMarketplaceActionProvider provides actions for a service marketplace using Recall Network
 * Includes service listing, booking, and payment processing
 */
export class ServiceMarketplaceActionProvider extends ActionProvider<EvmWalletProvider> {
  // Clients for different user types
  private agentClient: RecallClient | null = null;
  private providerClient: RecallClient | null = null;
  private clientClient: RecallClient | null = null;
  
  private currentNetwork: NetworkType | null = null;
  
  // Bucket IDs for different data types - using proper `0x${string}` type for bucket IDs
  private serviceListingsBucket: `0x${string}` | null = null;
  private bookingsBucket: `0x${string}` | null = null;
  private transactionsBucket: `0x${string}` | null = null;

  constructor() {
    super("service-marketplace", []);
  }

  /**
   * Creates a Recall client for the specified user type
   */
  @CreateAction({
    name: SERVICE_MARKETPLACE_ACTION_NAMES.CREATE_CLIENT,
    description: "Create a Recall client for a specific user type (agent, provider, or client)",
    schema: CreateRecallClientSchema,
  })
  async createRecallClient(
    walletProvider: EvmWalletProvider,
    args: z.infer<typeof CreateRecallClientSchema>
  ): Promise<string> {
    try {
      let privateKey: string | undefined;
      
      // Get the appropriate private key based on user type
      switch (args.userType) {
        case "agent":
          privateKey = process.env.WALLET_PRIVATE_KEY_AGENT;
          break;
        case "provider":
          privateKey = process.env.WALLET_PRIVATE_KEY_PROVIDER;
          break;
        case "client":
          privateKey = process.env.WALLET_PRIVATE_KEY_CLIENT;
          break;
      }
      
      if (!privateKey) {
        return `${ERROR_MESSAGES.MISSING_PRIVATE_KEY} for ${args.userType}`;
      }

      const chainConfig = RECALL_NETWORKS[args.networkName];
      this.currentNetwork = args.networkName;

      // Create a wallet client from the private key
      const walletClient = createWalletClient({
        account: privateKeyToAccount(privateKey as `0x${string}`),
        chain: chainConfig,
        transport: http(),
      });

      // Create a Recall client and assign to the appropriate user type
      const client = new RecallClient({ walletClient });
      
      switch (args.userType) {
        case "agent":
          this.agentClient = client;
          break;
        case "provider":
          this.providerClient = client;
          break;
        case "client":
          this.clientClient = client;
          break;
      }

      // Get wallet address
      const walletAddress = walletClient.account.address;
      const explorerAddressUrl = `${RECALL_EXPLORER_URLS[args.networkName]}/address/${walletAddress}`;

      return `Successfully created Recall client for ${args.userType} on ${args.networkName} network.\nWallet address: ${walletAddress}\nExplorer: ${explorerAddressUrl}`;
    } catch (error) {
      return `${ERROR_MESSAGES.FAILED_CLIENT_CREATION} Error: ${error instanceof Error ? error.message : String(error)}`;
    }
  }

  /**
   * Gets the balance of a Recall account
   */
  @CreateAction({
    name: SERVICE_MARKETPLACE_ACTION_NAMES.GET_BALANCE,
    description: "Get the balance of a Recall account",
    schema: GetRecallBalanceSchema,
  })
  async getRecallBalance(
    walletProvider: EvmWalletProvider,
    args: z.infer<typeof GetRecallBalanceSchema>
  ): Promise<string> {
    try {
      // Determine which client to use
      let client: RecallClient | null = null;
      
      if (args.userType) {
        switch (args.userType) {
          case "agent":
            client = this.agentClient;
            break;
          case "provider":
            client = this.providerClient;
            break;
          case "client":
            client = this.clientClient;
            break;
        }
      } else {
        // Default to agent client if no user type specified
        client = this.agentClient || this.providerClient || this.clientClient;
      }

      if (!client) {
        return ERROR_MESSAGES.MISSING_CLIENT;
      }

      // Get address to check - Fix potential undefined walletClient
      const address = args.address || (client.walletClient?.account?.address);
      
      if (!address) {
        return "No valid address to check balance";
      }

      // Call the chain to get the balance
      const blockNumber = await client.publicClient.getBlockNumber();
      const balance = await client.publicClient.getBalance({
        address: address as `0x${string}`,
        blockTag: "latest",
      });

      // Convert from Wei to ETH for display
      const balanceInEth = Number(balance) / 10**18;
      
      const explorerAddressUrl = `${RECALL_EXPLORER_URLS[this.currentNetwork || "testnet"]}/address/${address}`;
      
      return `Balance for address ${address}: ${balanceInEth} RCL\nExplorer: ${explorerAddressUrl}`;
    } catch (error) {
      return `Failed to get balance. Error: ${error instanceof Error ? error.message : String(error)}`;
    }
  }

  /**
   * Creates a service listing by a service provider
   */
  @CreateAction({
    name: SERVICE_MARKETPLACE_ACTION_NAMES.CREATE_SERVICE_LISTING,
    description: "Create a new service listing as a service provider",
    schema: CreateServiceListingSchema,
  })
  async createServiceListing(
    walletProvider: EvmWalletProvider,
    args: z.infer<typeof CreateServiceListingSchema>
  ): Promise<string> {
    try {
      // Ensure provider client is initialized
      if (!this.providerClient) {
        return `${ERROR_MESSAGES.MISSING_CLIENT} Please create a provider client first.`;
      }

      // Create listings bucket if it doesn't exist
      if (!this.serviceListingsBucket) {
        const bucketManager = this.providerClient.bucketManager();
        const { result } = await bucketManager.create();
        this.serviceListingsBucket = result.bucket;
      }

      // Create a unique ID for the service
      const serviceId = `service_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      
      // Prepare the service listing object
      const serviceListing: ServiceListing = {
        ...args,
        status: "available",
        id: serviceId
      };

      // Store the data as plain text for easier retrieval
      const content = new TextEncoder().encode(JSON.stringify(serviceListing, null, 2));
      const file = new File([content], "service.txt", {
        type: "text/plain", // Use text/plain instead of application/json for better readability
      });

      // Add to bucket
      const bucketManager = this.providerClient.bucketManager();
      await bucketManager.add(
        this.serviceListingsBucket, 
        `listings/${serviceId}`, 
        file,
        { 
          metadata: { 
            "content-type": "text/plain",
            "service-type": serviceListing.serviceType,
            "provider-name": serviceListing.providerName,
            "price": serviceListing.price.toString(),
            "status": serviceListing.status,
            "start-time": serviceListing.startTime,
            "end-time": serviceListing.endTime,
            "description": serviceListing.description || ""
          }
        }
      );

      const portalUrl = `${RECALL_PORTAL_URLS[this.currentNetwork || "testnet"]}/buckets/${this.serviceListingsBucket}?path=listings%2F${serviceId}`;

      return `Service listing created successfully!\nService ID: ${serviceId}\nBucket ID: ${this.serviceListingsBucket}\nPortal Link: ${portalUrl}`;
    } catch (error) {
      return `Failed to create service listing. Error: ${error instanceof Error ? error.message : String(error)}`;
    }
  }

  /**
   * Queries available services with optional filters
   */
  @CreateAction({
    name: SERVICE_MARKETPLACE_ACTION_NAMES.QUERY_AVAILABLE_SERVICES,
    description: "Query available services with optional filters",
    schema: QueryAvailableServicesSchema,
  })
  async queryAvailableServices(
    walletProvider: EvmWalletProvider,
    args: z.infer<typeof QueryAvailableServicesSchema>
  ): Promise<string> {
    try {
      // Use client or agent client to query services
      const client = this.clientClient || this.agentClient;
      
      if (!client || !this.serviceListingsBucket) {
        return `${ERROR_MESSAGES.MISSING_CLIENT} or service listings bucket not created.`;
      }

      // Query the bucket for service listings
      const bucketManager = client.bucketManager();
      const { result } = await bucketManager.query(this.serviceListingsBucket, { 
        prefix: "listings/" 
      });

      // No services found
      if (!result.objects || result.objects.length === 0) {
        return "No services found.";
      }

      // Fetch and parse all service listings
      const services: ServiceListing[] = [];
      
      for (const obj of result.objects) {
        // Get the content of each service listing
        try {
          const serviceData = await bucketManager.get(this.serviceListingsBucket, obj.key);
          const serviceText = new TextDecoder().decode(serviceData.result);
          const service = JSON.parse(serviceText) as ServiceListing;
          
          // Only include available services
          if (service.status === "available") {
            services.push(service);
          }
        } catch (error) {
          console.error(`Error fetching service ${obj.key}:`, error);
          // Continue to the next object if one fails
          continue;
        }
      }

      // Apply filters
      let filteredServices = services;
      
      if (args.serviceType) {
        filteredServices = filteredServices.filter(s => 
          s.serviceType.toLowerCase().includes(args.serviceType!.toLowerCase())
        );
      }
      
      if (args.startTimeMin) {
        filteredServices = filteredServices.filter(s => 
          new Date(s.startTime) >= new Date(args.startTimeMin!)
        );
      }
      
      if (args.startTimeMax) {
        filteredServices = filteredServices.filter(s => 
          new Date(s.startTime) <= new Date(args.startTimeMax!)
        );
      }
      
      if (args.priceMin !== undefined) {
        filteredServices = filteredServices.filter(s => s.price >= args.priceMin!);
      }
      
      if (args.priceMax !== undefined) {
        filteredServices = filteredServices.filter(s => s.price <= args.priceMax!);
      }

      // No services match the filters
      if (filteredServices.length === 0) {
        return "No services found matching the specified criteria.";
      }

      // Generate a formatted response
      const servicesInfo = filteredServices.map(service => {
        return `- ID: ${service.id}
  Type: ${service.serviceType}
  Provider: ${service.providerName}
  Time: ${service.startTime} to ${service.endTime}
  Price: ${service.price} USDC
  ${service.description ? `Description: ${service.description}` : ""}`
      }).join("\n\n");

      const portalUrl = `${RECALL_PORTAL_URLS[this.currentNetwork || "testnet"]}/buckets/${this.serviceListingsBucket}`;
      
      return `Found ${filteredServices.length} available services:\n\n${servicesInfo}\n\nBucket Portal Link: ${portalUrl}`;
    } catch (error) {
      return `Failed to query available services. Error: ${error instanceof Error ? error.message : String(error)}`;
    }
  }

  /**
   * Book a service as a client
   */
  @CreateAction({
    name: SERVICE_MARKETPLACE_ACTION_NAMES.BOOK_SERVICE,
    description: "Book a service as a client",
    schema: BookServiceSchema,
  })
  async bookService(
    walletProvider: EvmWalletProvider,
    args: z.infer<typeof BookServiceSchema>
  ): Promise<string> {
    try {
      // Ensure client client is initialized
      if (!this.clientClient || !this.agentClient) {
        return `${ERROR_MESSAGES.MISSING_CLIENT} Please create a client and agent client first.`;
      }

      // Create bookings bucket if it doesn't exist
      if (!this.bookingsBucket) {
        const bucketManager = this.agentClient.bucketManager();
        const { result } = await bucketManager.create();
        this.bookingsBucket = result.bucket;
      }

      // First, fetch the service listing to check if it's available
      if (!this.serviceListingsBucket) {
        return `Service listings bucket not found.`;
      }

      const bucketManager = this.clientClient.bucketManager();
      
      // Try to get the service listing
      try {
        const serviceData = await bucketManager.get(
          this.serviceListingsBucket, 
          `listings/${args.serviceId}`
        );
        
        const serviceText = new TextDecoder().decode(serviceData.result);
        const service = JSON.parse(serviceText) as ServiceListing;
        
        // Check if service is available
        if (service.status !== "available") {
          return `${ERROR_MESSAGES.SERVICE_ALREADY_BOOKED} This service is not available for booking.`;
        }

        // Create a booking ID
        const bookingId = `booking_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        
        // Create the booking object
        const booking: Booking = {
          serviceId: args.serviceId,
          clientName: args.clientName,
          clientEmail: args.clientEmail,
          specialRequests: args.specialRequests,
          bookingTime: new Date().toISOString(),
          status: "confirmed",
          id: bookingId
        };

        // Store booking data
        const content = new TextEncoder().encode(JSON.stringify(booking, null, 2));
        const file = new File([content], "booking.txt", {
          type: "text/plain",
        });

        // Add to bucket
        const agentBucketManager = this.agentClient.bucketManager();
        await agentBucketManager.add(
          this.bookingsBucket!, 
          `bookings/${bookingId}`, 
          file,
          { 
            metadata: { 
              "content-type": "text/plain",
              "service-id": booking.serviceId,
              "client-name": booking.clientName,
              "client-email": booking.clientEmail || "",
              "status": booking.status,
              "booking-time": booking.bookingTime,
              "special-requests": booking.specialRequests || ""
            }
          }
        );

        // Update service status to "booked"
        service.status = "booked";
        const updatedServiceContent = new TextEncoder().encode(JSON.stringify(service, null, 2));
        const updatedServiceFile = new File([updatedServiceContent], "service.txt", {
          type: "text/plain",
        });

        // Use provider client to update the service listing
        if (this.providerClient) {
          const providerBucketManager = this.providerClient.bucketManager();
          await providerBucketManager.add(
            this.serviceListingsBucket!, 
            `listings/${service.id}`, 
            updatedServiceFile,
            { 
              metadata: { 
                "content-type": "text/plain",
                "service-type": service.serviceType,
                "provider-name": service.providerName,
                "price": service.price.toString(),
                "status": service.status,
                "start-time": service.startTime,
                "end-time": service.endTime,
                "description": service.description || ""
              },
              overwrite: true
            }
          );
        } else {
          // Fallback to client client if provider client is not available
          await bucketManager.add(
            this.serviceListingsBucket!,
            `listings/${service.id}`,
            updatedServiceFile
          );
        }

        const bookingPortalUrl = `${RECALL_PORTAL_URLS[this.currentNetwork || "testnet"]}/buckets/${this.bookingsBucket}?path=bookings%2F${bookingId}`;
        
        // If the service has a meeting link, include it in the response
        const meetingLink = service.meetingLink ? `\n\nMeeting Link: ${service.meetingLink}` : "";

        return `Service booked successfully!\nBooking ID: ${bookingId}\nService: ${service.serviceType}\nProvider: ${service.providerName}\nTime: ${service.startTime} to ${service.endTime}\nPrice: ${service.price} USDC${meetingLink}\n\nBooking Portal Link: ${bookingPortalUrl}`;
      } catch (error) {
        return `${ERROR_MESSAGES.SERVICE_NOT_FOUND} Error: ${error instanceof Error ? error.message : String(error)}`;
      }
    } catch (error) {
      return `${ERROR_MESSAGES.BOOKING_FAILED} Error: ${error instanceof Error ? error.message : String(error)}`;
    }
  }

  /**
   * Record completion of a service
   */
  @CreateAction({
    name: SERVICE_MARKETPLACE_ACTION_NAMES.RECORD_SERVICE_COMPLETION,
    description: "Record the completion of a service with notes and rating",
    schema: RecordServiceCompletionSchema,
  })
  async recordServiceCompletion(
    walletProvider: EvmWalletProvider,
    args: z.infer<typeof RecordServiceCompletionSchema>
  ): Promise<string> {
    try {
      // Ensure agent client is initialized
      if (!this.agentClient) {
        return `${ERROR_MESSAGES.MISSING_CLIENT} Please create an agent client first.`;
      }

      // Ensure bookings bucket exists
      if (!this.bookingsBucket) {
        return "Bookings bucket not found.";
      }

      // Create transactions bucket if it doesn't exist
      if (!this.transactionsBucket) {
        const bucketManager = this.agentClient.bucketManager();
        const { result } = await bucketManager.create();
        this.transactionsBucket = result.bucket;
      }

      // Fetch the booking
      const bucketManager = this.agentClient.bucketManager();
      
      try {
        // Get the booking
        const bookingData = await bucketManager.get(
          this.bookingsBucket,
          `bookings/${args.bookingId}`
        );
        
        const bookingText = new TextDecoder().decode(bookingData.result);
        const booking = JSON.parse(bookingText) as Booking;
        
        // Update booking status
        booking.status = "completed";
        
        // Store updated booking
        const updatedBookingContent = new TextEncoder().encode(JSON.stringify(booking, null, 2));
        const updatedBookingFile = new File([updatedBookingContent], "booking.txt", {
          type: "text/plain",
        });
        
        await bucketManager.add(
          this.bookingsBucket,
          `bookings/${args.bookingId}`,
          updatedBookingFile
        );

        // Get the service details
        if (!this.serviceListingsBucket) {
          return "Service listings bucket not found.";
        }
        
        const serviceData = await bucketManager.get(
          this.serviceListingsBucket,
          `listings/${booking.serviceId}`
        );
        
        const serviceText = new TextDecoder().decode(serviceData.result);
        const service = JSON.parse(serviceText) as ServiceListing;
        
        // Update service status
        service.status = "completed";
        
        // Store updated service
        const updatedServiceContent = new TextEncoder().encode(JSON.stringify(service, null, 2));
        const updatedServiceFile = new File([updatedServiceContent], "service.txt", {
          type: "text/plain",
        });
        
        await bucketManager.add(
          this.serviceListingsBucket,
          `listings/${booking.serviceId}`,
          updatedServiceFile
        );

        // Record completion data
        const completionId = `completion_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        
        const completionRecord = {
          id: completionId,
          bookingId: args.bookingId,
          serviceId: service.id,
          completionTime: new Date().toISOString(),
          notes: args.notes,
          rating: args.rating,
          clientName: booking.clientName,
          providerName: service.providerName,
          serviceType: service.serviceType,
          price: service.price
        };
        
        const completionContent = new TextEncoder().encode(JSON.stringify(completionRecord, null, 2));
        const completionFile = new File([completionContent], "completion.txt", {
          type: "text/plain",
        });
        
        // Store in transactions bucket
        await bucketManager.add(
          this.transactionsBucket!, 
          `completions/${completionId}`, 
          completionFile,
          { 
            metadata: { 
              "content-type": "text/plain",
              "booking-id": completionRecord.bookingId,
              "service-id": completionRecord.serviceId,
              "completion-time": completionRecord.completionTime,
              "rating": (completionRecord.rating || 5).toString(),
              "client-name": completionRecord.clientName,
              "provider-name": completionRecord.providerName,
              "service-type": completionRecord.serviceType,
              "price": completionRecord.price.toString(),
              "notes": completionRecord.notes || "No notes provided"
            }
          }
        );

        const completionPortalUrl = `${RECALL_PORTAL_URLS[this.currentNetwork || "testnet"]}/buckets/${this.transactionsBucket}?path=completions%2F${args.bookingId}`;
        
        return `Service completion recorded successfully!\nBooking ID: ${args.bookingId}\nService: ${service.serviceType}\nProvider: ${service.providerName}\nClient: ${booking.clientName}\nRating: ${args.rating || 5}/5\n\nCompletion Record Portal Link: ${completionPortalUrl}`;
      } catch (error) {
        return `${ERROR_MESSAGES.INVALID_BOOKING_ID} Error: ${error instanceof Error ? error.message : String(error)}`;
      }
    } catch (error) {
      return `Failed to record service completion. Error: ${error instanceof Error ? error.message : String(error)}`;
    }
  }

  /**
   * Release funds to service provider
   */
  @CreateAction({
    name: SERVICE_MARKETPLACE_ACTION_NAMES.RELEASE_FUNDS,
    description: "Release funds to the service provider after successful completion",
    schema: ReleaseFundsSchema,
  })
  async releaseFundsToProvider(
    walletProvider: EvmWalletProvider,
    args: z.infer<typeof ReleaseFundsSchema>
  ): Promise<string> {
    try {
      // Ensure agent client is initialized
      if (!this.agentClient) {
        return `${ERROR_MESSAGES.MISSING_CLIENT} Please create an agent client first.`;
      }

      // Create transactions bucket if it doesn't exist
      if (!this.transactionsBucket) {
        const bucketManager = this.agentClient.bucketManager();
        const { result } = await bucketManager.create();
        this.transactionsBucket = result.bucket;
      }

      // Fetch the booking to get service and provider details
      if (!this.bookingsBucket) {
        return "Bookings bucket not found.";
      }

      const bucketManager = this.agentClient.bucketManager();
      
      try {
        // Get the booking
        const bookingData = await bucketManager.get(
          this.bookingsBucket,
          `bookings/${args.bookingId}`
        );
        
        const bookingText = new TextDecoder().decode(bookingData.result);
        const booking = JSON.parse(bookingText) as Booking;
        
        // Check if the service has been completed
        if (booking.status !== "completed") {
          return "Cannot release funds for a service that has not been marked as completed.";
        }

        // Get the service details
        if (!this.serviceListingsBucket) {
          return "Service listings bucket not found.";
        }
        
        const serviceData = await bucketManager.get(
          this.serviceListingsBucket,
          `listings/${booking.serviceId}`
        );
        
        const serviceText = new TextDecoder().decode(serviceData.result);
        const service = JSON.parse(serviceText) as ServiceListing;

        // Record payment data
        const paymentId = `payment_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        
        const paymentRecord = {
          id: paymentId,
          bookingId: args.bookingId,
          serviceId: service.id,
          paymentTime: new Date().toISOString(),
          amount: service.price,
          recipient: service.walletAddress,
          status: "completed",
          description: `Payment for ${service.serviceType} service from ${booking.clientName} to ${service.providerName}`
        };
        
        const paymentContent = new TextEncoder().encode(JSON.stringify(paymentRecord, null, 2));
        const paymentFile = new File([paymentContent], "payment.txt", {
          type: "text/plain",
        });
        
        // Store in transactions bucket
        await bucketManager.add(
          this.transactionsBucket!, 
          `payments/${paymentId}`, 
          paymentFile,
          { 
            metadata: { 
              "content-type": "text/plain",
              "booking-id": paymentRecord.bookingId,
              "service-id": paymentRecord.serviceId,
              "payment-time": paymentRecord.paymentTime,
              "amount": paymentRecord.amount.toString(),
              "recipient": paymentRecord.recipient,
              "status": paymentRecord.status,
              "description": paymentRecord.description || "Payment for service"
            }
          }
        );

        const paymentPortalUrl = `${RECALL_PORTAL_URLS[this.currentNetwork || "testnet"]}/buckets/${this.transactionsBucket}?path=payments%2F${args.bookingId}`;
        
        return `Funds released successfully!\nBooking ID: ${args.bookingId}\nAmount: ${args.amount} USDC\nRecipient: ${service.providerName} (${service.walletAddress})\nService: ${service.serviceType}\n\nPayment Record Portal Link: ${paymentPortalUrl}`;
      } catch (error) {
        return `${ERROR_MESSAGES.INVALID_BOOKING_ID} Error: ${error instanceof Error ? error.message : String(error)}`;
      }
    } catch (error) {
      return `Failed to release funds. Error: ${error instanceof Error ? error.message : String(error)}`;
    }
  }

  /**
   * Network support check
   */
  supportsNetwork = (network: Network): boolean => network.protocolFamily === "evm";
}

export const serviceMarketplaceActionProvider = () => new ServiceMarketplaceActionProvider(); 