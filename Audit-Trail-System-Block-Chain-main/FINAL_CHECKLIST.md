# ✅ Final Verification Checklist

## Before Running the Demo

### 1. Prerequisites Installed
- [ ] Node.js v16+ installed (`node --version`)
- [ ] Python 3.8+ installed (`python --version`)
- [ ] MongoDB installed and running
- [ ] MetaMask browser extension installed
- [ ] Git installed (for version control)

### 2. Project Setup

#### Blockchain Layer
- [ ] Navigate to `blockchain/` folder
- [ ] Run `npm install` (dependencies installed)
- [ ] File exists: `blockchain/contracts/AuditTrail.sol`
- [ ] File exists: `blockchain/scripts/deploy.js`
- [ ] File exists: `blockchain/hardhat.config.js`

#### Backend Layer
- [ ] Navigate to `backend/` folder
- [ ] Run `pip install -r requirements.txt`
- [ ] File exists: `backend/.env` with MongoDB URL
- [ ] File exists: `backend/app/main.py`
- [ ] File exists: `backend/app/hash_utils.py`

#### Frontend Layer
- [ ] Navigate to `frontend/audit-trail-system/` folder
- [ ] Run `npm install`
- [ ] File exists: `frontend/audit-trail-system/src/App.jsx`
- [ ] File exists: `frontend/audit-trail-system/src/context/BlockchainContext.jsx`
- [ ] File exists: `frontend/audit-trail-system/vite.config.js`

### 3. Start Services (In Order)

#### Terminal 1: Blockchain Node
```bash
cd blockchain
npm run node
```
- [ ] Terminal shows "Started HTTP and WebSocket JSON-RPC server"
- [ ] Shows 20 accounts with private keys
- [ ] Running on http://127.0.0.1:8545
- [ ] Keep this terminal open

#### Terminal 2: Deploy Contract
```bash
cd blockchain
npm run deploy
```
- [ ] Shows "Deploying AuditTrail contract..."
- [ ] Shows contract address (0x5FbDB2315678...)
- [ ] Shows "Deployment info saved to deployments/"
- [ ] Folder created: `blockchain/deployments/`
- [ ] File created: `blockchain/deployments/contract-address.json`
- [ ] File created: `blockchain/deployments/AuditTrail.json`

#### Terminal 3: Backend Server
```bash
cd backend
uvicorn app.main:app --reload --port 8000
```
- [ ] Shows "Application startup complete"
- [ ] Shows "Uvicorn running on http://127.0.0.1:8000"
- [ ] No error messages
- [ ] Keep this terminal open

#### Terminal 4: Frontend Server
```bash
cd frontend/audit-trail-system
npm run dev
```
- [ ] Shows "VITE v... ready in ... ms"
- [ ] Shows "Local: http://localhost:5173/"
- [ ] No error messages
- [ ] Keep this terminal open

### 4. MetaMask Configuration

#### Add Hardhat Local Network
- [ ] Open MetaMask
- [ ] Click network dropdown
- [ ] Click "Add network" → "Add network manually"
- [ ] Enter:
  - Network Name: `Hardhat Local`
  - RPC URL: `http://127.0.0.1:8545`
  - Chain ID: `31337`
  - Currency Symbol: `ETH`
- [ ] Click "Save"
- [ ] Select "Hardhat Local" network

#### Import Test Accounts
From Terminal 1 output, copy private keys and import:

- [ ] Account #0 (Admin)
  - Click MetaMask → Import Account
  - Paste private key from Terminal 1
  - Label: "Admin"

- [ ] Account #1 (Inspector)
  - Import Account
  - Paste private key
  - Label: "Inspector"

- [ ] Account #2 (Approver)
  - Import Account
  - Paste private key
  - Label: "Approver"

- [ ] Account #3 (Auditor)
  - Import Account
  - Paste private key
  - Label: "Auditor"

### 5. Test Basic Connectivity

#### Test Backend
- [ ] Open browser: http://localhost:8000
- [ ] Should show: `{"status":"Audit Trail Backend Running"}`
- [ ] Open: http://localhost:8000/docs
- [ ] Should show Swagger UI with API endpoints

#### Test Frontend
- [ ] Open browser: http://localhost:5173
- [ ] Should show "Audit Trail System" page
- [ ] Should show "Connect MetaMask" button
- [ ] No console errors (press F12)

#### Test MetaMask Connection
- [ ] Click "Connect MetaMask"
- [ ] MetaMask popup appears
- [ ] Click "Next" → "Connect"
- [ ] Page shows your wallet address
- [ ] Shows role badge (should be "NONE" initially)

### 6. Test Admin Flow

- [ ] Switch MetaMask to Account #0 (Admin)
- [ ] Refresh page
- [ ] Should show "Admin Dashboard"
- [ ] Copy Account #1 address from MetaMask
- [ ] Paste in input field
- [ ] Click "Register as Inspector"
- [ ] MetaMask popup appears
- [ ] Click "Confirm"
- [ ] Wait for confirmation
- [ ] Should show success message
- [ ] Repeat for Account #2 (Approver) and Account #3 (Auditor)

### 7. Test Inspector Flow

- [ ] Switch MetaMask to Account #1 (Inspector)
- [ ] Disconnect and reconnect wallet (to refresh role)
- [ ] Should show "Inspector Dashboard"
- [ ] Fill form:
  - Project ID: `TEST-001`
  - Location: `Test Building`
  - Strength: `Excellent`
  - Finish: `Good`
  - Remarks: `Test inspection`
- [ ] Click "Create Inspection"
- [ ] MetaMask popup appears
- [ ] Click "Confirm"
- [ ] Wait for confirmation
- [ ] Should show Report ID
- [ ] Copy Report ID
- [ ] Click "Submit for Approval"
- [ ] MetaMask popup appears
- [ ] Click "Confirm"
- [ ] Should show success message

