# 🎉 Complete Setup Guide - Audit Trail System

## 📋 Prerequisites Check

✅ Node.js installed  
✅ Python installed  
✅ MongoDB installed  
✅ MetaMask installed  
✅ Fin wallet DISABLED

## 🚀 Step-by-Step Startup Process

### Terminal 1: Start Hardhat Blockchain

```bash
cd "d:\Finalyear Projects\Audit-Trail-System-Block-Chain\blockchain"
npm run node
```

- Keep this running
- You'll see 20 test accounts with private keys
- Copy Account #0 private key (for Admin)

### Terminal 2: Deploy Smart Contract

```bash
cd "d:\Finalyear Projects\Audit-Trail-System-Block-Chain\blockchain"
npm run deploy
```

- Wait for "✅ Deployment info saved"
- Contract deployed!

### Terminal 3: Start Backend

```bash
cd "d:\Finalyear Projects\Audit-Trail-System-Block-Chain\backend"
uvicorn app.main:app --reload --port 8000
```

- Backend runs at http://localhost:8000
- Keep this running

### Terminal 4: Start Frontend

```bash
cd "d:\Finalyear Projects\Audit-Trail-System-Block-Chain\frontend\audit-trail-system"
npm run dev
```

- Frontend runs at http://localhost:5173
- Keep this running

## 🦊 MetaMask Setup

### 1. Import Admin Account

**IMPORTANT:** You MUST import Account #0 from Terminal 1 output

- Open MetaMask
- Click account icon → "Import Account"
- Select "Private Key"
- Paste EXACTLY this private key:
  ```
  0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
  ```
- Click "Import"
- **VERIFY:** The imported account address MUST be:
  ```
  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
  ```
- If you see a DIFFERENT address, you copied the wrong private key!

**To verify your accounts, run:**
```bash
cd "d:\Finalyear Projects\Audit-Trail-System-Block-Chain\blockchain"
node scripts/show-accounts.js
```

### 2. Verify Network

- Make sure "Hardhat Local" is selected
- Chain ID: 31337

## 🎬 Demo Flow

### Step 1: Connect as Admin

- Go to http://localhost:5173
- Click "Connect MetaMask"
- Approve connection
- You'll see "Admin Dashboard"

### Step 2: Register Users (Admin)

From Terminal 1, copy these addresses:

- Account #1 → Inspector
- Account #2 → Approver
- Account #3 → Auditor

In Admin Dashboard:

1. Paste Account #1 address → Select "Inspector" → Click "Register User" → Confirm in MetaMask
2. Paste Account #2 address → Select "Approver" → Click "Register User" → Confirm in MetaMask
3. Paste Account #3 address → Select "Auditor" → Click "Register User" → Confirm in MetaMask

### Step 3: Import Other Accounts to MetaMask

Import these accounts:

- Account #1 (Inspector) - Copy private key from Terminal 1
- Account #2 (Approver) - Copy private key from Terminal 1
- Account #3 (Auditor) - Copy private key from Terminal 1

### Step 4: Create Inspection (Inspector)

- Switch MetaMask to Account #1
- Refresh page → "Inspector Dashboard"
- Fill form:
  - Project ID: `PROJ-001`
  - Location: `Building A, Floor 3`
  - Strength: `Excellent`
  - Finish: `Good`
  - Remarks: `All quality checks passed`
- Click "Create Inspection" → Confirm in MetaMask
- Copy the Report ID (e.g., `507f1f77bcf86cd799439011`)
- Paste Report ID → Click "Submit for Approval" → Confirm in MetaMask

### Step 5: Approve Inspection (Approver)

- Switch MetaMask to Account #2
- Refresh page → "Approver Dashboard"
- Paste the Report ID
- Click "Load Inspection"
- Review details
- Click "✅ Approve" → Confirm in MetaMask
- Status changes to "APPROVED" 🔒

### Step 6: Verify Inspection (Auditor)

- Switch MetaMask to Account #3
- Refresh page → "Auditor Dashboard"
- Paste the Report ID
- Click "Verify Inspection"
- System shows:
  - ✅ AUTHENTIC (hashes match)
  - Blockchain hash
  - Calculated hash

## 🧪 Test Tampering (Optional)

1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Database: `audit_trail_db`
4. Collection: `inspections`
5. Find your inspection → Edit any field (e.g., change "Excellent" to "Poor")
6. Save
7. Go back to Auditor Dashboard → Verify again
8. System shows: ❌ TAMPERED

