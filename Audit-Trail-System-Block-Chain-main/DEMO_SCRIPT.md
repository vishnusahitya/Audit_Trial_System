# 🎬 Demo Script - Quick Reference

## Pre-Demo Checklist (5 minutes before)

- [ ] Start Hardhat node: `cd blockchain && npm run node`
- [ ] Deploy contract: `cd blockchain && npm run deploy` (new terminal)
- [ ] Start MongoDB
- [ ] Start backend: `cd backend && uvicorn app.main:app --reload --port 8000`
- [ ] Start frontend: `cd frontend/audit-trail-system && npm run dev`
- [ ] Import 4 test accounts in MetaMask
- [ ] Add Hardhat Local network to MetaMask
- [ ] Open http://localhost:5173

---

## Demo Flow (10-15 minutes)

### Part 1: System Overview (2 min)
**Say:**
> "This is an immutable audit trail system for quality inspections using blockchain. The key innovation is that once an inspection is approved, it becomes permanently locked and tamper-proof."

**Show architecture diagram from README**

---

### Part 2: Admin Role (2 min)

**Do:**
1. Connect with Account #0
2. Show "Admin Dashboard"
3. Copy Account #1 address
4. Click "Register as Inspector"
5. **Point out MetaMask popup** ← CRITICAL
6. Confirm transaction
7. Repeat for Account #2 (Approver) and Account #3 (Auditor)

**Say:**
> "Notice how every blockchain operation requires MetaMask confirmation. The backend never signs transactions - only the user can authorize changes. This ensures non-repudiation."

---

### Part 3: Inspector Creates Inspection (3 min)

**Do:**
1. Switch MetaMask to Account #1
2. Refresh page → "Inspector Dashboard"
3. Fill form:
   ```
   Project ID: PROJ-001
   Location: Building A, Floor 3
   Strength: Excellent
   Finish: Good
   Remarks: All quality parameters meet specifications
   ```
4. Click "Create Inspection"
5. **Show MetaMask popup**
6. Confirm transaction
7. **Copy Report ID** (show it clearly)
8. Click "Submit for Approval"
9. Confirm in MetaMask

**Say:**
> "The inspection data is stored in MongoDB, but its SHA-256 hash is stored on blockchain. This gives us the best of both worlds: fast queries and tamper-proof integrity."

**Open browser console and show:**
- Backend API call
- Hash generation
- Blockchain transaction

---

### Part 4: Approver Reviews (3 min)

**Do:**
1. Switch MetaMask to Account #2
2. Refresh → "Approver Dashboard"
3. Paste Report ID
4. Click "Load Inspection"
5. **Point out status: SUBMITTED**
6. Review details
7. Click "✅ Approve"
8. Confirm in MetaMask
9. **Show status change to APPROVED**

**Say:**
> "Once approved, this inspection is permanently locked. The smart contract enforces immutability - even the admin cannot modify it. Let me demonstrate..."

**Try to approve again:**
- Click "Load Inspection"
- Show "🔒 This inspection is approved and immutable"

---

### Part 5: Auditor Verifies Integrity (3 min)

**Do:**
1. Switch MetaMask to Account #3
2. Refresh → "Auditor Dashboard"
3. Paste Report ID
4. Click "Verify Inspection"
5. **Show hash comparison:**
   - Blockchain hash
   - Calculated hash
   - ✅ AUTHENTIC

**Say:**
> "The auditor recalculates the hash from the database and compares it with the immutable blockchain hash. They match, so the data is authentic."

---

### Part 6: Demonstrate Tampering Detection (2 min)

**Do:**
1. Open MongoDB Compass (or mongo shell)
2. Find the inspection document
3. Modify the "remarks" field
4. Go back to Auditor Dashboard
5. Click "Verify Inspection" again
6. **Show ❌ TAMPERED**
7. **Show hash mismatch**

**Say:**
> "I've modified the database directly. Now when we verify, the hashes don't match. The blockchain hash is immutable, so we can instantly detect tampering. This is the core security feature."

