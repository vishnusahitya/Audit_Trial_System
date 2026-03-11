import { useBlockchain } from '../context/BlockchainContext';
import { formatAddress } from '../utils/helpers';

function Header() {
  const { account, role, disconnectWallet } = useBlockchain();

  return (
    <header className="header">
      <div className="header-content">
        <h1>🔐 Audit Trail System</h1>
        <div className="user-info">
          <span className="role-badge">{role}</span>
          <span className="address">{formatAddress(account)}</span>
          <button onClick={disconnectWallet} className="btn-secondary">
            Disconnect
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
