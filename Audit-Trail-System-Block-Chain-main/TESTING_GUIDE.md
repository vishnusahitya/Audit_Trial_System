# 🧪 File Upload & Tampering Detection - Complete Testing Guide

## ⚠️ IMPORTANT: Fresh Start Instructions

Before testing, you must do a complete restart to clear all caches:

### Step 1: Stop All Processes
```bash
# Stop all running services:
# 1. Close all terminal windows with npm run dev, uvicorn, hardhat node
# 2. Kill any lingering Node processes
# 3. Kill any lingering Python processes
```

### Step 2: Clear Caches & Databases
```bash
# Clear browser cache
# 1. Open MetaMask
# 2. Click Settings > Advanced > Clear activity and nonce data
# 3. Clear browser cookies/cache (Ctrl+Shift+Delete)

# Clear old contract deployments
cd blockchain
rm -rf artifacts/ cache/ deployments/contract-address.json
```

### Step 3: Restart in This Order

#### Terminal 1: Hardhat Blockchain
```bash
cd blockchain
npm run node
# Wait for "Started HTTP and WebSocket JSON-RPC server"
```

#### Terminal 2: Smart Contract Deployment
```bash
# Open NEW terminal
cd blockchain
npm run deploy
# Wait for "✅ Deployment info saved to deployments/"
```

#### Terminal 3: Backend API
```bash
# Open NEW terminal
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
# Wait for "Uvicorn running on http://0.0.0.0:8000"
```

#### Terminal 4: Frontend
```bash
# Open NEW terminal
cd frontend/audit-trail-system
npm run dev
# Wait for "Local: http://localhost:5173"
```

### Step 4: Setup MetaMask
1. Open MetaMask
2. Add Custom RPC:
   - Network Name: **Hardhat Local**
   - RPC URL: **http://127.0.0.1:8545**
   - Chain ID: **31337**
   - Currency: **ETH**
3. Import Account (Account 0 from Hardhat):
   - Private Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb476c6b8d6c1f20f56efc1271821`
   - This is the ADMIN account

### Step 5: Verify Setup
✅ Hardhat blockchain running (Terminal 1)  
✅ Contract deployed (Terminal 2 shows "0x..." address)  
✅ Backend running (Terminal 3 shows "Uvicorn running")  
✅ Frontend accessible (Terminal 4 shows local URL)  
✅ MetaMask connected to Hardhat Local network  
✅ Account shows some ETH (from faucet)  

---

## Pre-Testing Checklist

- [ ] Hardhat node running (`npm run node`)
- [ ] Contract deployed (`npm run deploy`)
- [ ] Backend API running (`python -m uvicorn ...`)
- [ ] Frontend running (`npm run dev`)
- [ ] MetaMask installed and connected to Hardhat Local
- [ ] MetaMask account has ETH balance
- [ ] No errors in browser console (F12)
- [ ] No errors in terminal windows

---

## Test Setup

### 1. Create Test Excel Files

#### Test File 1: Original Data
**File**: `test_data_original.xlsx`
```
Column A: Name        Column B: Value
Row 1: Apple          100
Row 2: Banana         200
Row 3: Cherry         150
```

#### Test File 2: Modified Data
**File**: `test_data_modified.xlsx`
```
Column A: Name        Column B: Value
Row 1: Apple          100
Row 2: Banana         250   ← CHANGED (was 200)
Row 3: Cherry         150
```

#### Test File 3: CSV Format
**File**: `test_data.csv`
```
Name,Value
Apple,100
Banana,200
Cherry,150
```

#### Test File 4: .xls Format (Excel Legacy)
Create an `.xls` file with same data as test_data_original.xlsx using Excel or LibreOffice.

---

## Test Scenario 1: Basic File Upload

**Objective**: Verify file upload and hash generation works

### Prerequisites:
- ✅ All services running and connected
- ✅ MetaMask connected
- ✅ Test files created

### Steps:
1. Open `http://localhost:5173` in browser
2. Click **Wallet Connection** button
3. Approve MetaMask connection
4. Verify your address shows in navbar
5. Click **File Management** in sidebar
6. Click **📤 Upload File** tab
7. Click **📁 Select File (Excel/CSV)**
8. Select `test_data_original.xlsx`
9. Wait for upload to complete

