import { useState } from 'react';
import { BlockchainProvider, useBlockchain } from './context/BlockchainContext';
import WalletConnect from './components/WalletConnect';
import NetworkTest from './components/NetworkTest';
import MetaMaskDiagnostic from './components/MetaMaskDiagnostic';
import AdminDashboard from './pages/AdminDashboard';
import InspectorDashboard from './pages/InspectorDashboard';
import ApproverDashboard from './pages/ApproverDashboard';
import AuditorDashboard from './pages/AuditorDashboard';
import './App.css';

function AppContent() {
  const { account, role } = useBlockchain();
  const [showTest, setShowTest] = useState(false);
  const [showDiagnostic, setShowDiagnostic] = useState(false);

  // If not connected, show wallet connect
  if (!account) {
    return (
      <>
        <button 
          onClick={() => setShowTest(!showTest)} 
          style={{ position: 'absolute', top: '10px', right: '10px', padding: '10px', zIndex: 1000 }}
        >
          {showTest ? 'Hide' : 'Show'} Network Test
        </button>
        <button 
          onClick={() => setShowDiagnostic(!showDiagnostic)} 
          style={{ position: 'absolute', top: '10px', right: '180px', padding: '10px', zIndex: 1000 }}
        >
          {showDiagnostic ? 'Hide' : 'Show'} Diagnostic
        </button>
        {showDiagnostic ? <MetaMaskDiagnostic /> : showTest ? <NetworkTest /> : <WalletConnect />}
      </>
    );
  }

  // Role-based dashboard rendering
  const renderDashboard = () => {
    switch (role) {
      case 'ADMIN':
        return <AdminDashboard />;
      case 'INSPECTOR':
        return <InspectorDashboard />;
      case 'APPROVER':
        return <ApproverDashboard />;
      case 'AUDITOR':
        return <AuditorDashboard />;
      default:
        return (
          <div className="no-role">
            <h2>No Role Assigned</h2>
            <p>Your wallet address: {account}</p>
            <p>Please contact the admin to assign you a role.</p>
          </div>
        );
    }
  };

  return <div className="app">{renderDashboard()}</div>;
}

function App() {
  return (
    <BlockchainProvider>
      <AppContent />
    </BlockchainProvider>
  );
}

export default App;