## 🎯 Summary

### 4 Terminals Running:

1. Hardhat node (blockchain)
2. Backend (FastAPI)
3. Frontend (React)
4. (Deploy terminal - can close after deployment)

### 4 MetaMask Accounts:

- Account #0 → Admin
- Account #1 → Inspector
- Account #2 → Approver
- Account #3 → Auditor

### Flow:

Admin registers users → Inspector creates → Inspector submits → Approver approves → Auditor verifies

## ⚠️ Troubleshooting

### Issue: Wrong address after importing private key

**Symptom:** After importing the private key, MetaMask shows address `0x21fedaf935dec152333f1ed125198a7045ac754b` or any address OTHER than `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`

**Cause:** You copied the wrong private key OR you're connecting with the wrong account in MetaMask.

**Solution:**

1. **Check which account MetaMask is using:**
   - Go to http://localhost:5173
   - Click "Show Diagnostic" button (top right)
   - Click "Request Account Access"
   - It will show which account is currently selected

2. **If the diagnostic shows the wrong account:**
   - Open MetaMask
   - Click on the account name at the top
   - You'll see a list of all your accounts
   - **Select the account with address:** `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
   - If you don't see this account, you need to import it

3. **To import the correct account:**
   - MetaMask → Click account icon → "Import Account"
   - Select "Private Key"
   - Paste: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
   - Click "Import"
   - **Verify the address is:** `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`

4. **Remove the wrong account (0x21fedaf935dec152333f1ed125198a7045ac754b):**
   - This is NOT a Hardhat account
   - MetaMask → Select this account → 3 dots → "Remove account"

5. **After fixing:**
   - Make sure the correct account is selected in MetaMask
   - Refresh the page
   - Click "Connect MetaMask"
   - **When MetaMask popup appears, make sure you're connecting with the correct account!**

### Issue: "No Role Assigned" when connecting as Admin

**Cause:** The Hardhat blockchain was restarted, making the deployed contract disappear.

**CRITICAL:** Hardhat runs an in-memory blockchain. When you stop Terminal 1, ALL deployed contracts are lost!

**Solution - Complete Restart:**

1. **Stop all terminals** (Ctrl+C on each)

2. **Terminal 1 - Start Hardhat:**
   ```bash
   cd "d:\Finalyear Projects\Audit-Trail-System-Block-Chain\blockchain"
   npm run node
   ```
   Keep this running! Don't close it!

3. **Terminal 2 - Deploy Contract:**
   ```bash
   cd "d:\Finalyear Projects\Audit-Trail-System-Block-Chain\blockchain"
   npm run deploy
   ```

4. **Copy contract files to frontend:**
   ```bash
   copy deployments\contract-address.json ..\frontend\audit-trail-system\src\contracts\contract-address.json
   copy deployments\AuditTrail.json ..\frontend\audit-trail-system\src\contracts\AuditTrail.json
   ```

5. **Terminal 3 - Start Backend:**
   ```bash
   cd "d:\Finalyear Projects\Audit-Trail-System-Block-Chain\backend"
   uvicorn app.main:app --reload --port 8000
   ```

6. **Terminal 4 - Start Frontend:**
   ```bash
   cd "d:\Finalyear Projects\Audit-Trail-System-Block-Chain\frontend\audit-trail-system"
   npm run dev
   ```

7. **Clear MetaMask:**
   - Settings → Advanced → Clear activity tab data
   - Disconnect wallet from site

8. **Reconnect with Account #0:**
   - Make sure you're using the account with private key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
   - Connect to http://localhost:5173
   - You should now see "Admin Dashboard"

### Issue: MetaMask shows wrong balance or nonce errors

**Solution:**

- MetaMask → Settings → Advanced → Clear activity tab data
- Disconnect and reconnect wallet

### Issue: Contract files not updating in frontend

**Solution:**

After deploying, manually copy the files:

```bash
cd "d:\Finalyear Projects\Audit-Trail-System-Block-Chain\blockchain"
copy deployments\contract-address.json ..\frontend\audit-trail-system\src\contracts\contract-address.json
copy deployments\AuditTrail.json ..\frontend\audit-trail-system\src\contracts\AuditTrail.json
```

### Issue: "Inspection already exists"

**Solution:**

- Each inspection needs a unique Report ID
- The Report ID is auto-generated by MongoDB
- Create a new inspection instead of reusing an old ID
