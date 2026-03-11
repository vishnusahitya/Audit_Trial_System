# Blockchain Layer - Hardhat Setup

## Quick Start

### 1. Start Local Hardhat Node
```bash
npm run node
```
This starts a local Ethereum node at http://127.0.0.1:8545 with chainId 31337.
Keep this terminal running.

### 2. Deploy Contract (in a new terminal)
```bash
npm run deploy
```

This will:
- Deploy AuditTrail.sol to the local network
- Save contract address to `deployments/contract-address.json`
- Save ABI to `deployments/AuditTrail.json`

## Important Notes

- **Hardhat node resets on restart**: All deployed contracts and state are lost when you stop the node
- **Always redeploy after restarting**: Run `npm run deploy` again after restarting the node
- **Default accounts**: Hardhat provides 20 test accounts with 10000 ETH each
- **Account #0 is Admin**: The first account (deployer) automatically becomes the admin

## MetaMask Setup

1. Network Name: Hardhat Local
2. RPC URL: http://127.0.0.1:8545
3. Chain ID: 31337
4. Currency Symbol: ETH

Import test accounts using private keys shown when you run `npm run node`.

## Contract Address

After deployment, find the contract address in:
`deployments/contract-address.json`

## Useful Commands

- `npm run compile` - Compile contracts
- `npm run test` - Run tests
- `npm run node` - Start local node
- `npm run deploy` - Deploy to running node
