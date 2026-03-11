import { useBlockchain } from '../context/BlockchainContext';
import { switchToHardhat } from '../utils/switchNetwork';

function WalletConnect() {
  const { connectWallet } = useBlockchain();

  const handleConnect = async () => {
    await switchToHardhat();
    connectWallet();
  };

  return (
    <div className="wallet-connect">
      <div className="connect-card">
        <h1>🔐 Audit Trail System</h1>
        <p>Immutable Quality Inspections Using Blockchain</p>
        <button onClick={handleConnect} className="btn-primary">
          Connect MetaMask
        </button>
        <div className="info">
          <p>⚠️ Make sure you're connected to:</p>
          <ul>
            <li>Network: Hardhat Local</li>
            <li>Chain ID: 31337</li>
            <li>RPC: http://127.0.0.1:8545</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default WalletConnect;
