import { useState } from 'react';

function NetworkTest() {
  const [result, setResult] = useState('Click "Check Network" to start');

  const checkNetwork = async () => {
    if (!window.ethereum) {
      setResult('❌ MetaMask not installed!');
      return;
    }

    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const chainIdDecimal = parseInt(chainId, 16);
      
      setResult(`
Current Network:
Chain ID (hex): ${chainId}
Chain ID (decimal): ${chainIdDecimal}

${chainIdDecimal === 31337 ? '✅ CORRECT! You are on Hardhat Local' : '❌ WRONG! Need Chain ID 31337'}
      `);
    } catch (error) {
      setResult('❌ Error: ' + error.message);
    }
  };

  const switchNetwork = async () => {
    if (!window.ethereum) {
      alert('MetaMask not installed!');
      return;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x7a69',
          chainName: 'Hardhat Local',
          rpcUrls: ['http://127.0.0.1:8545'],
          nativeCurrency: {
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: 18
          }
        }]
      });
      alert('✅ Network added/switched successfully!');
      setTimeout(checkNetwork, 1000);
    } catch (error) {
      alert('❌ Error: ' + error.message + '\n\nManual steps:\n1. Open MetaMask\n2. Delete network with Chain ID 1329\n3. This will add Chain ID 31337');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>🔧 MetaMask Network Test</h1>
      <button onClick={checkNetwork} style={{ marginRight: '10px', padding: '10px' }}>
        Check Current Network
      </button>
      <button onClick={switchNetwork} style={{ padding: '10px' }}>
        Switch to Hardhat (31337)
      </button>
      <pre style={{ marginTop: '20px', padding: '15px', background: '#f0f0f0', borderRadius: '5px' }}>
        {result}
      </pre>
    </div>
  );
}

export default NetworkTest;
