// Contract configuration
export const CONTRACT_CONFIG = {
  // Update this with your deployed contract address
  // You can get this from your backend .env file (CONTRACT_ADDRESS)
  ADDRESS: import.meta.env.VITE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
  
  // RPC URL - Update with your network (local, testnet, mainnet)
  RPC_URL: import.meta.env.VITE_RPC_URL || 'http://localhost:8545',
  
  // Chain ID - Update based on your network
  CHAIN_ID: import.meta.env.VITE_CHAIN_ID ? parseInt(import.meta.env.VITE_CHAIN_ID) : 31337, // Default to Hardhat local
};

