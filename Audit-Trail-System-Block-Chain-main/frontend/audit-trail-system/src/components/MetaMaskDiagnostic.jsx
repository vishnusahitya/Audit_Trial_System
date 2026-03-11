import { useState } from 'react';

function MetaMaskDiagnostic() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [error, setError] = useState('');

  const checkAccounts = async () => {
    if (!window.ethereum) {
      setError('MetaMask not installed!');
      return;
    }

    try {
      // Get all accounts
      const allAccounts = await window.ethereum.request({
        method: 'eth_accounts'
      });

      setAccounts(allAccounts);
      
      if (allAccounts.length > 0) {
        setSelectedAccount(allAccounts[0]);
      }

      console.log('All MetaMask accounts:', allAccounts);
    } catch (err) {
      setError(err.message);
    }
  };

  const requestAccounts = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      setAccounts(accounts);
      setSelectedAccount(accounts[0]);
      console.log('Connected accounts:', accounts);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>🔍 MetaMask Diagnostic Tool</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={checkAccounts} style={{ marginRight: '10px', padding: '10px' }}>
          Check Connected Accounts
        </button>
        <button onClick={requestAccounts} style={{ padding: '10px' }}>
          Request Account Access
        </button>
      </div>

      {error && (
        <div style={{ padding: '10px', background: '#ffebee', color: '#c62828', marginBottom: '20px' }}>
          Error: {error}
        </div>
      )}

      {selectedAccount && (
        <div style={{ padding: '15px', background: '#e3f2fd', marginBottom: '20px' }}>
          <h3>Currently Selected Account:</h3>
          <p style={{ fontFamily: 'monospace', fontSize: '14px' }}>{selectedAccount}</p>
          
          {selectedAccount.toLowerCase() === '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266' ? (
            <div style={{ color: '#2e7d32', fontWeight: 'bold' }}>
              ✅ This is the CORRECT admin account!
            </div>
          ) : selectedAccount.toLowerCase() === '0x21fedaf935dec152333f1ed125198a7045ac754b' ? (
            <div style={{ color: '#c62828', fontWeight: 'bold' }}>
              ❌ This is the WRONG account! This is not a Hardhat test account.
            </div>
          ) : (
            <div style={{ color: '#f57c00', fontWeight: 'bold' }}>
              ⚠️ This is not the admin account (Account #0)
            </div>
          )}
        </div>
      )}

      {accounts.length > 0 && (
        <div style={{ padding: '15px', background: '#f5f5f5' }}>
          <h3>All Connected Accounts ({accounts.length}):</h3>
          {accounts.map((account, index) => (
            <div key={index} style={{ 
              padding: '10px', 
              marginBottom: '10px', 
              background: 'white',
              border: account === selectedAccount ? '2px solid #2196f3' : '1px solid #ddd'
            }}>
              <div style={{ fontFamily: 'monospace', fontSize: '14px' }}>{account}</div>
              {account.toLowerCase() === '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266' && (
                <div style={{ color: '#2e7d32', fontSize: '12px' }}>✅ Admin Account (Account #0)</div>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '30px', padding: '15px', background: '#fff3e0' }}>
        <h3>Expected Admin Account:</h3>
        <p style={{ fontFamily: 'monospace', fontSize: '14px' }}>
          0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
        </p>
        <p style={{ fontSize: '12px', color: '#666' }}>
          This should be imported using private key:<br/>
          0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
        </p>
      </div>

      <div style={{ marginTop: '20px', padding: '15px', background: '#ffebee' }}>
        <h3>⚠️ If you see 0x21fedaf935dec152333f1ed125198a7045ac754b:</h3>
        <ol>
          <li>This account is NOT from Hardhat</li>
          <li>Open MetaMask and switch to the correct account</li>
          <li>Or remove this account and import the correct one</li>
          <li>Make sure you select the correct account when connecting</li>
        </ol>
      </div>
    </div>
  );
}

export default MetaMaskDiagnostic;
