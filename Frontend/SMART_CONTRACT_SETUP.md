# Smart Contract Integration Guide

This guide explains how to connect your Medical.sol (ReportValidator) smart contract to the frontend.

## Prerequisites

1. **MetaMask Extension**: Install [MetaMask](https://metamask.io/download/) browser extension
2. **Deployed Contract**: Your contract should be deployed and you should have:
   - Contract address
   - Network RPC URL
   - Chain ID

## Configuration

### 1. Environment Variables

Create a `.env` file in the `Frontend` directory:

```env
VITE_CONTRACT_ADDRESS=0xYourContractAddressHere
VITE_RPC_URL=http://localhost:8545
VITE_CHAIN_ID=31337
```

**For different networks:**

- **Local Hardhat**: `http://localhost:8545`, Chain ID: `31337`
- **Sepolia Testnet**: `https://sepolia.infura.io/v3/YOUR_KEY`, Chain ID: `11155111`
- **Mainnet**: `https://mainnet.infura.io/v3/YOUR_KEY`, Chain ID: `1`

### 2. Get Contract Address

Your contract address should be in your backend `.env` file as `CONTRACT_ADDRESS`. Copy that value to `VITE_CONTRACT_ADDRESS` in the frontend `.env`.

## Usage

### Basic Wallet Connection

```tsx
import { WalletConnect } from './components/WalletConnect';

function App() {
  return (
    <div>
      <WalletConnect />
    </div>
  );
}
```

### Using Contract Hooks

```tsx
import { useWallet } from './hooks/useWallet';
import { useContract } from './hooks/useContract';

function MyComponent() {
  const { account, isConnected, connect } = useWallet();
  const { getReportsCount, getLatestReport, uploadReport } = useContract();

  // Get reports count
  const loadCount = async () => {
    if (isConnected) {
      const count = await getReportsCount();
      console.log('Reports count:', count);
    }
  };

  // Get latest report
  const loadReport = async () => {
    if (isConnected) {
      const report = await getLatestReport();
      console.log('Latest report:', report);
    }
  };

  return (
    <div>
      {!isConnected && <button onClick={connect}>Connect Wallet</button>}
      {isConnected && (
        <>
          <p>Connected: {account}</p>
          <button onClick={loadCount}>Get Reports Count</button>
          <button onClick={loadReport}>Get Latest Report</button>
        </>
      )}
    </div>
  );
}
```

### Direct Contract Service Usage

```tsx
import { contractService } from './services/contractService';

// Initialize contract (read-only)
await contractService.initialize(false);

// Get reports count
const count = await contractService.getReportsCount('0x...');

// Get latest report
const report = await contractService.getLatestReport('0x...');

// Verify report
const isValid = await contractService.verifyReport('0x...', 0, '0x...hash');

// Upload report (requires signer)
await contractService.initialize(true); // Use signer
const result = await contractService.uploadReport(
  '0xSubjectAddress',
  '0xContentHash',
  '0xCIDBytes'
);
```

## Contract Functions

### Read Functions (View)

- **`getReportsCount(address user)`**: Get the number of reports for a user
- **`getLatestReport(address user)`**: Get the latest report for a user
- **`verifyReport(address user, uint256 index, bytes32 expectedHash)`**: Verify if a report hash matches

### Write Functions (Require UPLOADER_ROLE)

- **`uploadReport(address subject, bytes32 contentHash, bytes cidBytes)`**: Upload a new report

**Note**: Only addresses with `UPLOADER_ROLE` can upload reports. This role is typically granted by the contract admin.

## Events

Listen to `ReportUploaded` events:

```tsx
const cleanup = contractService.onReportUploaded(
  (uploader, subject, contentHash, cid, timestamp) => {
    console.log('New report uploaded:', { uploader, subject, contentHash });
  }
);

// Cleanup when done
cleanup();
```

## Example Component

See `ContractExample.tsx` for a complete example showing:
- Wallet connection
- Reading contract data
- Verifying reports
- Uploading reports (if you have UPLOADER_ROLE)

## Troubleshooting

### "MetaMask is not installed"
- Install the MetaMask browser extension
- Refresh the page

### "Contract not initialized"
- Make sure your wallet is connected
- Check that `VITE_CONTRACT_ADDRESS` is set correctly

### "Network with chain ID X not found"
- Add the network to MetaMask manually
- Or use `switchNetwork()` utility function

### "AccessControlUnauthorizedAccount"
- You don't have the required role (UPLOADER_ROLE) to upload reports
- Contact the contract admin to grant you the role

### Transaction Fails
- Check you have enough ETH for gas
- Verify you're on the correct network
- Ensure you have the required permissions (UPLOADER_ROLE)

## Integration with Backend

The backend already handles contract interactions for uploads. The frontend integration allows:
- Users to verify their own reports
- View report counts
- Direct blockchain interaction (if they have permissions)

For production, you may want to keep uploads through the backend API for better security and gas management.

