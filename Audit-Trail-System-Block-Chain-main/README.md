# 🔐 Immutable Audit Trail System for Quality Inspections Using Blockchain

A complete, enterprise-grade blockchain-based audit trail system that ensures tamper-proof quality inspection records.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + ethers.js v6)          │
│  - MetaMask wallet connection                               │
│  - User signs ALL blockchain transactions                   │
│  - Role-based dashboards                                    │
└─────────────────────────────────────────────────────────────┘
                              ↕️
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (FastAPI + MongoDB)              │
│  - Stores full inspection reports                           │
│  - Generates SHA-256 hashes                                 │
│  - NEVER touches blockchain                                 │
└─────────────────────────────────────────────────────────────┘
                              ↕️
┌─────────────────────────────────────────────────────────────┐
│              BLOCKCHAIN (Solidity Smart Contract)           │
│  - Stores ONLY hashes + metadata                            │
│  - Enforces role-based access control                       │
│  - Enforces immutability after approval                     │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js v16+
- Python 3.8+
- MongoDB
- MetaMask browser extension

### Step 1: Clone and Setup

```bash
cd "d:\Finalyear Projects\Audit-Trail-System-Block-Chain"
```

### Step 2: Start Blockchain (Terminal 1)

```bash
cd blockchain
npm install
npm run node
```

Keep this terminal running. You'll see 20 test accounts with private keys.

### Step 3: Deploy Smart Contract (Terminal 2)

```bash
cd blockchain
npm run deploy
```

This creates `deployments/contract-address.json` and `deployments/AuditTrail.json`.

### Step 4: Start Backend (Terminal 3)

```bash
cd backend
pip install -r requirements.txt
```

Create `.env` file:
```
MONGODB_URL=mongodb://localhost:27017/
DB_NAME=audit_trail_db
```

Start server:
```bash
uvicorn app.main:app --reload --port 8000
```

### Step 5: Start Frontend (Terminal 4)

```bash
cd frontend/audit-trail-system
npm install
npm run dev
```

Frontend runs at: http://localhost:5173

### Step 6: Configure MetaMask

1. Add Hardhat Local Network:
   - Network Name: `Hardhat Local`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency Symbol: `ETH`

2. Import test accounts (from Terminal 1 output):
   - Account #0 → Admin
   - Account #1 → Inspector
   - Account #2 → Approver
   - Account #3 → Auditor

## 🎬 Demo Flow

### 1. Admin Setup (Account #0)

1. Open http://localhost:5173
2. Connect MetaMask with Account #0
3. You'll see "Admin Dashboard"
4. Copy addresses of Accounts #1, #2, #3 from Terminal 1
5. Register:
   - Account #1 as Inspector
   - Account #2 as Approver
   - Account #3 as Auditor
6. Confirm each transaction in MetaMask

### 2. Inspector Creates Inspection (Account #1)

1. Switch MetaMask to Account #1
2. Refresh page → "Inspector Dashboard"
3. Fill inspection form:
   - Project ID: `PROJ-001`
   - Location: `Building A, Floor 3`
   - Strength: `Excellent`
   - Finish: `Good`
   - Remarks: `All quality checks passed`
4. Click "Create Inspection" → Confirm in MetaMask
5. Copy the Report ID (e.g., `507f1f77bcf86cd799439011`)
6. Click "Submit for Approval" → Confirm in MetaMask

### 3. Approver Reviews (Account #2)

1. Switch MetaMask to Account #2
2. Refresh page → "Approver Dashboard"
3. Paste Report ID
4. Click "Load Inspection"
5. Review details
6. Click "✅ Approve" → Confirm in MetaMask
7. Status changes to "APPROVED" 🔒

### 4. Auditor Verifies (Account #3)

1. Switch MetaMask to Account #3
2. Refresh page → "Auditor Dashboard"
3. Paste Report ID
4. Click "Verify Inspection"
5. System shows:
   - Blockchain hash
   - Calculated hash
   - ✅ AUTHENTIC (if hashes match)

### 5. Test Tampering (Optional)

1. Go to MongoDB and modify the inspection data
2. Run verification again
3. System shows: ❌ TAMPERED

## 🔑 Key Features

### Immutability
- Once approved, inspection cannot be modified
- Smart contract enforces this rule
- Any attempt to edit will fail

### Transparency
- All hashes stored on blockchain
- All state changes recorded
- Public audit trail

### Non-repudiation
- Every action signed by user's private key
- Inspector, approver identities recorded
- Timestamps immutable