### Expected Results:
✅ File upload completes without errors  
✅ SHA-256 hash displays (64 hex characters)  
✅ File ID displayed  
✅ File size shows (in KB)  
✅ Message: "✅ File uploaded successfully!"  
✅ Backend logs show: `POST /api/files/upload 200`

### Verification:
```
✓ Hash format: abc123def456...abc123def456 (exactly 64 chars, lowercase hex)
✓ File size matches actual file size
✓ File ID is a UUID (36 chars)
✓ No error messages in console
```

### Troubleshooting:
| Error | Solution |
|-------|----------|
| "File is empty" | File size > 0 KB |
| "Failed to parse Excel" | Use valid .xlsx/.xls/.csv file |
| "Network error" | Check backend is running on port 8000 |

---

## Test Scenario 2: Store Hash on Blockchain

**Objective**: Verify hash can be stored on blockchain (requires admin role)

### Prerequisites:
- ✅ Completed Test Scenario 1
- ✅ MetaMask connected with ADMIN account
- ✅ Hash visible on screen

### Steps:
1. From Test Scenario 1, scroll down to see the hash
2. Copy the hash value (optional, for verification)
3. Click **⛓️ Store Hash on Blockchain** button
4. **MetaMask popup** should appear
5. Review transaction details
6. Click **Confirm** in MetaMask
7. Wait for transaction confirmation (~12 seconds)

### Expected Results:
✅ MetaMask popup appears with transaction details  
✅ Transaction submitted to blockchain  
✅ Status updates to "⏳ Transaction pending..."  
✅ Success message shows: "✅ Hash stored on blockchain!"  
✅ Transaction hash displayed (starts with "0x")  
✅ Block number displayed  

### Verification:
```
Message format:
  ✅ Hash stored on blockchain!
  Transaction: 0x1234567890abcdef...
  Block: 12345

Backend logs show:
  POST /api/files/upload 200 OK
  Contract interaction successful
```

### Troubleshooting:
| Error | Solution |
|-------|----------|
| "Only inspector can perform this action" | Must be connected as ADMIN account |
| "execution reverted" | Check account has ETH for gas fees |
| "Contract not available" | Refresh page and reconnect wallet |

---

## Test Scenario 3: File Verification (Re-upload)

**Objective**: Verify file integrity detection works

### Prerequisites:
- ✅ Completed Test Scenario 1 & 2
- ✅ Original file hash stored on blockchain
- ✅ Have original test file

### Steps:
1. Click **✅ Verify File** tab
2. Scroll to **Method 1: Re-upload File**
3. Enter the File ID (from upload step) in "Enter File ID" field
4. Click **📁 Select File for Verification**
5. Select the **SAME** `test_data_original.xlsx` file
6. Wait for verification

### Expected Results:
✅ Verification completes successfully  
✅ Message: "✅ File is authentic and matches original"  
✅ Both hashes match  
✅ "Hashes match" indicator shows green  

### Verification:
```
Original Hash: abc123def456...
Re-uploaded Hash: abc123def456...
Status: ✅ Authentic
```

---

## Test Scenario 4: Tampering Detection

**Objective**: Verify that modified files are detected as tampered

### Prerequisites:
- ✅ Completed Test Scenario 1 & 2
- ✅ Original file stored on blockchain
- ✅ Have MODIFIED test file

### Steps:
1. From Test Scenario 3 setup (Verify File tab)
2. Enter the same File ID
3. Click **📁 Select File for Verification**
4. Select the **MODIFIED** `test_data_modified.xlsx` file
5. Wait for verification

### Expected Results:
✅ Verification completes  
✅ Message: "❌ FILE HAS BEEN TAMPERED! Hashes do not match."  
✅ **Original Hash** ≠ **Current Hash**  
✅ Tampering alert shows  

