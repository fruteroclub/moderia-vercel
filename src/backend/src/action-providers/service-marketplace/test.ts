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

async function main() {
  console.log("Testing Service Marketplace with direct Recall SDK...");
  
  try {
    // 1. Set up clients
    const agentPrivateKey = process.env.WALLET_PRIVATE_KEY_AGENT;
    const providerPrivateKey = process.env.WALLET_PRIVATE_KEY_PROVIDER;
    const clientPrivateKey = process.env.WALLET_PRIVATE_KEY_CLIENT;
    
    if (!agentPrivateKey || !providerPrivateKey || !clientPrivateKey) {
      console.error("Missing private keys in environment variables!");
      process.exit(1);
    }
    
    // Create agent client
    console.log("\nCreating agent client...");
    const agentWalletClient = createWalletClient({
      account: privateKeyToAccount(agentPrivateKey as `0x${string}`),
      chain: testnet,
      transport: http(),
    });
    const agentClient = new RecallClient({ walletClient: agentWalletClient });
    console.log(`Agent address: ${agentWalletClient.account.address}`);
    
    // Create provider client
    console.log("\nCreating provider client...");
    const providerWalletClient = createWalletClient({
      account: privateKeyToAccount(providerPrivateKey as `0x${string}`),
      chain: testnet,
      transport: http(),
    });
    const providerClient = new RecallClient({ walletClient: providerWalletClient });
    console.log(`Provider address: ${providerWalletClient.account.address}`);
    
    // Create client client
    console.log("\nCreating client client...");
    const clientWalletClient = createWalletClient({
      account: privateKeyToAccount(clientPrivateKey as `0x${string}`),
      chain: testnet,
      transport: http(),
    });
    const clientClient = new RecallClient({ walletClient: clientWalletClient });
    console.log(`Client address: ${clientWalletClient.account.address}`);

    // Purchase credits for each client
    console.log("\nPurchasing credits for provider...");
    const providerCreditManager = providerClient.creditManager();
    const { meta: providerCreditMeta } = await providerCreditManager.buy(parseEther("0.01"));
    console.log(`Provider credits purchased. Transaction hash: ${providerCreditMeta?.tx?.transactionHash}`);
    
    console.log("\nPurchasing credits for agent...");
    const agentCreditManager = agentClient.creditManager();
    const { meta: agentCreditMeta } = await agentCreditManager.buy(parseEther("0.01"));
    console.log(`Agent credits purchased. Transaction hash: ${agentCreditMeta?.tx?.transactionHash}`);
    
    console.log("\nPurchasing credits for client...");
    const clientCreditManager = clientClient.creditManager();
    const { meta: clientCreditMeta } = await clientCreditManager.buy(parseEther("0.01"));
    console.log(`Client credits purchased. Transaction hash: ${clientCreditMeta?.tx?.transactionHash}`);

    // 2. Create service listings bucket (provider)
    console.log("\nCreating service listings bucket...");
    const providerBucketManager = providerClient.bucketManager();
    const { result: serviceListingsResult } = await providerBucketManager.create();
    const serviceListingsBucket = serviceListingsResult.bucket;
    console.log(`Service listings bucket created: ${serviceListingsBucket}`);

    // 3. Create a service listing
    console.log("\nCreating service listing...");
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
    
    await providerBucketManager.add(
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
          "description": serviceListing.description,
          "start-time": serviceListing.startTime,
          "end-time": serviceListing.endTime
        }
      }
    );
    console.log(`Service listing created with ID: ${serviceId}`);

    // 4. Create bookings bucket (agent)
    console.log("\nCreating bookings bucket...");
    const agentBucketManager = agentClient.bucketManager();
    const { result: bookingsResult } = await agentBucketManager.create();
    const bookingsBucket = bookingsResult.bucket;
    console.log(`Bookings bucket created: ${bookingsBucket}`);

    // 5. Book the service (client)
    console.log("\nBooking the service...");
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
    
    await agentBucketManager.add(
      bookingsBucket,
      `bookings/${bookingId}`,
      bookingFile,
      { 
        metadata: { 
          "content-type": "text/plain",
          "service-id": booking.serviceId,
          "client-name": booking.clientName,
          "client-email": booking.clientEmail,
          "status": booking.status,
          "booking-time": booking.bookingTime,
          "special-requests": booking.specialRequests
        }
      }
    );
    console.log(`Booking created with ID: ${bookingId}`);

    // 6. Update service status to booked
    console.log("\nUpdating service status to booked...");
    serviceListing.status = "booked";
    const updatedServiceContent = new TextEncoder().encode(JSON.stringify(serviceListing, null, 2));
    const updatedServiceFile = new File([updatedServiceContent], "service.txt", {
      type: "text/plain",
    });
    
    await providerBucketManager.add(
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
          "description": serviceListing.description,
          "start-time": serviceListing.startTime,
          "end-time": serviceListing.endTime
        },
        overwrite: true
      }
    );
    console.log("Service status updated to booked");

    // 7. Create transactions bucket (agent)
    console.log("\nCreating transactions bucket...");
    const { result: transactionsResult } = await agentBucketManager.create();
    const transactionsBucket = transactionsResult.bucket;
    console.log(`Transactions bucket created: ${transactionsBucket}`);

    // 8. Record service completion
    console.log("\nRecording service completion...");
    booking.status = "completed";
    const updatedBookingContent = new TextEncoder().encode(JSON.stringify(booking, null, 2));
    const updatedBookingFile = new File([updatedBookingContent], "booking.txt", {
      type: "text/plain",
    });
    
    await agentBucketManager.add(
      bookingsBucket,
      `bookings/${bookingId}`,
      updatedBookingFile,
      { 
        metadata: { 
          "content-type": "text/plain",
          "service-id": booking.serviceId,
          "client-name": booking.clientName,
          "client-email": booking.clientEmail,
          "status": booking.status,
          "booking-time": booking.bookingTime,
          "special-requests": booking.specialRequests
        },
        overwrite: true
      }
    );
    
    serviceListing.status = "completed";
    const completedServiceContent = new TextEncoder().encode(JSON.stringify(serviceListing, null, 2));
    const completedServiceFile = new File([completedServiceContent], "service.txt", {
      type: "text/plain",
    });
    
    await providerBucketManager.add(
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
          "description": serviceListing.description,
          "start-time": serviceListing.startTime,
          "end-time": serviceListing.endTime
        },
        overwrite: true
      }
    );
    
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
    
    await agentBucketManager.add(
      transactionsBucket,
      `completions/${bookingId}`,
      completionRecordFile,
      { 
        metadata: { 
          "content-type": "text/plain",
          "service-id": completionRecord.serviceId,
          "booking-id": completionRecord.bookingId,
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
    console.log("Service completion recorded");

    // 9. Record payment transaction
    console.log("\nRecording payment transaction...");
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
    
    await agentBucketManager.add(
      transactionsBucket,
      `payments/${bookingId}`,
      paymentRecordFile,
      { 
        metadata: { 
          "content-type": "text/plain",
          "booking-id": paymentRecord.bookingId,
          "service-id": paymentRecord.serviceId,
          "transaction-time": paymentRecord.transactionTime,
          "payment-amount": paymentRecord.paymentAmount.toString(),
          "recipient": paymentRecord.recipient,
          "status": paymentRecord.status,
          "description": "Payment for service"
        }
      }
    );
    console.log("Payment transaction recorded");

    // 10. Verify stored data is readable directly from the blockchain
    console.log("\nVerifying stored data is human-readable...");
    
    // Fetch the service listing and display its content
    console.log("\nRetrieving service listing...");
    const retrievedServiceData = await providerBucketManager.get(
      serviceListingsBucket,
      `listings/${serviceId}`
    );
    const retrievedServiceText = new TextDecoder().decode(retrievedServiceData.result);
    console.log("Service Listing Content:");
    console.log(retrievedServiceText);
    
    // Fetch the booking and display its content
    console.log("\nRetrieving booking...");
    const retrievedBookingData = await agentBucketManager.get(
      bookingsBucket,
      `bookings/${bookingId}`
    );
    const retrievedBookingText = new TextDecoder().decode(retrievedBookingData.result);
    console.log("Booking Content:");
    console.log(retrievedBookingText);
    
    // Fetch the payment record and display its content
    console.log("\nRetrieving payment record...");
    const retrievedPaymentData = await agentBucketManager.get(
      transactionsBucket,
      `payments/${bookingId}`
    );
    const retrievedPaymentText = new TextDecoder().decode(retrievedPaymentData.result);
    console.log("Payment Record Content:");
    console.log(retrievedPaymentText);

    console.log("\nAll operations completed successfully!");
    
    console.log("\nSummary:");
    console.log(`Service Listings Bucket: ${serviceListingsBucket}`);
    console.log(`Bookings Bucket: ${bookingsBucket}`);
    console.log(`Transactions Bucket: ${transactionsBucket}`);
    console.log(`Service ID: ${serviceId}`);
    console.log(`Booking ID: ${bookingId}`);
    
    console.log("\nPortal URLs:");
    console.log(`Service Listing: https://portal.recall.network/buckets/${serviceListingsBucket}?path=listings%2F${serviceId}`);
    console.log(`Booking: https://portal.recall.network/buckets/${bookingsBucket}?path=bookings%2F${bookingId}`);
    console.log(`Payment: https://portal.recall.network/buckets/${transactionsBucket}?path=payments%2F${bookingId}`);

  } catch (error) {
    console.error("Test failed:", error);
  }
}

main(); 