---

## Key Talking Points

### Technical Architecture
- **Three-layer design:** Frontend (React) → Backend (FastAPI) → Blockchain (Solidity)
- **Backend never signs transactions:** All writes go through MetaMask
- **Hash-based integrity:** SHA-256 stored on-chain, full data off-chain
- **Role-based access control:** Enforced by smart contract, not just UI

### Security Features
- **Immutability:** Approved inspections cannot be modified
- **Transparency:** All hashes and state changes on public ledger
- **Non-repudiation:** Every action signed by user's private key
- **Integrity verification:** Instant tampering detection

### Why Blockchain?
- **Traditional databases can be modified:** Even with audit logs, admins can alter data
- **Blockchain provides immutability:** Once written, cannot be changed
- **Decentralized trust:** No single point of control
- **Cryptographic proof:** Mathematical certainty of data integrity

### Real-World Use Cases
- Government quality inspections
- Construction site audits
- Manufacturing quality control
- Regulatory compliance
- Supply chain verification
- Medical device inspections

---

## Common Demo Questions & Answers

### Q: "Why not store everything on blockchain?"
**A:** "Storing large data on-chain is expensive and slow. We store only the hash (32 bytes), which is sufficient to prove integrity. Full data lives in MongoDB for fast queries."

### Q: "What if someone hacks MongoDB?"
**A:** "They can modify the data, but they cannot modify the blockchain hash. When we verify, the hash mismatch will immediately reveal the tampering."

### Q: "Can the admin override approvals?"
**A:** "No. The smart contract enforces immutability. Even the admin cannot modify approved inspections. This is enforced at the blockchain level."

### Q: "What happens if Hardhat node restarts?"
**A:** "In production, we'd deploy to a persistent network like Ethereum mainnet or a private consortium chain. Hardhat is just for development."

### Q: "How do you handle scalability?"
**A:** "We only store hashes on-chain, not full data. This keeps gas costs low. For high throughput, we could use Layer 2 solutions or private chains."

### Q: "Is this production-ready?"
**A:** "The architecture is production-grade. For deployment, we'd need: proper key management, deploy to testnet/mainnet, add monitoring, implement backup strategies, and add more comprehensive error handling."

---

## Backup Demo (If Something Breaks)

### If MetaMask issues:
- Show code walkthrough instead
- Explain ethers.js v6 BrowserProvider
- Show smart contract functions

### If blockchain issues:
- Show backend API with Postman/curl
- Demonstrate hash generation
- Show MongoDB data

### If everything breaks:
- Show architecture diagram
- Walk through code
- Explain design decisions
- Show README documentation

---

## Post-Demo

### Show them:
1. **README.md** - Complete documentation
2. **TROUBLESHOOTING.md** - Common issues
3. **Smart contract code** - Explain key functions
4. **Frontend code** - Show ethers.js v6 usage

### Offer to demonstrate:
- Code walkthrough
- Deployment to testnet
- Additional features (file upload, notifications)
- Integration with existing systems

---

## Time Allocations

- **5 min:** Setup and overview
- **2 min:** Admin role management
- **3 min:** Inspector creates inspection
- **3 min:** Approver reviews and approves
- **2 min:** Auditor verifies integrity
- **2 min:** Demonstrate tampering detection
- **3 min:** Q&A

**Total: 20 minutes**

---

## Emergency Contacts

- Hardhat Docs: https://hardhat.org
- ethers.js v6: https://docs.ethers.org/v6/
- Solidity Docs: https://docs.soliditylang.org

---

## Final Checklist Before Demo

- [ ] All terminals running
- [ ] MetaMask unlocked
- [ ] Correct network selected
- [ ] Test accounts imported
- [ ] Browser console open (F12)
- [ ] MongoDB Compass ready (for tampering demo)
- [ ] Report ID copied and ready
- [ ] Backup plan prepared

---

**Good luck! 🚀**
