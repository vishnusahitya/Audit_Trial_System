# 🔧 Troubleshooting Guide

## Common Errors and Solutions

### 1. Blockchain Errors

#### Error: "Network error: could not detect network"
**Cause:** Hardhat node is not running or wrong RPC URL

**Solution:**
```bash
# Terminal 1: Start Hardhat node
cd blockchain
npm run node
```

Check MetaMask RPC URL is: `http://127.0.0.1:8545`

---

#### Error: "Nonce too high"
**Cause:** MetaMask nonce out of sync (happens when Hardhat restarts)

**Solution:**
1. Open MetaMask
2. Click account icon → Settings → Advanced
3. Click "Clear activity tab data"
4. Refresh page

---

#### Error: "Contract not deployed"
**Cause:** Contract address not found or Hardhat restarted

**Solution:**
```bash
# Redeploy contract
cd blockchain
npm run deploy
```

Then restart frontend:
```bash
cd frontend/audit-trail-system
npm run dev
```

---

#### Error: "Only admin can perform this action"
**Cause:** Trying to register users with non-admin account

**Solution:**
- Only Account #0 (deployer) is admin
- Switch MetaMask to Account #0
- Refresh page

---

#### Error: "Only inspector can perform this action"
**Cause:** Account not registered as inspector

**Solution:**
1. Switch to Account #0 (admin)
2. Register the account as inspector
3. Switch back to inspector account
4. **IMPORTANT:** Disconnect and reconnect wallet
5. Refresh page

---

#### Error: "Inspection already exists"
**Cause:** Trying to create inspection with same reportId

