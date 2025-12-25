import { useState, useEffect, useCallback } from 'react';
import {
  connectWallet,
  getCurrentAccount,
  onAccountsChanged,
  onChainChanged,
  isMetaMaskInstalled,
} from '../utils/wallet';

export interface WalletState {
  account: string | null;
  isConnected: boolean;
  isInstalled: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useWallet() {
  const [state, setState] = useState({
    account: null,
    isConnected: false,
    isInstalled: isMetaMaskInstalled(),
    isLoading: true,
    error: null,
  });

  // Check connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (!isMetaMaskInstalled()) {
        setState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        const account = await getCurrentAccount();
        setState((prev) => ({
          ...prev,
          account,
          isConnected: !!account,
          isLoading: false,
        }));
      } catch (error: any) {
        setState((prev) => ({
          ...prev,
          error: error.message,
          isLoading: false,
        }));
      }
    };

    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (!isMetaMaskInstalled()) return;

    const unsubscribeAccounts = onAccountsChanged((accounts) => {
      setState((prev) => ({
        ...prev,
        account: accounts.length > 0 ? accounts[0] : null,
        isConnected: accounts.length > 0,
      }));
    });

    const unsubscribeChain = onChainChanged(() => {
      // Reload page on chain change to ensure correct network
      window.location.reload();
    });

    return () => {
      unsubscribeAccounts();
      unsubscribeChain();
    };
  }, []);

  const connect = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const account = await connectWallet();
      setState((prev) => ({
        ...prev,
        account,
        isConnected: true,
        isLoading: false,
      }));
      return account;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error.message,
        isLoading: false,
      }));
      throw error;
    }
  }, []);

  return {
    ...state,
    connect,
  };
}

