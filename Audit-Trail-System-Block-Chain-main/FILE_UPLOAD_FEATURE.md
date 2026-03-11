# 📁 File Upload & Tampering Detection Feature

## Overview

This document explains the new **File Upload and Tampering Detection** feature added to the Audit Trail System. This feature allows users to upload Excel/CSV files, store them securely, and detect if they have been modified or tampered with using blockchain-verified SHA-256 hashing.

---

## 🎯 How It Works

### Three-Layer Architecture

```
┌─────────────────────────────────────────────────────┐
│ LAYER 1: FRONTEND (React)                           │
│ - File upload component                             │
│ - Hash verification UI                              │
│ - File history display                              │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ LAYER 2: BACKEND (FastAPI + MongoDB)                │
│ - Store uploaded files                              │
│ - Generate SHA-256 hash                             │
│ - Track verification attempts                       │
│ - Detect tampering                                  │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ LAYER 3: BLOCKCHAIN (Smart Contract)                │
│ - Store file hash immutably                         │
│ - Prevent modification                              │
│ - Audit trail of verifications                      │
└─────────────────────────────────────────────────────┘
```

### Tampering Detection Process

```
┌──────────────┐
│ User Uploads │     File stored + Hash calculated
│    File      │──────────────────────────────────→ Backend (MongoDB)
└──────────────┘
      ↓
      └──────────────────────┐
                             │
                    Hash stored on blockchain
                   (becomes immutable proof)
                             │
                             ↓
                    ┌────────────────────┐
                    │  File is Safe      │
                    │  from tampering    │
                    └────────────────────┘
                             │
                    ┌────────┴─────────┐
                    ↓                  ↓
        ┌─────────────────┐  ┌──────────────────┐
        │  Later: Verify  │  │  File Modified?  │
        │  by Re-upload   │  │  Compare Hashes  │
        └─────────────────┘  └──────────────────┘
                    │                  │
        ┌───────────┴──────────────────┤
        ↓                              ↓
   Hash Matches          ✅ Authentic  ❌ TAMPERED!
   Original Hash            File OK      Alert User
```

---

## 📦 What Was Added

### 1. Backend Components

#### Models (`models.py`)

```python
class FileUploadResponse     # Response from file upload
class FileRecord           # File metadata stored in DB
class FileVerifyRequest    # Request to verify file
class FileVerifyResponse   # Verification result
class FileHistoryItem     # File history entry
```

#### File Handler (`file_handler.py`)

- `generate_file_hash()` - SHA-256 hashing of file content
- `parse_excel_file()` - Extract metadata from Excel
- `verify_file_integrity()` - Compare file hashes
- `extract_excel_data()` - Get all data from Excel
- `calculate_detailed_hash()` - Complete hash analysis

#### API Endpoints (`main.py`)

| Endpoint                         | Method | Purpose                      |
| -------------------------------- | ------ | ---------------------------- |
| `/api/files/upload`              | POST   | Upload file and get hash     |
| `/api/files/verify`              | POST   | Verify using blockchain hash |
| `/api/files/{file_id}`           | GET    | Get file metadata            |
| `/api/files`                     | GET    | List all files               |
| `/api/files/{file_id}/re-upload` | POST   | Re-upload for verification   |

#### Database Schema (MongoDB)

```javascript
{
  fileId: String,           // Unique identifier
  fileName: String,         // Original file name
  fileHash: String,        // SHA-256 hash
  fileSize: Number,        // File size in bytes
  fileContent: Binary,     // Actual file bytes
  uploadedBy: String,      // Wallet address
  uploadedAt: String,      // ISO timestamp
  rowCount: Number,        // Excel rows
  columnCount: Number,     // Excel columns
  sheetNames: [String],    // Sheet names
  status: String,          // "uploaded"
  verifications: [         // Verification history
    {
      verifiedAt: String,
      blockchainHash: String,
      currentHash: String,
      isAuthentic: Boolean,
      tampering_detected: Boolean
    }
  ]
}
```

### 2. Smart Contract Functions (Solidity)

