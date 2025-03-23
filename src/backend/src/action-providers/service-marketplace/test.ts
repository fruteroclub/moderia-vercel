/**
 * Simple test script for the service marketplace action provider
 * 
 * This script demonstrates the basic flow of creating and using the
 * service marketplace functionality.
 * 
 * To run this file directly, you need to compile it first:
 * tsc -m ESNext -t ES2020 test.ts
 * node test.js
 */

import { testnet } from "@recallnet/chains";
import { RecallClient } from "@recallnet/sdk/client";
import { createWalletClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Constants for URLs
const PORTAL_URL = "https://portal.recall.network";
const EXPLORER_URL = "https://explorer.testnet.recall.network";

// ANSI color codes for better terminal output
const COLORS = {
  RESET: "\x1b[0m",
  BRIGHT: "\x1b[1m",
  DIM: "\x1b[2m",
  UNDERSCORE: "\x1b[4m",
  BLINK: "\x1b[5m",
  REVERSE: "\x1b[7m",
  HIDDEN: "\x1b[8m",
  BLACK: "\x1b[30m",
  RED: "\x1b[31m",
  GREEN: "\x1b[32m",
  YELLOW: "\x1b[33m",
  BLUE: "\x1b[34m",
  MAGENTA: "\x1b[35m",
  CYAN: "\x1b[36m",
  WHITE: "\x1b[37m",
  BG_BLACK: "\x1b[40m",
  BG_RED: "\x1b[41m",
  BG_GREEN: "\x1b[42m",
  BG_YELLOW: "\x1b[43m",
  BG_BLUE: "\x1b[44m",
  BG_MAGENTA: "\x1b[45m",
  BG_CYAN: "\x1b[46m",
  BG_WHITE: "\x1b[47m"
};

/**
 * Format portal URL with nice formatting
 */
function formatPortalLink(bucket: string, path?: string, label?: string): string {
  const displayLabel = label || "Portal";
  let url = `${PORTAL_URL}/buckets/${bucket}`;
  if (path) {
    url += `?path=${encodeURIComponent(path)}`;
  }
  return `${COLORS.BRIGHT}${COLORS.CYAN}${displayLabel}:${COLORS.RESET} ${url}`;
}

/**
 * Format explorer URL with nice formatting
 */
function formatExplorerLink(txHash: string): string {
  const url = `${EXPLORER_URL}/tx/${txHash}`;
  return `${COLORS.BRIGHT}${COLORS.YELLOW}Explorer:${COLORS.RESET} ${url}`;
}

/**
 * Print header with color 
 */
function printHeader(text: string): void {
  console.log(`\n${COLORS.BRIGHT}${COLORS.GREEN}${text}${COLORS.RESET}`);
  console.log("═".repeat(text.length));
}

/**
 * Print JSON data with nice formatting
 */
function printJson(label: string, data: any): void {
  console.log(`${COLORS.BRIGHT}${label}:${COLORS.RESET}`);
  console.log(JSON.stringify(data, null, 2));
}

async function main() {
  console.log(`${COLORS.BRIGHT}${COLORS.MAGENTA}Testing Service Marketplace with direct Recall SDK...${COLORS.RESET}\n`);
  
  try {
    // 1. Set up clients
    const agentPrivateKey = process.env.WALLET_PRIVATE_KEY_AGENT;
    const providerPrivateKey = process.env.WALLET_PRIVATE_KEY_PROVIDER;
    const clientPrivateKey = process.env.WALLET_PRIVATE_KEY_CLIENT;
    
    if (!agentPrivateKey || !providerPrivateKey || !clientPrivateKey) {
      console.error(`${COLORS.RED}Missing private keys in environment variables!${COLORS.RESET}`);
      process.exit(1);
    }
    
    // Create agent client
    printHeader("Creating agent client");
    const agentWalletClient = createWalletClient({
      account: privateKeyToAccount(agentPrivateKey as `0x${string}`),
      chain: testnet,
      transport: http(),
    });
    const agentClient = new RecallClient({ walletClient: agentWalletClient });
    console.log(`${COLORS.BRIGHT}Agent address:${COLORS.RESET} ${agentWalletClient.account.address}`);
    console.log(`${COLORS.BRIGHT}${COLORS.YELLOW}Explorer:${COLORS.RESET} ${EXPLORER_URL}/address/${agentWalletClient.account.address}`);
    
    // Create provider client
    printHeader("Creating provider client");
    const providerWalletClient = createWalletClient({
      account: privateKeyToAccount(providerPrivateKey as `0x${string}`),
      chain: testnet,
      transport: http(),
    });
    const providerClient = new RecallClient({ walletClient: providerWalletClient });
    console.log(`${COLORS.BRIGHT}Provider address:${COLORS.RESET} ${providerWalletClient.account.address}`);
    console.log(`${COLORS.BRIGHT}${COLORS.YELLOW}Explorer:${COLORS.RESET} ${EXPLORER_URL}/address/${providerWalletClient.account.address}`);
    
    // Create client client
    printHeader("Creating client client");
    const clientWalletClient = createWalletClient({
      account: privateKeyToAccount(clientPrivateKey as `0x${string}`),
      chain: testnet,
      transport: http(),
    });
    const clientClient = new RecallClient({ walletClient: clientWalletClient });
    console.log(`${COLORS.BRIGHT}Client address:${COLORS.RESET} ${clientWalletClient.account.address}`);
    console.log(`${COLORS.BRIGHT}${COLORS.YELLOW}Explorer:${COLORS.RESET} ${EXPLORER_URL}/address/${clientWalletClient.account.address}`);

    // Purchase credits for each client
    printHeader("Purchasing credits for provider");
    const providerCreditManager = providerClient.creditManager();
    const { meta: providerCreditMeta } = await providerCreditManager.buy(parseEther("0.01"));
    console.log(`${COLORS.BRIGHT}Credits purchased!${COLORS.RESET}`);
    if (providerCreditMeta?.tx?.transactionHash) {
      console.log(formatExplorerLink(providerCreditMeta.tx.transactionHash));
    }
    
    printHeader("Purchasing credits for agent");
    const agentCreditManager = agentClient.creditManager();
    const { meta: agentCreditMeta } = await agentCreditManager.buy(parseEther("0.01"));
    console.log(`${COLORS.BRIGHT}Credits purchased!${COLORS.RESET}`);
    if (agentCreditMeta?.tx?.transactionHash) {
      console.log(formatExplorerLink(agentCreditMeta.tx.transactionHash));
    }
    
    printHeader("Purchasing credits for client");
    const clientCreditManager = clientClient.creditManager();
    const { meta: clientCreditMeta } = await clientCreditManager.buy(parseEther("0.01"));
    console.log(`${COLORS.BRIGHT}Credits purchased!${COLORS.RESET}`);
    if (clientCreditMeta?.tx?.transactionHash) {
      console.log(formatExplorerLink(clientCreditMeta.tx.transactionHash));
    }

    // 2. Create service listings bucket (provider)
    printHeader("Creating service listings bucket");
    const providerBucketManager = providerClient.bucketManager();
    const { result: serviceListingsResult, meta: serviceListingsMeta } = await providerBucketManager.create();
    const serviceListingsBucket = serviceListingsResult.bucket;
    console.log(`${COLORS.BRIGHT}Service listings bucket created:${COLORS.RESET} ${serviceListingsBucket}`);
    console.log(formatPortalLink(serviceListingsBucket));
    if (serviceListingsMeta?.tx?.transactionHash) {
      console.log(formatExplorerLink(serviceListingsMeta.tx.transactionHash));
    }

    // 3. Create a service listing
    printHeader("Creating service listing");
    const serviceId = `service_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const serviceListing = {
      serviceType: "French language teaching",
      providerName: "Jean Francois",
      startTime: "2025-03-24T18:00:00.000Z",
      endTime: "2025-03-24T19:00:00.000Z",
      price: 10.55,
      walletAddress: providerWalletClient.account.address,
      meetingLink: "https://meet.google.com/fake-meeting-link",
      description: "Beginner level French language class",
      status: "available",
      id: serviceId
    };
    
    // Store as human-readable text (JSON with indentation)
    const serviceContent = new TextEncoder().encode(JSON.stringify(serviceListing, null, 2));
    const serviceFile = new File([serviceContent], "service.txt", {
      type: "text/plain",
    });
    
    const { meta: serviceAddMeta } = await providerBucketManager.add(
      serviceListingsBucket,
      `listings/${serviceId}`,
      serviceFile,
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
    console.log(`${COLORS.BRIGHT}Service listing created with ID:${COLORS.RESET} ${serviceId}`);
    console.log(formatPortalLink(serviceListingsBucket, `listings/${serviceId}`, "Service Listing Portal"));
    if (serviceAddMeta?.tx?.transactionHash) {
      console.log(formatExplorerLink(serviceAddMeta.tx.transactionHash));
    }

    // 4. Create bookings bucket (agent)
    printHeader("Creating bookings bucket");
    const agentBucketManager = agentClient.bucketManager();
    const { result: bookingsResult, meta: bookingsMeta } = await agentBucketManager.create();
    const bookingsBucket = bookingsResult.bucket;
    console.log(`${COLORS.BRIGHT}Bookings bucket created:${COLORS.RESET} ${bookingsBucket}`);
    console.log(formatPortalLink(bookingsBucket));
    if (bookingsMeta?.tx?.transactionHash) {
      console.log(formatExplorerLink(bookingsMeta.tx.transactionHash));
    }

    // 5. Book the service (client)
    printHeader("Booking the service");
    const bookingId = `booking_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const booking = {
      serviceId: serviceId,
      clientName: "Pedro Musk",
      clientEmail: "pedro@example.com",
      specialRequests: "I would like to focus on conversational French",
      bookingTime: new Date().toISOString(),
      status: "confirmed",
      id: bookingId
    };
    
    // Store booking as human-readable text
    const bookingContent = new TextEncoder().encode(JSON.stringify(booking, null, 2));
    const bookingFile = new File([bookingContent], "booking.txt", {
      type: "text/plain",
    });
    
    const { meta: bookingAddMeta } = await agentBucketManager.add(
      bookingsBucket,
      `bookings/${bookingId}`,
      bookingFile,
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
    console.log(`${COLORS.BRIGHT}Booking created with ID:${COLORS.RESET} ${bookingId}`);
    console.log(formatPortalLink(bookingsBucket, `bookings/${bookingId}`, "Booking Portal"));
    if (bookingAddMeta?.tx?.transactionHash) {
      console.log(formatExplorerLink(bookingAddMeta.tx.transactionHash));
    }

    // 6. Update service status to booked
    printHeader("Updating service status to booked");
    serviceListing.status = "booked";
    const updatedServiceContent = new TextEncoder().encode(JSON.stringify(serviceListing, null, 2));
    const updatedServiceFile = new File([updatedServiceContent], "service.txt", {
      type: "text/plain",
    });
    
    const { meta: updateServiceMeta } = await providerBucketManager.add(
      serviceListingsBucket,
      `listings/${serviceId}`,
      updatedServiceFile,
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
        },
        overwrite: true
      }
    );
    console.log(`${COLORS.BRIGHT}Service status updated to:${COLORS.RESET} ${serviceListing.status}`);
    console.log(formatPortalLink(serviceListingsBucket, `listings/${serviceId}`, "Updated Service Portal"));
    if (updateServiceMeta?.tx?.transactionHash) {
      console.log(formatExplorerLink(updateServiceMeta.tx.transactionHash));
    }

    // 7. Create transactions bucket (agent)
    printHeader("Creating transactions bucket");
    const { result: transactionsResult, meta: transactionsMeta } = await agentBucketManager.create();
    const transactionsBucket = transactionsResult.bucket;
    console.log(`${COLORS.BRIGHT}Transactions bucket created:${COLORS.RESET} ${transactionsBucket}`);
    console.log(formatPortalLink(transactionsBucket));
    if (transactionsMeta?.tx?.transactionHash) {
      console.log(formatExplorerLink(transactionsMeta.tx.transactionHash));
    }

    // 8. Record service completion
    printHeader("Recording service completion");
    booking.status = "completed";
    const updatedBookingContent = new TextEncoder().encode(JSON.stringify(booking, null, 2));
    const updatedBookingFile = new File([updatedBookingContent], "booking.txt", {
      type: "text/plain",
    });
    
    const { meta: updateBookingMeta } = await agentBucketManager.add(
      bookingsBucket,
      `bookings/${bookingId}`,
      updatedBookingFile,
      { 
        metadata: { 
          "content-type": "text/plain",
          "service-id": booking.serviceId,
          "client-name": booking.clientName,
          "client-email": booking.clientEmail || "",
          "status": booking.status,
          "booking-time": booking.bookingTime,
          "special-requests": booking.specialRequests || ""
        },
        overwrite: true
      }
    );
    
    serviceListing.status = "completed";
    const completedServiceContent = new TextEncoder().encode(JSON.stringify(serviceListing, null, 2));
    const completedServiceFile = new File([completedServiceContent], "service.txt", {
      type: "text/plain",
    });
    
    const { meta: completeServiceMeta } = await providerBucketManager.add(
      serviceListingsBucket,
      `listings/${serviceId}`,
      completedServiceFile,
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
        },
        overwrite: true
      }
    );
    
    const completionId = `completion_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const completionRecord = {
      bookingId: bookingId,
      serviceId: serviceId,
      completionTime: new Date().toISOString(),
      notes: "Excellent session, client made good progress",
      rating: 5,
      clientName: booking.clientName,
      providerName: serviceListing.providerName,
      serviceType: serviceListing.serviceType,
      price: serviceListing.price
    };
    
    const completionRecordContent = new TextEncoder().encode(JSON.stringify(completionRecord, null, 2));
    const completionRecordFile = new File([completionRecordContent], "completion.txt", {
      type: "text/plain",
    });
    
    const { meta: completionMeta } = await agentBucketManager.add(
      transactionsBucket,
      `completions/${completionId}`,
      completionRecordFile,
      { 
        metadata: { 
          "content-type": "text/plain",
          "booking-id": completionRecord.bookingId,
          "service-id": completionRecord.serviceId,
          "completion-time": completionRecord.completionTime,
          "rating": completionRecord.rating.toString(),
          "client-name": completionRecord.clientName,
          "provider-name": completionRecord.providerName,
          "service-type": completionRecord.serviceType,
          "price": completionRecord.price.toString(),
          "notes": completionRecord.notes
        }
      }
    );
    console.log(`${COLORS.BRIGHT}Service completion recorded with ID:${COLORS.RESET} ${completionId}`);
    console.log(formatPortalLink(bookingsBucket, `bookings/${bookingId}`, "Updated Booking Portal"));
    console.log(formatPortalLink(transactionsBucket, `completions/${completionId}`, "Completion Record Portal"));
    if (completionMeta?.tx?.transactionHash) {
      console.log(formatExplorerLink(completionMeta.tx.transactionHash));
    }

    // 9. Record payment transaction
    printHeader("Recording payment transaction");
    const paymentId = `payment_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const paymentRecord = {
      bookingId: bookingId,
      serviceId: serviceId,
      transactionTime: new Date().toISOString(),
      paymentAmount: serviceListing.price,
      recipient: serviceListing.walletAddress,
      status: "completed",
      description: `Payment for ${serviceListing.serviceType} service from ${booking.clientName} to ${serviceListing.providerName}`
    };
    
    const paymentRecordContent = new TextEncoder().encode(JSON.stringify(paymentRecord, null, 2));
    const paymentRecordFile = new File([paymentRecordContent], "payment.txt", {
      type: "text/plain",
    });
    
    const { meta: paymentMeta } = await agentBucketManager.add(
      transactionsBucket,
      `payments/${paymentId}`,
      paymentRecordFile,
      { 
        metadata: { 
          "content-type": "text/plain",
          "booking-id": paymentRecord.bookingId,
          "service-id": paymentRecord.serviceId,
          "payment-time": paymentRecord.transactionTime,
          "amount": paymentRecord.paymentAmount.toString(),
          "recipient": paymentRecord.recipient,
          "status": paymentRecord.status,
          "description": "Payment for service"
        }
      }
    );
    console.log(`${COLORS.BRIGHT}Payment transaction recorded with ID:${COLORS.RESET} ${paymentId}`);
    console.log(formatPortalLink(transactionsBucket, `payments/${paymentId}`, "Payment Record Portal"));
    if (paymentMeta?.tx?.transactionHash) {
      console.log(formatExplorerLink(paymentMeta.tx.transactionHash));
    }

    // 10. Verify stored data is readable directly from the blockchain
    printHeader("Verifying stored data is human-readable");
    
    // Fetch the service listing and display its content
    console.log(`\n${COLORS.BRIGHT}${COLORS.GREEN}Retrieving service listing${COLORS.RESET}`);
    const retrievedServiceData = await providerBucketManager.get(
      serviceListingsBucket,
      `listings/${serviceId}`
    );
    const retrievedServiceText = new TextDecoder().decode(retrievedServiceData.result);
    printJson("Service Listing Content", JSON.parse(retrievedServiceText));
    
    // Fetch the booking and display its content
    console.log(`\n${COLORS.BRIGHT}${COLORS.GREEN}Retrieving booking${COLORS.RESET}`);
    const retrievedBookingData = await agentBucketManager.get(
      bookingsBucket,
      `bookings/${bookingId}`
    );
    const retrievedBookingText = new TextDecoder().decode(retrievedBookingData.result);
    printJson("Booking Content", JSON.parse(retrievedBookingText));
    
    // Fetch the payment record and display its content
    console.log(`\n${COLORS.BRIGHT}${COLORS.GREEN}Retrieving payment record${COLORS.RESET}`);
    const retrievedPaymentData = await agentBucketManager.get(
      transactionsBucket,
      `payments/${paymentId}`
    );
    const retrievedPaymentText = new TextDecoder().decode(retrievedPaymentData.result);
    printJson("Payment Record Content", JSON.parse(retrievedPaymentText));

    // Print summary with all important links
    printHeader("All operations completed successfully!");
    
    console.log(`\n${COLORS.BRIGHT}${COLORS.MAGENTA}SERVICE MARKETPLACE SUMMARY${COLORS.RESET}`);
    console.log(`${COLORS.BRIGHT}Service Listings Bucket:${COLORS.RESET} ${serviceListingsBucket}`);
    console.log(`${COLORS.BRIGHT}Bookings Bucket:${COLORS.RESET} ${bookingsBucket}`);
    console.log(`${COLORS.BRIGHT}Transactions Bucket:${COLORS.RESET} ${transactionsBucket}`);
    console.log(`${COLORS.BRIGHT}Service ID:${COLORS.RESET} ${serviceId}`);
    console.log(`${COLORS.BRIGHT}Booking ID:${COLORS.RESET} ${bookingId}`);
    console.log(`${COLORS.BRIGHT}Completion ID:${COLORS.RESET} ${completionId}`);
    console.log(`${COLORS.BRIGHT}Payment ID:${COLORS.RESET} ${paymentId}`);
    
    console.log(`\n${COLORS.BRIGHT}${COLORS.MAGENTA}PORTAL LINKS${COLORS.RESET}`);
    console.log(formatPortalLink(serviceListingsBucket, `listings/${serviceId}`, "Service Listing"));
    console.log(formatPortalLink(bookingsBucket, `bookings/${bookingId}`, "Booking"));
    console.log(formatPortalLink(transactionsBucket, `completions/${completionId}`, "Completion Record"));
    console.log(formatPortalLink(transactionsBucket, `payments/${paymentId}`, "Payment Record"));
    
    // Link to see the bucket contents
    console.log(`\n${COLORS.BRIGHT}${COLORS.MAGENTA}BUCKET BROWSERS${COLORS.RESET}`);
    console.log(formatPortalLink(serviceListingsBucket, undefined, "Browse All Services"));
    console.log(formatPortalLink(bookingsBucket, undefined, "Browse All Bookings"));
    console.log(formatPortalLink(transactionsBucket, undefined, "Browse All Transactions"));

  } catch (error) {
    console.error(`${COLORS.RED}Test failed:${COLORS.RESET}`, error);
  }
}

main(); 