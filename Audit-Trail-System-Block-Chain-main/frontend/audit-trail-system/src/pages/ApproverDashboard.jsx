import { useState } from 'react';
import { useBlockchain } from '../context/BlockchainContext';
import { api } from '../utils/api';
import { hashToBytes32, getStatusName } from '../utils/helpers';
import Header from '../components/Header';

function ApproverDashboard() {
  const { contract } = useBlockchain();
  const [reportId, setReportId] = useState('');
  const [inspection, setInspection] = useState(null);
  const [blockchainData, setBlockchainData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchInspection = async () => {
    if (!reportId) {
      setMessage('Please enter a report ID');
      return;
    }

    setLoading(true);
    setMessage('');
    setInspection(null);
    setBlockchainData(null);

    try {
      // Fetch from backend
      const backendData = await api.getInspection(reportId);
      setInspection(backendData);

      // Fetch from blockchain
      const blockchainInspection = await contract.getInspection(reportId);
      setBlockchainData({
        status: getStatusName(Number(blockchainInspection.status)),
        inspector: blockchainInspection.inspector,
        timestamp: new Date(Number(blockchainInspection.timestamp) * 1000).toLocaleString(),
      });

      setMessage('✅ Inspection loaded');
    } catch (error) {
      console.error('Error fetching inspection:', error);
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const approveInspection = async () => {
    setLoading(true);
    setMessage('');

    try {
      // Recalculate hash for approval
      const verifyResponse = await api.verifyInspection(reportId);
      const approvalHash = hashToBytes32(verifyResponse.calculatedHash);

      setMessage('⏳ Approving inspection...');
      
      const tx = await contract.approveInspection(reportId, approvalHash);
      await tx.wait();

      setMessage('✅ Inspection approved! It is now immutable.');
      
      // Refresh data
      fetchInspection();
    } catch (error) {
      console.error('Error approving inspection:', error);
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const rejectInspection = async () => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    setLoading(true);
    setMessage('');

    try {
      setMessage('⏳ Rejecting inspection...');
      
      const tx = await contract.rejectInspection(reportId, reason);
      await tx.wait();

      setMessage('✅ Inspection rejected');
      
      // Refresh data
      fetchInspection();
    } catch (error) {
      console.error('Error rejecting inspection:', error);
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <Header />
      <div className="dashboard-content">
        <h2>Approver Dashboard</h2>
        <p>Review and approve/reject inspections</p>

        <div className="search-section">
          <input
            type="text"
            placeholder="Enter Report ID"
            value={reportId}
            onChange={(e) => setReportId(e.target.value)}
            disabled={loading}
          />
          <button onClick={fetchInspection} disabled={loading} className="btn-primary">
            Load Inspection
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

            {blockchainData.status === 'SUBMITTED' && (
              <div className="action-buttons">
                <button onClick={approveInspection} disabled={loading} className="btn-success">
                  ✅ Approve
                </button>
                <button onClick={rejectInspection} disabled={loading} className="btn-danger">
                  ❌ Reject
                </button>
              </div>
            )}

            {blockchainData.status === 'APPROVED' && (
              <div className="info-box">
                <p>🔒 This inspection is approved and immutable. No changes allowed.</p>
              </div>
            )}
          </div>
        )}

        {message && <div className="message">{message}</div>}
      </div>
    </div>
  );
}

export default ApproverDashboard;
