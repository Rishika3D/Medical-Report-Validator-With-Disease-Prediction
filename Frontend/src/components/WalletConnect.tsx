import React from 'react';
import { useWallet } from '../hooks/useWallet';
import { Wallet, AlertCircle } from 'lucide-react';

export function WalletConnect() {
  const { account, isConnected, isInstalled, isLoading, error, connect } = useWallet();

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const handleConnect = async () => {
    try {
      await connect();
    } catch (err: any) {
      console.error('[DEBUG] WalletConnect: Connection error', err);
      // Error is already handled by useWallet hook
    }
  };

  if (!isInstalled) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
        <AlertCircle size={18} className="text-yellow-400" />
        <span className="text-sm text-yellow-400">
          MetaMask not installed.{' '}
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-yellow-300"
          >
            Install MetaMask
          </a>
        </span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <button
        disabled
        className="flex items-center gap-2 px-4 py-2 bg-gray-500/20 border border-gray-500/50 rounded-lg text-gray-400 cursor-not-allowed"
      >
        <Wallet size={18} />
        <span className="text-sm">Connecting...</span>
      </button>
    );
  }

  if (isConnected && account) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-lg">
        <Wallet size={18} className="text-green-400" />
        <span className="text-sm text-green-400 font-mono">
          {formatAddress(account)}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {error && (
        <div className="text-xs text-red-400 px-2">{error}</div>
      )}
      <button
        onClick={handleConnect}
        className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 rounded-lg hover:bg-cyan-500/30 transition-colors text-cyan-400"
      >
        <Wallet size={18} />
        <span className="text-sm">Connect Wallet</span>
      </button>
    </div>
  );
}