### 8. Test Approver Flow

- [ ] Switch MetaMask to Account #2 (Approver)
- [ ] Refresh page
- [ ] Should show "Approver Dashboard"
- [ ] Paste Report ID
- [ ] Click "Load Inspection"
- [ ] Should show inspection details
- [ ] Status should be "SUBMITTED"
- [ ] Click "✅ Approve"
- [ ] MetaMask popup appears
- [ ] Click "Confirm"
- [ ] Wait for confirmation
- [ ] Status should change to "APPROVED"
- [ ] Should show "🔒 This inspection is approved and immutable"

### 9. Test Auditor Flow

- [ ] Switch MetaMask to Account #3 (Auditor)
- [ ] Refresh page
- [ ] Should show "Auditor Dashboard"
- [ ] Paste Report ID
- [ ] Click "Verify Inspection"
- [ ] Should show inspection details
- [ ] Should show hash comparison
- [ ] Should show "✅ AUTHENTIC"
- [ ] Hashes should match

### 10. Test Tampering Detection (Optional)

- [ ] Open MongoDB Compass or mongo shell
- [ ] Find the inspection document
- [ ] Modify any field (e.g., remarks)
- [ ] Go back to Auditor Dashboard
- [ ] Click "Verify Inspection" again
- [ ] Should show "❌ TAMPERED"
- [ ] Hashes should NOT match

### 11. Documentation Check

- [ ] File exists: `README.md` (main documentation)
- [ ] File exists: `DEMO_SCRIPT.md` (demo guide)
- [ ] File exists: `TROUBLESHOOTING.md` (common issues)
- [ ] File exists: `TECHNICAL_DEEP_DIVE.md` (interview prep)
- [ ] File exists: `ARCHITECTURE.md` (system diagrams)
- [ ] File exists: `PROJECT_COMPLETE.md` (summary)
- [ ] All documentation is readable and complete

### 12. Code Quality Check

- [ ] Smart contract compiles without errors
- [ ] Backend runs without errors
- [ ] Frontend runs without errors
- [ ] No console errors in browser
- [ ] All functions work as expected
- [ ] Code is clean and commented

### 13. Demo Preparation

- [ ] Practiced demo flow at least once
- [ ] Know how to explain architecture
- [ ] Can answer common questions
- [ ] Have backup plan if something breaks
- [ ] Screenshots/videos captured (optional)
- [ ] Presentation slides ready (optional)

### 14. Final Checks

- [ ] All 4 terminals running without errors
- [ ] MetaMask connected to Hardhat Local network
- [ ] All test accounts imported
- [ ] Can create, submit, approve, and verify inspections
- [ ] Tampering detection works
- [ ] All documentation is complete

---

## Common Issues to Check

### If MetaMask doesn't connect:
- [ ] Hardhat node is running
- [ ] Correct network selected (chainId 31337)
- [ ] MetaMask is unlocked
- [ ] Browser allows popups

### If transactions fail:
- [ ] Correct account selected
- [ ] Account has correct role
- [ ] Hardhat node hasn't restarted
- [ ] MetaMask nonce is correct (clear activity if needed)

### If frontend shows errors:
- [ ] Contract is deployed
- [ ] `deployments/` folder exists
- [ ] Backend is running
- [ ] CORS is configured correctly

### If backend shows errors:
- [ ] MongoDB is running
- [ ] `.env` file exists
- [ ] Dependencies are installed
- [ ] Port 8000 is not in use

---

## Emergency Reset Procedure

If everything is broken:

1. [ ] Stop all terminals (Ctrl+C)
2. [ ] Clear MetaMask activity data
3. [ ] Restart MongoDB
4. [ ] Start Hardhat node (Terminal 1)
5. [ ] Deploy contract (Terminal 2)
6. [ ] Start backend (Terminal 3)
7. [ ] Start frontend (Terminal 4)
8. [ ] Reconnect MetaMask
9. [ ] Re-register users

---

## Pre-Demo Checklist (5 minutes before)

- [ ] All services running
- [ ] MetaMask unlocked
- [ ] Correct network selected
- [ ] Test accounts ready
- [ ] Browser console open (F12)
- [ ] MongoDB Compass ready (for tampering demo)
- [ ] Demo script printed/open
- [ ] Confident and ready!

---

## Post-Demo Checklist

- [ ] Stop all services gracefully
- [ ] Save any important data
- [ ] Commit code to Git
- [ ] Push to GitHub
- [ ] Update documentation if needed
- [ ] Prepare for questions

---

## Success Criteria

Your project is ready when:

✅ All services start without errors
✅ MetaMask connects successfully
✅ Admin can register users
✅ Inspector can create and submit inspections
✅ Approver can approve inspections
✅ Auditor can verify integrity
✅ Tampering is detected correctly
✅ All documentation is complete
✅ You can explain the architecture
✅ You can answer technical questions

---

## Final Confidence Check

Rate your confidence (1-10) on:

- [ ] Starting all services: ___/10
- [ ] Explaining architecture: ___/10
- [ ] Demonstrating features: ___/10
- [ ] Answering questions: ___/10
- [ ] Troubleshooting issues: ___/10

If any score is below 7, review the relevant documentation.

---

## You're Ready When...

✅ All checkboxes above are checked
✅ You've done a complete test run
✅ You can explain why blockchain is needed
✅ You can explain the three-layer architecture
✅ You can demonstrate tampering detection
✅ You're confident in your understanding

---

**Good luck! You've got this! 🚀**

---

**Last Updated:** Before Demo
**Status:** Ready / Not Ready (circle one)
**Notes:** ___________________________________
