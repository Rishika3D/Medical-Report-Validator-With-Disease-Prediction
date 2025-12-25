import { useState, useEffect, useCallback } from 'react';
import { contractService, Report } from '../services/contractService';
import { useWallet } from './useWallet';

export function useContract() {
  const { account, isConnected } = useWallet();
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize contract when wallet is connected
  useEffect(() => {
    const init = async () => {
      if (!isConnected || !account) {
        setIsInitialized(false);
        setError(null);
        return;
      }

      try {
        // #region agent log
        console.log('[DEBUG] useContract: Initializing contract service', { account, isConnected });
        fetch('http://127.0.0.1:7242/ingest/f08a191d-8def-4c5e-8d87-2335bb18563a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useContract.ts:init',message:'initializing contract',data:{account,isConnected},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        
        await contractService.initialize(true); // Use signer for write operations
        
        // #region agent log
        console.log('[DEBUG] useContract: Contract initialized successfully');
        fetch('http://127.0.0.1:7242/ingest/f08a191d-8def-4c5e-8d87-2335bb18563a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useContract.ts:init',message:'contract initialized',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        
        setIsInitialized(true);
        setError(null);
      } catch (err: any) {
        console.error('[DEBUG] useContract: Initialization error', err);
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/f08a191d-8def-4c5e-8d87-2335bb18563a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'useContract.ts:init',message:'initialization error',data:{error:err?.message||'Unknown error'},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        setError(err.message);
        setIsInitialized(false);
      }
    };

    init();
  }, [isConnected, account]);

  const getReportsCount = useCallback(
    async (userAddress?: string): Promise<number> => {
      if (!isInitialized) {
        throw new Error('Contract not initialized');
      }
      const address = userAddress || account;
      if (!address) {
        throw new Error('No address provided');
      }
      return await contractService.getReportsCount(address);
    },
    [isInitialized, account]
  );

  const getLatestReport = useCallback(
    async (userAddress?: string): Promise<Report | null> => {
      if (!isInitialized) {
        throw new Error('Contract not initialized');
      }
      const address = userAddress || account;
      if (!address) {
        throw new Error('No address provided');
      }
      return await contractService.getLatestReport(address);
    },
    [isInitialized, account]
  );

  const verifyReport = useCallback(
    async (
      userAddress: string,
      index: number,
      expectedHash: string
    ): Promise<boolean> => {
      if (!isInitialized) {
        throw new Error('Contract not initialized');
      }
      return await contractService.verifyReport(userAddress, index, expectedHash);
    },
    [isInitialized]
  );

  const uploadReport = useCallback(
    async (
      subjectAddress: string,
      contentHash: string,
      cidBytes: string
    ): Promise<{ hash: string; receipt: any }> => {
      if (!isInitialized) {
        throw new Error('Contract not initialized');
      }
      if (!isConnected) {
        throw new Error('Wallet not connected');
      }
      return await contractService.uploadReport(subjectAddress, contentHash, cidBytes);
    },
    [isInitialized, isConnected]
  );

  return {
    isInitialized,
    error,
    getReportsCount,
    getLatestReport,
    verifyReport,
    uploadReport,
  };
}

