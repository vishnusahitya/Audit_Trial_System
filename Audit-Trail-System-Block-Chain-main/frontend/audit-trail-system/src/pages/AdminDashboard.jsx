import { useState } from 'react';
import { useBlockchain } from '../context/BlockchainContext';
import Header from '../components/Header';
import FileManagement from '../components/FileManagement';

function AdminDashboard() {
  const { contract } = useBlockchain();
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeSection, setActiveSection] = useState('register');

  const registerUser = async (roleType) => {
    if (!address) {
      setMessage('Please enter an address');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      let tx;
      
      switch (roleType) {
        case 'INSPECTOR':
          tx = await contract.registerInspector(address);
          break;
        case 'APPROVER':
          tx = await contract.registerApprover(address);
          break;
        case 'AUDITOR':
          tx = await contract.registerAuditor(address);
          break;
        default:
          throw new Error('Invalid role type');
      }

      setMessage('⏳ Transaction submitted. Waiting for confirmation...');
      await tx.wait();
      
      setMessage(`✅ Successfully registered ${address} as ${roleType}`);
      setAddress('');
    } catch (error) {
      console.error('Error registering user:', error);
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <Header />
      <div className="dashboard-content">
        <h2>🛡️ Admin Dashboard</h2>
        <p>Manage users, roles, and files</p>

        {/* Navigation Tabs */}
        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeSection === 'register' ? 'active' : ''}`}
            onClick={() => setActiveSection('register')}
          >
            👤 User Registration
          </button>
          <button
            className={`tab-btn ${activeSection === 'files' ? 'active' : ''}`}
            onClick={() => setActiveSection('files')}
          >
            📁 File Management
          </button>
        </div>

        {/* User Registration Section */}
        {activeSection === 'register' && (
          <div className="admin-section">
            <div className="register-form">
              <input
                type="text"
                placeholder="Enter wallet address (0x...)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={loading}
              />

              <div className="button-group">
                <button
                  onClick={() => registerUser('INSPECTOR')}
                  disabled={loading}
                  className="btn-primary"
                >
                  Register as Inspector
                </button>
                <button
                  onClick={() => registerUser('APPROVER')}
                  disabled={loading}
                  className="btn-primary"
                >
                  Register as Approver
                </button>
                <button
                  onClick={() => registerUser('AUDITOR')}
                  disabled={loading}
                  className="btn-primary"
                >
                  Register as Auditor
                </button>
              </div>

              {message && <div className="message">{message}</div>}
            </div>

            <div className="info-box">
              <h3>ℹ️ Instructions</h3>
              <ol>
                <li>Copy the wallet address from MetaMask</li>
                <li>Paste it in the input field above</li>
                <li>Click the appropriate role button</li>
                <li>Confirm the transaction in MetaMask</li>
                <li>User must reconnect wallet to see new role</li>
              </ol>
            </div>
          </div>
        )}

        {/* File Management Section */}
        {activeSection === 'files' && (
          <div className="admin-section">
            <FileManagement />
          </div>
        )}
      </div>

      <style>{`
        .admin-tabs {
          display: flex;
          gap: 10px;
          margin: 20px 0;
          flex-wrap: wrap;
        }

        .tab-btn {
          padding: 10px 20px;
          background: #ddd;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s ease;
        }

        .tab-btn:hover {
          background: #bbb;
        }

        .tab-btn.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .admin-section {
          margin-top: 20px;
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard;