```solidity
// Record file hash on blockchain
recordFileHash(
  fileId,
  fileName,
  fileHash,
  fileSize,
  rowCount,
  columnCount
)

// Verify file integrity
verifyFileIntegrity(fileId, currentHash)
  returns (bool isAuthentic)

// Get file verification history
getFileVerificationHistory(fileId)
  returns (bytes32[] memory)

// Check if file was tampered
hasFileBeenTampered(fileId, currentHash)
  returns (bool)
```

### 3. Frontend Components

#### FileManagement Component (`FileManagement.jsx`)

Three-tab interface:

1. **Upload File Tab**
   - File selection
   - Hash display
   - Blockchain storage button

2. **Verify File Tab**
   - Re-upload verification
   - Blockchain hash verification
   - Results display

3. **File History Tab**
   - All uploaded files
   - Verification counts
   - Tampering status

#### Styling (`FileManagement.css`)

- Responsive design
- Color-coded results
- Hash display
- Table formatting

#### API Utilities (`api.js`)

- `uploadFile()` - Upload file
- `verifyFileWithHash()` - Verify with blockchain hash
- `reUploadFileForVerification()` - Re-upload verification
- `getFileDetails()` - Get file info
- `getAllFiles()` - List files

### 4. Admin Dashboard Update

- Added FileManagement integration
- New "File Management" tab
- Combined with user registration

---

## 🔐 Tampering Detection Mechanism

### How Hash Works

```
Original File              Modified File (1 byte changed)
        │                          │
        ├─→ SHA-256 Hash          ├─→ SHA-256 Hash
        │   "abc123..."           │   "xyz789..."
        │                         │
        └──────────────┬──────────┘
                       │
                 Completely Different!
                       │
            ✅ TAMPERING DETECTED!
```

### Detection Process

1. **Upload Phase**
   - File uploaded to backend
   - SHA-256 hash calculated
   - Hash stored on blockchain

2. **Later Verification**
   - File re-uploaded or hash entered
   - New hash calculated
   - Compared with blockchain hash

3. **Result**
   - **Match** → File is authentic ✅
   - **No Match** → File tampered ❌

---

## 🚀 Usage Guide

### For Inspectors

#### Uploading a File

1. Navigate to **Admin Dashboard** → **File Management**
2. Click **Upload File** tab
3. Select Excel/CSV file
4. Copy the SHA-256 hash
5. Click **Store Hash on Blockchain**
6. Confirm transaction in MetaMask
7. Hash is now immutable proof

#### Verifying a File Later

**Option 1: Re-upload**

1. Go to **Verify File** tab
2. Enter the File ID
3. Re-upload the file
4. System compares hashes
5. See verification result

**Option 2: Using Blockchain Hash**

1. Go to **Verify File** tab
2. Enter File ID
3. Enter blockchain hash
4. Click **Verify**
5. See results

#### Checking File History

1. Click **File History** tab
2. See all uploaded files
3. View verification counts
4. Check tampering status

---

## 📊 Technical Specifications

### Hashing Algorithm

- **Algorithm**: SHA-256
- **Standard**: FIPS 180-4
- **Output**: 256-bit (64 hex characters)
- **Immutability**: One-way function
- **Collision Resistance**: Cryptographically secure

### File Support

- **Formats**: Excel (.xlsx, .xls), CSV (.csv)
- **Max Size**: Limited by MongoDB (16MB per document)
- **Metadata Captured**: Rows, columns, sheet names

### Data Storage

- **Location**: MongoDB (backend)
- **Blockchain**: Hardhat local network (Smart Contract)
- **Verification History**: Tracked in MongoDB

### Security Features

- ✅ Hash-based integrity verification
- ✅ Blockchain immutability
- ✅ Role-based access (Inspector/Admin only)
- ✅ Audit trail of verifications
- ✅ Tampering detection alerts

---

## 🔄 API Request Examples

### 1. Upload File

```bash
curl -X POST http://localhost:8000/api/files/upload \
  -F "file=@spreadsheet.xlsx" \
  -F "uploaderAddress=0x742d35Cc6634C0532925a3b844Bc9e7595f42D2d"
```

