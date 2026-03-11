# 🚀 Quick Start - Run This Every Time

## ⚠️ IMPORTANT: Hardhat blockchain is IN-MEMORY
When you close Terminal 1, ALL contracts are deleted!
You MUST follow this sequence every time you start.

## Step-by-Step (4 Terminals)

### Terminal 1: Blockchain (NEVER CLOSE THIS!)
```bash
cd "d:\Finalyear Projects\Audit-Trail-System-Block-Chain\blockchain"
npm run node
```
✅ Keep running
✅ Copy Account #0 private key for later

---

### Terminal 2: Deploy Contract
```bash
cd "d:\Finalyear Projects\Audit-Trail-System-Block-Chain\blockchain"
npm run deploy
```
✅ Wait for "✅ Files copied to frontend!"
✅ Note the Admin account address
✅ Can close this terminal after deployment

---

### Terminal 3: Backend
```bash
cd "d:\Finalyear Projects\Audit-Trail-System-Block-Chain\backend"
uvicorn app.main:app --reload --port 8000
```
✅ Keep running

---

### Terminal 4: Frontend
```bash
cd "d:\Finalyear Projects\Audit-Trail-System-Block-Chain\frontend\audit-trail-system"
npm run dev
```
✅ Keep running
✅ Open http://localhost:5173

---

## MetaMask Setup (First Time Only)

1. **Import Account #0:**
   - Private Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
   - This is your ADMIN account

2. **Clear MetaMask cache:**
   - Settings → Advanced → Clear activity tab data

3. **Connect to app:**
   - Go to http://localhost:5173
   - Click "Connect MetaMask"
   - Should see "Admin Dashboard"

---

## ❌ Common Mistakes

### Mistake 1: Closing Terminal 1
**Problem:** Contract disappears
**Solution:** Never close Terminal 1. If you do, restart from Step 1.

### Mistake 2: Not redeploying after restart
**Problem:** "No Role Assigned" error
**Solution:** Always run `npm run deploy` after starting Hardhat node

### Mistake 3: Wrong account imported
**Problem:** Shows different address than `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
**Solution:** Import the correct Account #0 private key

### Mistake 4: Not clearing MetaMask
**Problem:** Nonce errors, wrong balance
**Solution:** Settings → Advanced → Clear activity tab data

---

## ✅ Success Checklist

- [ ] Terminal 1 running (Hardhat node)
- [ ] Terminal 2 deployed successfully
- [ ] Terminal 3 running (Backend)
- [ ] Terminal 4 running (Frontend)
- [ ] MetaMask connected to Hardhat Local (Chain ID: 31337)
- [ ] Using Account #0 (address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266)
- [ ] See "Admin Dashboard" on screen

---

## 🎯 Now You Can Start Demo

Follow the steps in DemoProcess.md starting from "Step 2: Register Users"