### Verification:
```
Original Hash: abc123def456...
Modified Hash: xyz789abc123...
Status: ❌ Tampered
Detected: YES
```

**IMPORTANT**: This proves tampering detection works! If hashes match, the file is authentic. If they differ, tampering was detected.

---

## Test Scenario 5: Multiple File Format Support

**Objective**: Verify .xlsx, .xls, and .csv files all work

### Prerequisites:
- ✅ Test files created in all 3 formats
- ✅ All services running

### Steps for Each File:
1. Upload `test_data_original.xlsx` → Store hash → Verify
2. Upload `test_data.csv` → Store hash → Verify  
3. Upload test file in `.xls` format → Store hash → Verify

### Expected Results for Each:
✅ Upload succeeds  
✅ Hash generates correctly  
✅ Hash stores on blockchain  
✅ Re-upload verification works  
✅ No format-specific errors  

### Verification:
```
.xlsx: ✅ Works
.xls:  ✅ Works
.csv:  ✅ Works

All formats: Hash stored, verification works
```

---

## Test Scenario 6: File History

**Objective**: Verify file history tracking and verification records

### Prerequisites:
- ✅ Completed previous test scenarios
- ✅ Multiple files uploaded and verified

### Steps:
1. Click **📋 File History** tab
2. Review table of all uploaded files
3. Check columns: File Name, File ID, Uploaded At, Hash, Status
4. Verify shows verification count and last verified time

### Expected Results:
✅ Table displays all uploaded files  
✅ File details are accurate  
✅ Verification count matches actual verifications  
✅ Last verified shows correct timestamp  
✅ Status shows "✅ Authentic" or "⚠️ Tampered" correctly  

### Verification:
```
File History Table:
  ✓ File Name: test_data_original.xlsx
  ✓ File ID: (UUID)
  ✓ Uploaded At: (timestamp)
  ✓ Hash: (64 char hex)
  ✓ Verifications: 1
  ✓ Status: ✅ Authentic
```

---

## Complete Test Workflow (All Tests in Order)

1. **Setup** → Follow "Fresh Start Instructions"
2. **Test 1** → Upload file → Get hash
3. **Test 2** → Store hash on blockchain
4. **Test 3** → Verify with original file → See "Authentic"
5. **Test 4** → Verify with modified file → See "Tampered"
6. **Test 5** → Repeat with .csv and .xls files
7. **Test 6** → Check file history table

**Total Time**: ~15-20 minutes per full test cycle

---

## Common Issues & Solutions

### Issue: "MetaMask Popup Not Appearing"
**Solution**:
1. Check if MetaMask is in focus
2. Check console for errors (F12)
3. Reconnect wallet
4. Try different browser

### Issue: "File Upload Fails with Network Error"
**Solution**:
1. Check backend running: `http://localhost:8000/`
2. Check backend logs for errors
3. Restart backend
4. Check MongoDB connection

### Issue: "Hash Not Storing on Blockchain"
**Solution**:
1. Verify MetaMask connected to Hardhat Local (Chain ID 31337)
2. Check account has ETH balance
3. Check browser console for errors
4. Refresh page and try again

### Issue: "Same Hash for Different Files"
**Possible Cause**: Two test files are actually identical
**Solution**: Ensure test files have different content

### Issue: "File History Shows Wrong Verification Count"
**Solution**:
1. Refresh page
2. Check backend MongoDB collection
3. Clear browser cache
4. Restart backend and frontend

---

## Performance Expectations

| Operation | Expected Time |
|-----------|-----------------|
| File Upload | 1-3 seconds |
| Hash Generation | < 1 second |
| Store to Blockchain | 10-15 seconds (including confirmation) |
| File Verification | 2-5 seconds |
| History Load | < 1 second |

---

## Security Verification Checklist

After completing all tests, verify:

