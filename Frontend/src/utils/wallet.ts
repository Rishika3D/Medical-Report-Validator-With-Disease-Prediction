import { BrowserProvider, JsonRpcSigner } from 'ethers';

// Check if MetaMask is installed
export const isMetaMaskInstalled = (): boolean => {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
};

// Request account access
export const connectWallet = async (): Promise<string> => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    return accounts[0];
  } catch (error: any) {
    if (error.code === 4001) {
      throw new Error('Please connect to MetaMask.');
    }
    throw error;
  }
};

// Get current account
export const getCurrentAccount = async (): Promise<string | null> => {
  if (!isMetaMaskInstalled()) {
    return null;
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_accounts',
    });
    return accounts.length > 0 ? accounts[0] : null;
  } catch (error) {
    return null;
  }
};

// Get provider and signer
export const getProvider = (): BrowserProvider | null => {
  if (!isMetaMaskInstalled()) {
    return null;
  }
  return new BrowserProvider(window.ethereum);
};

export const getSigner = async (): Promise<JsonRpcSigner | null> => {
  const provider = getProvider();
  if (!provider) {
    return null;
  }
  return await provider.getSigner();
};

// Switch network
export const switchNetwork = async (chainId: number): Promise<void> => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
  } catch (error: any) {
    // If the chain doesn't exist, add it
    if (error.code === 4902) {
      throw new Error(`Network with chain ID ${chainId} not found. Please add it to MetaMask.`);
    }
    throw error;
  }
};

// Listen for account changes
export const onAccountsChanged = (callback: (accounts: string[]) => void): (() => void) => {
  if (!isMetaMaskInstalled()) {
    return () => {};
  }

  window.ethereum.on('accountsChanged', callback);
  return () => {
    window.ethereum.removeListener('accountsChanged', callback);
  };
};

// Listen for chain changes
export const onChainChanged = (callback: (chainId: string) => void): (() => void) => {
  if (!isMetaMaskInstalled()) {
    return () => {};
  }

  window.ethereum.on('chainChanged', callback);
  return () => {
    window.ethereum.removeListener('chainChanged', callback);
  };
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
      isMetaMask?: boolean;
    };
  }
}

