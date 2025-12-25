import React, { useState, useEffect } from 'react';
import { useContract } from '../hooks/useContract';
import { useWallet } from '../hooks/useWallet';
import { FileCheck, Upload, Loader2 } from 'lucide-react';

/**
 * Example component showing how to interact with the ReportValidator contract
 * This demonstrates reading and writing to the blockchain
 */
export function ContractExample() {
  const { account, isConnected } = useWallet();
  const { isInitialized, getReportsCount, getLatestReport, verifyReport, uploadReport } = useContract();
  
  const [reportsCount, setReportsCount] = useState<number | null>(null);
  const [latestReport, setLatestReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load reports count on mount
  useEffect(() => {
    if (isInitialized && account) {
      loadReportsCount();
      loadLatestReport();
    }
  }, [isInitialized, account]);

  const loadReportsCount = async () => {
    if (!account) return;
    try {
      setLoading(true);
      const count = await getReportsCount();
      setReportsCount(count);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadLatestReport = async () => {
    if (!account) return;
    try {
      setLoading(true);
      const report = await getLatestReport();
      setLatestReport(report);
      setError(null);
    } catch (err: any) {
      if (err.message?.includes('no reports')) {
        setLatestReport(null);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyReport = async () => {
    if (!account || !latestReport) return;
    try {
      setLoading(true);
      const isValid = await verifyReport(account, 0, latestReport.contentHash);
      alert(`Report verification: ${isValid ? 'Valid ✓' : 'Invalid ✗'}`);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadReport = async () => {
    if (!account) {
      alert('Please connect your wallet first');
      return;
    }

    // Example: This would typically come from your file upload/processing
    const exampleSubjectAddress = account; // Use connected wallet as subject
    const exampleContentHash = '0x' + 'a'.repeat(64); // Example hash
    const exampleCidBytes = Buffer.from('example-cid').toString('hex');

    try {
      setLoading(true);
      const result = await uploadReport(exampleSubjectAddress, exampleContentHash, exampleCidBytes);
      alert(`Report uploaded! Transaction: ${result.hash}`);
      // Reload data
      await loadReportsCount();
      await loadLatestReport();
      setError(null);
    } catch (err: any) {
      setError(err.message);
      alert(`Upload failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="p-4 bg-black/40 border border-cyan-500/30 rounded-lg">
        <p className="text-gray-400 text-sm">Please connect your wallet to interact with the contract.</p>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="p-4 bg-black/40 border border-yellow-500/30 rounded-lg">
        <p className="text-yellow-400 text-sm">Initializing contract connection...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6 bg-black/40 border border-cyan-500/30 rounded-lg">
      <h3 className="text-cyan-400 text-lg font-semibold mb-4">Contract Interaction</h3>

      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Reports Count */}
        <div className="p-4 bg-black/60 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FileCheck size={20} className="text-cyan-400" />
            <span className="text-gray-300 font-medium">Reports Count</span>
          </div>
          {loading ? (
            <Loader2 size={16} className="animate-spin text-cyan-400" />
          ) : (
            <p className="text-cyan-400 text-2xl font-bold">
              {reportsCount !== null ? reportsCount : '--'}
            </p>
          )}
        </div>

        {/* Latest Report */}
        <div className="p-4 bg-black/60 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FileCheck size={20} className="text-purple-400" />
            <span className="text-gray-300 font-medium">Latest Report</span>
          </div>
          {loading ? (
            <Loader2 size={16} className="animate-spin text-purple-400" />
          ) : latestReport ? (
            <div className="text-sm text-gray-300">
              <p>Hash: {latestReport.contentHash.substring(0, 20)}...</p>
              <p>Timestamp: {new Date(Number(latestReport.timestamp) * 1000).toLocaleString()}</p>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No reports found</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={loadReportsCount}
          disabled={loading}
          className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 rounded-lg hover:bg-cyan-500/30 transition-colors text-cyan-400 text-sm disabled:opacity-50"
        >
          Refresh Count
        </button>
        {latestReport && (
          <button
            onClick={handleVerifyReport}
            disabled={loading}
            className="px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-lg hover:bg-green-500/30 transition-colors text-green-400 text-sm disabled:opacity-50"
          >
            Verify Report
          </button>
        )}
        <button
          onClick={handleUploadReport}
          disabled={loading}
          className="px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-lg hover:bg-purple-500/30 transition-colors text-purple-400 text-sm disabled:opacity-50 flex items-center gap-2"
        >
          <Upload size={16} />
          Upload Report (Example)
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-4">
        Note: Uploading reports requires UPLOADER_ROLE. This is typically granted by the contract admin.
      </p>
    </div>
  );
}

