import { useState } from 'react';
import { useBlockchain } from '../context/BlockchainContext';
import { api } from '../utils/api';
import { hashToBytes32 } from '../utils/helpers';
import Header from '../components/Header';

function InspectorDashboard() {
  const { contract, account } = useBlockchain();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [formData, setFormData] = useState({
    projectId: '',
    location: '',
    strength: '',
    finish: '',
    remarks: '',
  });

  const [createdReportId, setCreatedReportId] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const createInspection = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Step 1: Send data to backend
      setMessage('📝 Saving inspection to database...');
      
      const inspectionData = {
        projectId: formData.projectId,
        location: formData.location,
        qualityParameters: {
          strength: formData.strength,
          finish: formData.finish,
        },
        remarks: formData.remarks,
        images: [],
        inspector: account,
      };

      const backendResponse = await api.createInspection(inspectionData);
      const { reportId, dataHash } = backendResponse;

      setMessage('⏳ Storing hash on blockchain...');

      // Step 2: Store hash on blockchain
      const bytes32Hash = hashToBytes32(dataHash);
      const tx = await contract.createInspection(reportId, bytes32Hash);
      
      setMessage('⏳ Waiting for blockchain confirmation...');
      await tx.wait();

      setMessage(`✅ Inspection created successfully! Report ID: ${reportId}`);
      setCreatedReportId(reportId);
      
      // Reset form
      setFormData({
        projectId: '',
        location: '',
        strength: '',
        finish: '',
        remarks: '',
      });
    } catch (error) {
      console.error('Error creating inspection:', error);
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const submitInspection = async () => {
    if (!createdReportId) {
      setMessage('Please create an inspection first');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      setMessage('⏳ Submitting inspection for approval...');
      
      const tx = await contract.submitInspection(createdReportId);
      await tx.wait();

      setMessage(`✅ Inspection ${createdReportId} submitted for approval!`);
      setCreatedReportId('');
    } catch (error) {
      console.error('Error submitting inspection:', error);
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <Header />
      <div className="dashboard-content">
        <h2>Inspector Dashboard</h2>
        <p>Create and submit quality inspections</p>

        <form onSubmit={createInspection} className="inspection-form">
          <div className="form-group">
            <label>Project ID</label>
            <input
              type="text"
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Strength</label>
            <select
              name="strength"
              value={formData.strength}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">Select...</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>

          <div className="form-group">
            <label>Finish</label>
            <select
              name="finish"
              value={formData.finish}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">Select...</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>

          <div className="form-group">
            <label>Remarks</label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              required
              disabled={loading}
              rows="4"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            Create Inspection
          </button>
        </form>

        {createdReportId && (
          <div className="submit-section">
            <p>Report ID: <strong>{createdReportId}</strong></p>
            <button onClick={submitInspection} disabled={loading} className="btn-primary">
              Submit for Approval
            </button>
          </div>
        )}

        {message && <div className="message">{message}</div>}
      </div>
    </div>
  );
}

export default InspectorDashboard;
