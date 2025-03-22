import { recallClient, getWalletClient, getNetwork, getPublicClient } from '../client.js';
import { formatEther } from 'viem';

async function testWallet() {
  try {
    const wallet = getWalletClient();
    const network = getNetwork();
    const publicClient = getPublicClient();
    
    console.log('\nWallet Test Results:');
    console.log('-------------------');
    console.log('Network:', network.name);
    console.log('Chain ID:', network.id);
    
    // Get wallet address
    const address = wallet.account.address;
    console.log('Wallet Address:', address);
    
    // Get account balance
    const balance = await publicClient.getBalance({ address });
    console.log('Balance:', formatEther(balance), 'ETH');
    
    // Test Recall client
    console.log('\nRecall Client Test:');
    console.log('------------------');
    const client = recallClient;
    
    // Test bucket creation (this will require credits)
    try {
      const bucketManager = client.bucketManager();
      console.log('Bucket Manager initialized successfully');
      
      // Get credit balance
      const creditManager = client.creditManager();
      console.log('Credit Manager initialized successfully');
      
    } catch (error) {
      console.error('Error initializing Recall managers:', error);
    }
    
  } catch (error) {
    console.error('\nError during wallet test:', error);
  }
}

// Run the test
testWallet().then(() => {
  console.log('\nTest completed!');
}).catch((error) => {
  console.error('\nTest failed:', error);
}); 