import { testnet } from "@recallnet/chains";
import { RecallClient } from "@recallnet/sdk/client";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function main() {
  try {
    // Get private key from environment variables
    const privateKey = process.env.WALLET_PRIVATE_KEY;
    
    if (!privateKey) {
      console.error("Missing WALLET_PRIVATE_KEY in environment variables");
      process.exit(1);
    }

    console.log("Creating wallet client...");
    
    // Create a wallet client from the private key
    const walletClient = createWalletClient({
      account: privateKeyToAccount(privateKey as `0x${string}`),
      chain: testnet,
      transport: http(),
    });
    
    console.log("Wallet address:", walletClient.account.address);

    // Create a Recall client from the wallet client
    console.log("Creating Recall client...");
    const client = new RecallClient({ walletClient });
    
    console.log("Recall client created successfully!");
    
    // Here you could add more test operations like storing or retrieving data
    
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main(); 