- [ ] File hashes are 64 characters (SHA-256)
- [ ] Same file produces same hash always
- [ ] Modified file produces different hash
- [ ] Hashes immutable on blockchain
- [ ] Verification history recorded
- [ ] Tampering detection works
- [ ] Multiple formats supported
- [ ] No sensitive data in logs

---

## Success Criteria

✅ **Test Passed** when:
1. All file formats upload successfully
2. Hashes store on blockchain without errors
3. Original files verify as authentic
4. Modified files detected as tampered
5. File history accurate and complete
6. No unhandled errors in console
7. Backend logs show no errors
8. Blockchain transactions confirm

**If any criterion fails, check troubleshooting section above.**
````

---

## Test Scenario 3: Re-upload & Verify (Authentic File)

**Objective**: Verify same file is detected as authentic

### Prerequisites:
- Completed Test Scenarios 1 & 2
- Original `test_data_original.xlsx` available

### Steps:
1. Click **✅ Verify File** tab
2. **Method 1: Re-upload**
   - Enter File ID from upload
   - Click "📁 Select File for Verification"
   - Select the **same** `test_data_original.xlsx`
   - Wait for result

### Expected Results:
- ✅ Verification completes
- ✅ Message shows "✅ File is authentic"
- ✅ Hashes match
- ✅ Green success styling

### Verification:
```
Result shows:
  "File is authentic and matches original"
  Original Hash: abc123...
  Current Hash:  abc123...
  Status: ✅ MATCH
```

---

## Test Scenario 4: Re-upload & Verify (Modified File)

**Objective**: Verify modified file is detected as tampered

### Prerequisites:
- Completed Test Scenarios 1 & 2
- Have both `test_data_original.xlsx` and `test_data_modified.xlsx`

### Steps:
1. Click **✅ Verify File** tab
2. **Method 1: Re-upload**
   - Enter File ID from original upload
   - Click "📁 Select File for Verification"
   - Select the **modified** `test_data_modified.xlsx`
   - Wait for result

### Expected Results:
- ✅ Verification completes
- ✅ Message shows "❌ FILE HAS BEEN TAMPERED!"
- ✅ Hashes DO NOT match
- ✅ Red error styling

### Verification:
```
Result shows:
  "FILE HAS BEEN TAMPERED!"
  Original Hash: abc123...
  Current Hash:  xyz789...
  Status: ❌ NO MATCH - TAMPERING DETECTED!
```

---

## Test Scenario 5: Blockchain Hash Verification

**Objective**: Verify file using blockchain-stored hash

### Prerequisites:
- Completed Test Scenarios 1 & 2
- Have the blockchain hash from smart contract

### Steps:
1. Click **✅ Verify File** tab
2. **Method 2: Verify with Blockchain Hash**
   - Enter File ID
   - Enter blockchain hash (from step 2)
   - Click **✅ Verify**

### Expected Results:
- ✅ Instant verification (no blockchain needed)
- ✅ Matches blockchain hash
- ✅ Green success message
- ✅ Shows both hashes

### Verification:
```
Result shows:
  "File is authentic"
  File ID: [correct ID]
  File Name: test_data_original.xlsx
  Status: ✅ MATCH
```

---

## Test Scenario 6: File History

**Objective**: Verify all files and verifications are tracked

### Prerequisites:
- Completed Tests 1-5
- Have uploaded and verified multiple files

### Steps:
1. Click **📋 File History** tab
2. Review table
3. Check columns:
   - File names
   - Upload dates
   - Verification counts
   - Tampering status

### Expected Results:
- ✅ All uploaded files appear
- ✅ File IDs visible (truncated)
- ✅ Upload timestamps correct
- ✅ Verification counts accurate
- ✅ Status shows ✅ or ⚠️

### Verification:
```
Table shows:
  File 1: test_data_original.xlsx, 2 verifications, ✅ Authentic
  File 2: test_data_modified.xlsx, 1 verification, ⚠️ Tampered
  File 3: test_data.csv, 0 verifications, ✅ Authentic
```

---

## Test Scenario 7: Different File Format (CSV)