**Solution:**
- Each inspection gets unique MongoDB ObjectId
- Create a new inspection (don't reuse reportId)
- If testing, clear MongoDB collection

---

#### Error: "Inspection is already approved and immutable"
**Cause:** Trying to modify approved inspection

**Solution:**
- This is EXPECTED behavior
- Approved inspections cannot be modified
- This is the core security feature
- Create a new inspection instead

---

### 2. Backend Errors

#### Error: "Database connection failed"
**Cause:** MongoDB not running

**Solution:**
```bash
# Windows
net start MongoDB

# Linux/Mac
sudo systemctl start mongod
```

---

#### Error: "CORS error"
**Cause:** Frontend running on different port

**Solution:**
Check `backend/app/main.py`:
```python
allow_origins=["http://localhost:5173", "http://localhost:3000"]
```

Add your frontend port if different.

---

#### Error: "Module not found"
**Cause:** Dependencies not installed

**Solution:**
```bash
cd backend
pip install -r requirements.txt
```

---

### 3. Frontend Errors

#### Error: "Cannot find module '../../../blockchain/deployments/...'"
**Cause:** Contract not deployed yet

**Solution:**
```bash
cd blockchain
npm run deploy
```

This creates the `deployments/` folder.

---

#### Error: "MetaMask not installed"
**Cause:** MetaMask extension not installed

**Solution:**
1. Install MetaMask from https://metamask.io
2. Create wallet
3. Refresh page

---

#### Error: "Please connect to Hardhat Local Network"
**Cause:** Connected to wrong network

**Solution:**
1. Open MetaMask
2. Click network dropdown
3. Select "Hardhat Local" (chainId 31337)
4. If not listed, add manually:
   - RPC: http://127.0.0.1:8545
   - Chain ID: 31337

---

#### Error: "User rejected transaction"
**Cause:** Clicked "Reject" in MetaMask

**Solution:**
- This is normal
- Try action again
- Click "Confirm" in MetaMask

---

#### Error: "Insufficient funds"
**Cause:** Account has no ETH

**Solution:**
- Use test accounts from Hardhat node
- Each has 10000 ETH
- Import private key from Terminal 1 output

---

### 4. MetaMask Issues

#### Issue: MetaMask popup doesn't appear
**Possible causes:**
1. MetaMask locked → Unlock it
2. Popup blocked → Allow popups for localhost
3. Wrong network → Switch to Hardhat Local
4. Extension disabled → Enable MetaMask extension

**Debug steps:**
1. Open browser console (F12)
2. Look for errors
3. Check MetaMask is unlocked
4. Check network is correct

---

#### Issue: Transaction stuck "Pending"
**Cause:** Hardhat node restarted while transaction pending

**Solution:**
1. MetaMask → Settings → Advanced
2. "Clear activity tab data"
3. Refresh page
4. Try again

---

#### Issue: Wrong account connected
**Solution:**
1. Click MetaMask extension
2. Click account dropdown
3. Select correct account
4. Page auto-refreshes

---

### 5. Role Issues

#### Issue: "No Role Assigned" message
**Cause:** Account not registered by admin

**Solution:**
1. Copy your wallet address
2. Switch to Account #0 (admin)
3. Register your address with appropriate role
4. Switch back to your account
5. **Disconnect and reconnect wallet**
6. Refresh page

---

#### Issue: Role doesn't update after registration
**Cause:** Frontend cached old role

**Solution:**
1. Click "Disconnect" button
2. Click "Connect MetaMask" again
3. Role should update

---

### 6. Verification Issues

#### Issue: "Verification failed: Invalid report ID"
**Cause:** Wrong reportId format or doesn't exist

**Solution:**
- reportId is MongoDB ObjectId (24 hex characters)
- Example: `507f1f77bcf86cd799439011`
- Copy exact ID from inspector dashboard

---

#### Issue: Shows "TAMPERED" but data not modified
**Cause:** Hash calculation mismatch

**Debug:**
1. Check backend logs
2. Verify data structure matches
3. Check `createdAt` timestamp format
4. Ensure `images` array exists (even if empty)

---

### 7. Development Issues

#### Issue: Changes not reflecting
**Solution:**
```bash
# Frontend
Ctrl+C
npm run dev

# Backend
Ctrl+C
uvicorn app.main:app --reload --port 8000

# Blockchain (if contract changed)
Ctrl+C
npm run node
# In new terminal:
npm run deploy
```

---

#### Issue: Port already in use
**Solution:**
```bash
# Windows - Kill process on port 8545
netstat -ano | findstr :8545
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8545 | xargs kill -9
```

---

## 🔍 Debugging Checklist

Before asking for help, verify:

- [ ] Hardhat node running (Terminal 1)
- [ ] Contract deployed (check `blockchain/deployments/`)
- [ ] Backend running on port 8000
- [ ] Frontend running on port 5173
- [ ] MongoDB running
- [ ] MetaMask installed and unlocked
- [ ] Connected to Hardhat Local network (chainId 31337)
- [ ] Using correct account for role
- [ ] Browser console shows no errors

---

## 🚨 Critical Bugs (Report These)

### Bug: MetaMask doesn't pop up for transaction
**This is a BUG if:**
- MetaMask is unlocked
- Correct network selected
- No console errors
- Button click does nothing

**Debug:**
```javascript
// Check in browser console
console.log(window.ethereum); // Should not be undefined
console.log(await window.ethereum.request({ method: 'eth_accounts' }));
```

---

### Bug: Transaction succeeds but state doesn't update
**This is a BUG if:**
- Transaction confirmed in MetaMask
- Transaction hash shown
- But blockchain state unchanged

**Debug:**
```bash
# Check Hardhat node terminal for transaction logs
# Should show: "eth_sendRawTransaction"
```

---

## 📞 Getting Help

1. Check this troubleshooting guide first
2. Check browser console (F12) for errors
3. Check Hardhat node terminal for errors
4. Check backend terminal for errors
5. Provide error message and steps to reproduce

---

## 🔄 Complete Reset (Nuclear Option)

If everything is broken:

```bash
# 1. Stop all terminals (Ctrl+C)

# 2. Clear MetaMask
# Settings → Advanced → Clear activity tab data

# 3. Restart Hardhat
cd blockchain
npm run node

# 4. Redeploy (new terminal)
cd blockchain
npm run deploy

# 5. Clear MongoDB (optional)
mongo
use audit_trail_db
db.inspections.deleteMany({})
exit

# 6. Restart backend
cd backend
uvicorn app.main:app --reload --port 8000

# 7. Restart frontend
cd frontend/audit-trail-system
npm run dev

# 8. Reconnect MetaMask
# Disconnect → Connect → Select Account #0
```

---

## 💡 Pro Tips

1. **Keep Hardhat terminal visible** - Shows all transactions in real-time
2. **Use different browsers for different roles** - Easier than switching accounts
3. **Bookmark localhost URLs** - Quick access
4. **Save test account private keys** - Don't lose them
5. **Use MongoDB Compass** - Visual database inspection
6. **Enable MetaMask test networks** - Settings → Advanced → Show test networks

---

## 🎯 Performance Tips

1. **Don't restart Hardhat unnecessarily** - Loses all state
2. **Use `--reload` for backend** - Auto-restarts on code changes
3. **Use Vite HMR** - Frontend updates without refresh
4. **Clear browser cache if UI broken** - Ctrl+Shift+R

---

## 📚 Additional Resources

- Hardhat Docs: https://hardhat.org/docs
- ethers.js v6 Docs: https://docs.ethers.org/v6/
- FastAPI Docs: https://fastapi.tiangolo.com/
- MetaMask Docs: https://docs.metamask.io/

---

**Remember:** Most issues are solved by:
1. Restarting Hardhat node
2. Redeploying contract
3. Clearing MetaMask activity
4. Reconnecting wallet