### Integrity Verification
- SHA-256 hashing
- Blockchain comparison
- Instant tampering detection

## 📁 Project Structure

```
Audit-Trail-System-Block-Chain/
├── blockchain/
│   ├── contracts/
│   │   └── AuditTrail.sol          # Smart contract
│   ├── scripts/
│   │   └── deploy.js               # Deployment script
│   ├── deployments/                # Generated after deploy
│   │   ├── contract-address.json
│   │   └── AuditTrail.json
│   └── hardhat.config.js
│
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI endpoints
│   │   ├── db.py                   # MongoDB connection
│   │   ├── models.py               # Pydantic models
│   │   └── hash_utils.py           # SHA-256 hashing
│   └── requirements.txt
│
└── frontend/
    └── audit-trail-system/
        ├── src/
        │   ├── context/
        │   │   └── BlockchainContext.jsx  # ethers.js v6
        │   ├── pages/
        │   │   ├── AdminDashboard.jsx
        │   │   ├── InspectorDashboard.jsx
        │   │   ├── ApproverDashboard.jsx
        │   │   └── AuditorDashboard.jsx
        │   ├── components/
        │   │   ├── WalletConnect.jsx
        │   │   └── Header.jsx
        │   ├── utils/
        │   │   ├── api.js
        │   │   └── helpers.js
        │   ├── App.jsx
        │   └── main.jsx
        └── package.json
```

## 🛑 Common Issues & Solutions

### Issue: MetaMask doesn't pop up
**Solution:** Check browser console for errors. Make sure:
- Hardhat node is running
- Contract is deployed
- Connected to correct network (chainId 31337)

### Issue: "Inspection already exists"
**Solution:** Each inspection needs unique reportId (MongoDB ObjectId). Create new inspection.

### Issue: "Only inspector can perform this action"
**Solution:** Make sure:
- You're connected with correct account
- Account is registered with correct role
- You reconnected wallet after role assignment

### Issue: Backend connection failed
**Solution:** 
- Check MongoDB is running
- Check backend is running on port 8000
- Check CORS settings in main.py

### Issue: Contract address not found
**Solution:**
- Run `npm run deploy` in blockchain folder
- Check `blockchain/deployments/` folder exists
- Restart frontend after deployment

## 🔒 Security Best Practices

1. **Backend never signs transactions** ✅
   - All blockchain writes go through MetaMask
   - User explicitly approves each action

2. **Role-based access control** ✅
   - Smart contract enforces permissions
   - Cannot bypass via frontend manipulation

3. **Immutability enforcement** ✅
   - Approved inspections locked forever
   - Smart contract prevents modifications

4. **Hash verification** ✅
   - SHA-256 ensures data integrity
   - Any tampering detected instantly

## 🎓 Interview Talking Points

### "How does your system prevent tampering?"
"We use a two-layer approach: inspection data is stored in MongoDB, but its SHA-256 hash is stored on blockchain. Any modification to the data will result in a different hash, which we can detect by comparing with the immutable blockchain record."

### "Why not store everything on blockchain?"
"Storing large data on-chain is expensive and slow. We store only the hash (32 bytes) on-chain, which is sufficient to prove data integrity. Full data lives in MongoDB for fast queries and rich features."

### "How do you ensure only authorized users can approve?"
"Our smart contract has role-based access control. Only addresses registered as 'Approvers' by the admin can call the approve function. This is enforced at the blockchain level, not just the UI."

### "What happens if someone modifies the database?"
"The auditor can recalculate the hash from the database and compare it with the blockchain hash. If they don't match, we know the data was tampered with. The blockchain hash is immutable, so it serves as the source of truth."

### "Why use MetaMask instead of backend signing?"
"If the backend could sign transactions, it defeats the purpose of blockchain. With MetaMask, each user signs with their private key, ensuring non-repudiation and true decentralization."

## 📊 Tech Stack

- **Blockchain:** Solidity 0.8.20, Hardhat 2.x, ethers.js v6
- **Backend:** Python FastAPI, MongoDB, SHA-256
- **Frontend:** React, Vite, ethers.js v6
- **Wallet:** MetaMask

## 🎯 Next Steps (Optional Enhancements)

- [ ] Add file upload (IPFS integration)
- [ ] Email notifications
- [ ] Inspection history timeline
- [ ] Export reports as PDF
- [ ] Multi-signature approvals
- [ ] Deploy to testnet (Sepolia)

## 📝 License

MIT

## 👨‍💻 Author

Built as a final year project demonstrating enterprise-grade blockchain architecture.
