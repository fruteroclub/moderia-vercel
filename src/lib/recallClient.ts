import { testnet } from "@recallnet/chains";
import { RecallClient } from "@recallnet/sdk/client";
import { createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { http } from "viem";

// Create a wallet client from a private key
export function createRecallClient() {
  const privateKey = process.env.AGENT_WALLET_PRIVATE_KEY as `0x${string}`;

  const walletClient = createWalletClient({
    account: privateKeyToAccount(privateKey),
    chain: testnet,
    transport: http(),
  });

  const client = new RecallClient({ walletClient });
  return client;
}