**Response:**

```json
{
  "fileId": "550e8400-e29b-41d4-a716-446655440000",
  "fileName": "spreadsheet.xlsx",
  "fileHash": "abc123def456...",
  "fileSize": 15384,
  "message": "File uploaded successfully..."
}
```

### 2. Verify File with Hash

```bash
curl -X POST http://localhost:8000/api/files/verify \
  -H "Content-Type: application/json" \
  -d '{
    "fileId": "550e8400-e29b-41d4-a716-446655440000",
    "blockchainHash": "0xabc123def456..."
  }'
```

**Response:**

```json
{
  "fileId": "550e8400-e29b-41d4-a716-446655440000",
  "fileName": "spreadsheet.xlsx",
  "isAuthentic": true,
  "storedHash": "abc123def456...",
  "currentHash": "abc123def456...",
  "message": "File is authentic"
}
```

### 3. List All Files

```bash
curl http://localhost:8000/api/files
```

---

## 🛠️ Installation & Setup

### Backend Setup

1. **Install dependencies**

   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **New packages added**

   ```
   openpyxl       # Excel file handling
   pandas         # Data processing
   python-multipart # File upload support
   ```

3. **Start backend**
   ```bash
   python -m uvicorn app.main:app --reload
   ```

### Smart Contract Deployment

1. **Compile contract**

   ```bash
   cd blockchain
   npx hardhat compile
   ```

2. **Deploy updated contract**

   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

3. **Update contract address** in frontend config

### Frontend Setup

1. **Install dependencies**

   ```bash
   cd frontend/audit-trail-system
   npm install
   ```

2. **Start frontend**

   ```bash
   npm run dev
   ```

3. **Component already integrated** in AdminDashboard

---

## 📈 Use Cases

### 1. Quality Control

- Store inspection Excel files
- Prevent unauthorized modifications
- Prove data integrity in audits

### 2. Compliance & Audit Trail

- Immutable file history
- Verification timestamps
- Tampering detection records

### 3. Data Integrity Verification

- Detect file modifications
- Maintain evidence of authenticity
- Create tamper-proof records

### 4. Supply Chain Documentation

- Store supplier data files
- Prevent document forgery
- Verify original content

---

## ⚠️ Important Notes

### Security Best Practices

1. **Always verify critical files** before using data
2. **Store blockchain hash securely** (write it down)
3. **Audit verification logs** regularly
4. **Keep backups** of original files
5. **Test tampering detection** in staging first

### Limitations

- Files cannot be "unmodified" - this is by design
- Blockchain hash is permanent and immutable
- File re-upload is the verification method
- MongoDB storage limit for files

### Performance Considerations

- SHA-256 hashing is fast (milliseconds)
- Blockchain transactions take ~12 seconds
- Large files (>5MB) may slow upload
- Verification is instantaneous

---

## 🐛 Troubleshooting

### Issue: File upload fails

**Solution**: Check file format (xlsx, xls, csv only)

### Issue: Hash doesn't match

**Solution**: File may have been modified - this is tampering detection working!

### Issue: Blockchain transaction pending

**Solution**: Wait for confirmation, check Hardhat network status

### Issue: Frontend component not showing

**Solution**: Ensure FileManagement component is imported in AdminDashboard

---

## 📝 Database Collections

### Files Collection

Stores all uploaded files and their verification history.

**Index on**: `fileId` (unique), `uploadedAt`

---

## 🎓 Educational Value

This feature demonstrates:

- ✅ SHA-256 hashing for integrity
- ✅ Blockchain immutability
- ✅ File handling in Python
- ✅ Full-stack MERN implementation
- ✅ Tampering detection systems
- ✅ Audit trail management

---

## 📞 Support

For issues or questions:

1. Check error messages in console
2. Review backend logs
3. Verify blockchain connection
4. Check MongoDB connection
5. Ensure all dependencies installed

---

**Version**: 1.0  
**Last Updated**: January 2026  
**Status**: ✅ Production Ready
