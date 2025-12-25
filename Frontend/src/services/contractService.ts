import { Contract, BrowserProvider, JsonRpcSigner } from 'ethers';
import { REPORT_VALIDATOR_ABI } from '../contracts/ReportValidatorABI';
import { CONTRACT_CONFIG } from '../config/contract';
import { getProvider, getSigner } from '../utils/wallet';

export interface Report {
  contentHash: string;
  cid: string;
  timestamp: number;
}

class ContractService {
  private contract: Contract | null = null;
  private provider: BrowserProvider | null = null;
  private signer: JsonRpcSigner | null = null;

  // Initialize contract with provider/signer
  async initialize(useSigner: boolean = true): Promise<void> {
    // #region agent log
    console.log('[DEBUG] ContractService: Initializing', { useSigner, contractAddress: CONTRACT_CONFIG.ADDRESS });
    fetch('http://127.0.0.1:7242/ingest/f08a191d-8def-4c5e-8d87-2335bb18563a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'contractService.ts:initialize',message:'starting initialization',data:{useSigner,contractAddress:CONTRACT_CONFIG.ADDRESS},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
    // #endregion

    // Validate contract address
    if (!CONTRACT_CONFIG.ADDRESS || CONTRACT_CONFIG.ADDRESS === '0x0000000000000000000000000000000000000000') {
      const errorMsg = 'Contract address not configured. Please set VITE_CONTRACT_ADDRESS in your .env file.';
      console.error('[DEBUG] ContractService:', errorMsg);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/f08a191d-8def-4c5e-8d87-2335bb18563a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'contractService.ts:initialize',message:'contract address not configured',data:{error:errorMsg},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      throw new Error(errorMsg);
    }

    if (useSigner) {
      this.signer = await getSigner();
      if (!this.signer) {
        const errorMsg = 'No signer available. Please connect your wallet.';
        console.error('[DEBUG] ContractService:', errorMsg);
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/f08a191d-8def-4c5e-8d87-2335bb18563a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'contractService.ts:initialize',message:'no signer available',data:{error:errorMsg},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        throw new Error(errorMsg);
      }
      this.contract = new Contract(
        CONTRACT_CONFIG.ADDRESS,
        REPORT_VALIDATOR_ABI,
        this.signer
      );
      // #region agent log
      console.log('[DEBUG] ContractService: Contract initialized with signer');
      fetch('http://127.0.0.1:7242/ingest/f08a191d-8def-4c5e-8d87-2335bb18563a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'contractService.ts:initialize',message:'contract initialized with signer',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
    } else {
      this.provider = getProvider();
      if (!this.provider) {
        const errorMsg = 'No provider available. Please install MetaMask.';
        console.error('[DEBUG] ContractService:', errorMsg);
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/f08a191d-8def-4c5e-8d87-2335bb18563a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'contractService.ts:initialize',message:'no provider available',data:{error:errorMsg},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        throw new Error(errorMsg);
      }
      this.contract = new Contract(
        CONTRACT_CONFIG.ADDRESS,
        REPORT_VALIDATOR_ABI,
        this.provider
      );
      // #region agent log
      console.log('[DEBUG] ContractService: Contract initialized with provider');
      fetch('http://127.0.0.1:7242/ingest/f08a191d-8def-4c5e-8d87-2335bb18563a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'contractService.ts:initialize',message:'contract initialized with provider',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
    }
  }

  // Get contract instance (read-only)
  getContract(): Contract {
    if (!this.contract) {
      throw new Error('Contract not initialized. Call initialize() first.');
    }
    return this.contract;
  }

  // Get reports count for a user
  async getReportsCount(userAddress: string): Promise<number> {
    const contract = this.getContract();
    const count = await contract.reportsCount(userAddress);
    return Number(count);
  }

  // Get latest report for a user
  async getLatestReport(userAddress: string): Promise<Report | null> {
    try {
      const contract = this.getContract();
      const [contentHash, cid, timestamp] = await contract.getLatestReport(userAddress);
      return {
        contentHash,
        cid: Buffer.from(cid).toString('hex'),
        timestamp: Number(timestamp),
      };
    } catch (error: any) {
      if (error.message?.includes('no reports')) {
        return null;
      }
      throw error;
    }
  }

  // Verify a report
  async verifyReport(
    userAddress: string,
    index: number,
    expectedHash: string
  ): Promise<boolean> {
    const contract = this.getContract();
    return await contract.verifyReport(userAddress, index, expectedHash);
  }

  // Upload report (requires UPLOADER_ROLE)
  async uploadReport(
    subjectAddress: string,
    contentHash: string,
    cidBytes: string
  ): Promise<{ hash: string; receipt: any }> {
    if (!this.signer) {
      throw new Error('Signer required for uploading reports. Please connect your wallet.');
    }

    const contract = this.getContract();
    
    // Convert hex string to bytes32
    const hashBytes32 = `0x${contentHash.replace('0x', '').padStart(64, '0')}`;
    
    // Convert CID string to bytes
    const cidBytesArray = Buffer.from(cidBytes, 'hex');

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/f08a191d-8def-4c5e-8d87-2335bb18563a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'contractService.ts:uploadReport',message:'uploading report to blockchain',data:{subjectAddress,contentHash:hashBytes32.substring(0,20)+'...',cidLength:cidBytesArray.length},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
    // #endregion

    const tx = await contract.uploadReport(subjectAddress, hashBytes32, cidBytesArray);
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/f08a191d-8def-4c5e-8d87-2335bb18563a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'contractService.ts:uploadReport',message:'transaction sent, waiting for confirmation',data:{txHash:tx.hash},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
    // #endregion

    const receipt = await tx.wait();

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/f08a191d-8def-4c5e-8d87-2335bb18563a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'contractService.ts:uploadReport',message:'transaction confirmed',data:{blockNumber:receipt.blockNumber,status:receipt.status},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
    // #endregion

    return {
      hash: receipt.transactionHash,
      receipt,
    };
  }

  // Listen to ReportUploaded events
  onReportUploaded(
    callback: (uploader: string, subject: string, contentHash: string, cid: string, timestamp: number) => void
  ): () => void {
    const contract = this.getContract();
    const filter = contract.filters.ReportUploaded();
    
    contract.on(filter, (uploader, subject, contentHash, cid, timestamp) => {
      callback(
        uploader,
        subject,
        contentHash,
        Buffer.from(cid).toString('hex'),
        Number(timestamp)
      );
    });

    // Return cleanup function
    return () => {
      contract.removeAllListeners(filter);
    };
  }
}

// Export singleton instance
export const contractService = new ContractService();

