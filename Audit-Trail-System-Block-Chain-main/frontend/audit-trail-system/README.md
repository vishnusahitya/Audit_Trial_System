# Frontend - React + ethers.js v6

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Make sure blockchain is deployed
The frontend needs the contract address and ABI from:
- `../../blockchain/deployments/contract-address.json`
- `../../blockchain/deployments/AuditTrail.json`

These files are created when you run `npm run deploy` in the blockchain folder.

### 3. Start Development Server
```bash
npm run dev
```

Frontend will run at: http://localhost:5173

## MetaMask Setup

### Add Hardhat Local Network

1. Open MetaMask
2. Click network dropdown → Add Network → Add network manually
3. Enter:
   - Network Name: `Hardhat Local`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency Symbol: `ETH`

### Import Test Accounts

When you run `npm run node` in blockchain folder, you'll see 20 accounts with private keys.

Import at least 4 accounts for testing:
- Account #0 → Admin (automatically assigned)
- Account #1 → Inspector (register via admin)
- Account #2 → Approver (register via admin)
- Account #3 → Auditor (register via admin)

## User Flows

### Admin Flow
1. Connect with Account #0 (deployer)
2. Copy addresses of other accounts
3. Register them as Inspector, Approver, Auditor
4. Users must reconnect wallet to see new role

### Inspector Flow
1. Connect with Inspector account
2. Fill inspection form
3. Click "Create Inspection" → MetaMask popup
4. Get Report ID
5. Click "Submit for Approval" → MetaMask popup

### Approver Flow
1. Connect with Approver account
2. Enter Report ID
3. Click "Load Inspection"
4. Review details
5. Click "Approve" or "Reject" → MetaMask popup

### Auditor Flow
1. Connect with Auditor account
2. Enter Report ID
3. Click "Verify Inspection"
4. System shows if data is authentic or tampered

## Important Notes

- Always confirm transactions in MetaMask
- If MetaMask doesn't pop up → BUG (check console)
- Switching accounts in MetaMask = switching user
- Backend must be running at http://localhost:8000
- Blockchain node must be running at http://127.0.0.1:8545

## Architecture

```
User Action → Frontend → MetaMask (sign) → Blockchain
                ↓
            Backend API (store data, generate hash)
```

- Frontend NEVER signs transactions automatically
- User MUST approve every blockchain write via MetaMask
- Backend NEVER touches blockchain