**Objective**: Verify system works with CSV files

### Steps:
1. Click **📤 Upload File** tab
2. Select `test_data.csv`
3. Wait for hash
4. Store on blockchain
5. Verify tab: re-upload same CSV
6. Check history

### Expected Results:
- ✅ CSV file uploads successfully
- ✅ Hash generated correctly
- ✅ Verification works same as Excel
- ✅ Listed in history

---

## Test Scenario 8: Invalid File Format

**Objective**: Verify system rejects unsupported formats

### Steps:
1. Click **📤 Upload File** tab
2. Try to upload `.txt` or `.doc` file
3. Observe error

### Expected Results:
- ❌ Error message: "Only Excel and CSV files supported"
- ✅ File not uploaded
- ✅ Hash not generated
- ✅ Database unchanged

---

## Test Scenario 9: Role-Based Access

**Objective**: Verify only Inspectors/Admins can see file management

### Test as Approver:
1. Register user as Approver role
2. Connect with that wallet
3. Go to Admin Dashboard

### Expected Results:
- ❌ File Management tab NOT visible
- ✅ Message: "Only Inspectors and Admins can manage files"

### Test as Inspector:
1. Register user as Inspector role
2. Connect with that wallet
3. Go to Admin Dashboard

### Expected Results:
- ✅ File Management tab visible
- ✅ Can upload and verify files

---

## Test Scenario 10: Multiple Verifications

**Objective**: Verify system tracks multiple verification attempts

### Steps:
1. Upload file (generates hash ABC)
2. Store on blockchain
3. Re-upload same file → Authentic ✅
4. Modify file
5. Re-upload modified file → Tampered ❌
6. Check file history

### Expected Results:
- ✅ File shows 2 verifications
- ✅ Last verified time updated
- ✅ Tampered count = 1
- ✅ Status shows tampering detected

---

## Test Scenario 11: Hash Integrity Test

**Objective**: Verify SHA-256 is cryptographically secure

### Steps:
1. Upload file with hash: `abc123...`
2. Modify 1 byte in file (using hex editor or Excel edit)
3. Re-upload modified file
4. Note the new hash: `xyz789...`

### Expected Results:
- ✅ Hashes are completely different
- ✅ No similarity between hashes
- ✅ Confirms one-way hashing function
- ❌ Tampering detected immediately

### Analysis:
```
Original:  abc123def456789abc123def456789abc
Modified:  xyz789abc456def789abc456def789xyz
           ↑ Completely different!
           (SHA-256: 256-bit avalanche effect)
```

---

## Test Scenario 12: Performance Test

**Objective**: Measure system performance

### Metrics to Track:

#### Upload Performance
```
File Size | Upload Time | Hash Time | Total Time
---------|------------|-----------|------------
1 MB     | <500ms     | <50ms     | <550ms
5 MB     | <1s        | <100ms    | <1.1s
10 MB    | <2s        | <150ms    | <2.15s
```

#### Verification Performance
```
Method | Time
-------|-----
Re-upload | File time + <100ms
Blockchain Hash | <10ms
List files | <500ms
Get history | <1s
```

### Expected Results:
- ✅ Upload: <2 seconds for files <10MB
- ✅ Hash calculation: <200ms
- ✅ Verification: Instant
- ✅ Blockchain confirm: ~12 seconds

---

## Test Scenario 13: Error Handling

### Test Invalid File ID:
1. Enter random File ID
2. Try to verify
3. Expected: Error message "File not found"

### Test Empty File:
1. Create empty Excel file
2. Try to upload
3. Expected: Error message "File is empty"

### Test Large File (>16MB):
1. Try to upload file >16MB
2. Expected: Upload fails with error

---

## Test Scenario 14: Browser Console Validation

**Objective**: Verify no console errors

### Steps:
1. Open Browser DevTools (F12)
2. Go to Console tab
3. Perform all tests above
4. Check for errors

