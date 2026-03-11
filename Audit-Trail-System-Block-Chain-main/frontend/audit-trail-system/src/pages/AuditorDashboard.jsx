import { useState } from 'react';
import { useBlockchain } from '../context/BlockchainContext';
import { api } from '../utils/api';
import { hashToBytes32, getStatusName } from '../utils/helpers';
import Header from '../components/Header';

function AuditorDashboard() {
  const { contract } = useBlockchain();
  const [reportId, setReportId] = useState('');
  const [inspection, setInspection] = useState(null);
  const [blockchainData, setBlockchainData] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const verifyInspection = async () => {
    if (!reportId) {
      setMessage('Please enter a report ID');
      return;
    }

    setLoading(true);
    setMessage('');
    setInspection(null);
    setBlockchainData(null);
    setVerificationResult(null);

    try {
      setMessage('🔍 Fetching inspection data...');

      // Step 1: Get data from backend
      const backendData = await api.getInspection(reportId);
      setInspection(backendData);

      // Step 2: Get data from blockchain
      const blockchainInspection = await contract.getInspection(reportId);
      const blockchainHash = blockchainInspection.dataHash;

      setBlockchainData({
        status: getStatusName(Number(blockchainInspection.status)),
        inspector: blockchainInspection.inspector,
        timestamp: new Date(Number(blockchainInspection.timestamp) * 1000).toLocaleString(),
        storedHash: blockchainHash,
      });

      // Step 3: Recalculate hash from backend data
      setMessage('🔍 Recalculating hash...');
      const verifyResponse = await api.verifyInspection(reportId);
      const calculatedHash = hashToBytes32(verifyResponse.calculatedHash);

      // Step 4: Compare hashes
      const isAuthentic = calculatedHash.toLowerCase() === blockchainHash.toLowerCase();

      setVerificationResult({
        isAuthentic,
        calculatedHash,
        blockchainHash,
      });

      if (isAuthentic) {
        setMessage('✅ VERIFICATION PASSED: Data is authentic and untampered');
      } else {
        setMessage('❌ VERIFICATION FAILED: Data has been tampered with!');
      }
    } catch (error) {
      console.error('Error verifying inspection:', error);
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <Header />
      <div className="dashboard-content">
        <h2>Auditor Dashboard</h2>
        <p>Verify inspection data integrity</p>

        <div className="search-section">
          <input
            type="text"
            placeholder="Enter Report ID"
            value={reportId}
            onChange={(e) => setReportId(e.target.value)}
            disabled={loading}
          />
          <button onClick={verifyInspection} disabled={loading} className="btn-primary">
            Verify Inspection
          </button>
        </div>

        {inspection && blockchainData && (
          <div className="inspection-details">
            <h3>Inspection Details</h3>
            
            <div className="detail-row">
              <strong>Status:</strong>
              <span className={`status-badge status-${blockchainData.status.toLowerCase()}`}>
                {blockchainData.status}
              </span>
            </div>

            <div className="detail-row">
              <strong>Project ID:</strong> {inspection.projectId}
            </div>

            <div className="detail-row">
              <strong>Location:</strong> {inspection.location}
            </div>

            <div className="detail-row">
              <strong>Strength:</strong> {inspection.qualityParameters.strength}
            </div>

            <div className="detail-row">
              <strong>Finish:</strong> {inspection.qualityParameters.finish}
            </div>

            <div className="detail-row">
              <strong>Remarks:</strong> {inspection.remarks}
            </div>

            <div className="detail-row">
              <strong>Inspector:</strong> {blockchainData.inspector}
            </div>

            <div className="detail-row">
              <strong>Created:</strong> {blockchainData.timestamp}
            </div>
          </div>
        )}

        {verificationResult && (
          <div className={`verification-result ${verificationResult.isAuthentic ? 'authentic' : 'tampered'}`}>
            <h3>🔍 Verification Result</h3>
            
            <div className="hash-comparison">
              <div className="hash-item">
                <strong>Blockchain Hash:</strong>
                <code>{verificationResult.blockchainHash}</code>
              </div>
              
              <div className="hash-item">
                <strong>Calculated Hash:</strong>
                <code>{verificationResult.calculatedHash}</code>
              </div>
            </div>

            <div className={`verdict ${verificationResult.isAuthentic ? 'pass' : 'fail'}`}>
              {verificationResult.isAuthentic ? (
                <>
                  <h2>✅ AUTHENTIC</h2>
                  <p>The inspection data matches the blockchain record.</p>
                  <p>No tampering detected.</p>
                </>
              ) : (
                <>
                  <h2>❌ TAMPERED</h2>
                  <p>The inspection data does NOT match the blockchain record.</p>
                  <p>Data has been modified after blockchain storage!</p>
                </>
              )}
            </div>
          </div>
        )}

        {message && <div className="message">{message}</div>}
      </div>
    </div>
  );
}

export default AuditorDashboard;