### Expected Results:
- ✅ No red error messages
- ✅ Only info and warning logs
- ✅ Network requests successful (200 status)
- ✅ React component renders without warnings

---

## Test Scenario 15: MongoDB Validation

**Objective**: Verify data correctly stored in MongoDB

### Steps:
1. Open MongoDB client
2. Navigate to database
3. Go to `files` collection
4. Find document by fileId

### Expected Results:
```javascript
{
  fileId: "550e8400-e29b-41d4-a716-446655440000",
  fileName: "test_data_original.xlsx",
  fileHash: "abc123def456...",
  uploadedBy: "0x742d35Cc6634C0532925a3b844Bc9e7595f42D2d",
  uploadedAt: "2026-01-25T10:30:00.000Z",
  verifications: [
    {
      isAuthentic: true,
      tampering_detected: false
    },
    {
      isAuthentic: false,
      tampering_detected: true
    }
  ]
}
```

---

## Test Scenario 16: Blockchain Validation

**Objective**: Verify data correctly stored on blockchain

### Steps:
1. After uploading file and storing hash
2. Use Hardhat console to call contract:

```javascript
await contract.getFileRecord(fileId)
```

### Expected Results:
```javascript
FileRecord {
  fileId: "550e8400-e29b-41d4-a716-446655440000",
  fileName: "test_data_original.xlsx",
  fileHash: 0xabc123def456...,
  uploadedBy: 0x742d35...,
  uploadTime: 1674640200,
  fileSize: 15384,
  isVerified: true
}
```

---

## Automated Test Checklist

- [ ] ✅ File upload works
- [ ] ✅ Hash generation works
- [ ] ✅ Blockchain storage works
- [ ] ✅ Same file verified as authentic
- [ ] ✅ Modified file detected as tampered
- [ ] ✅ CSV files supported
- [ ] ✅ Invalid formats rejected
- [ ] ✅ Role-based access works
- [ ] ✅ File history shows correct data
- [ ] ✅ Verification attempts tracked
- [ ] ✅ Error handling works
- [ ] ✅ No console errors
- [ ] ✅ MongoDB data correct
- [ ] ✅ Blockchain data correct
- [ ] ✅ Performance acceptable

---

## Test Results Summary

### Date: ___________
### Tester: ___________
### System Version: ___________

| Test Scenario | Status | Notes |
|---------------|--------|-------|
| 1. Basic Upload | ⭕ | |
| 2. Blockchain Store | ⭕ | |
| 3. Authentic Verify | ⭕ | |
| 4. Tampered Detect | ⭕ | |
| 5. Blockchain Hash | ⭕ | |
| 6. File History | ⭕ | |
| 7. CSV Support | ⭕ | |
| 8. Invalid Format | ⭕ | |
| 9. Role Access | ⭕ | |
| 10. Multiple Verify | ⭕ | |
| 11. Hash Integrity | ⭕ | |
| 12. Performance | ⭕ | |
| 13. Error Handling | ⭕ | |
| 14. Console Validation | ⭕ | |
| 15. MongoDB Data | ⭕ | |
| 16. Blockchain Data | ⭕ | |

**Overall Status**: ⭕
- ⭕ = Pending
- ✅ = Passed
- ❌ = Failed

---

## Known Issues & Workarounds

None currently known. Please report any issues found during testing.

---

## Test Data Files

Create these files for testing:

**test_data_original.xlsx**:
```
Name      Value
Apple     100
Banana    200
Cherry    150
```

**test_data_modified.xlsx**:
```
Name      Value
Apple     100
Banana    250   ← Changed
Cherry    150
```

**test_data.csv**:
```
Name,Value
Apple,100
Banana,200
Cherry,150
```

---

## Rollback Instructions (if needed)

If issues occur:
1. Stop all services
2. Remove uploaded files from MongoDB:
   ```bash
   db.files.deleteMany({})
   ```
3. Redeploy smart contract
4. Clear browser cache
5. Restart services

---

**Testing Started**: ___________
**Testing Completed**: ___________
**Status**: Ready for Production ✅

