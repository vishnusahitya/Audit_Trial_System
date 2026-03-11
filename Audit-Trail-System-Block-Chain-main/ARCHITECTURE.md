# 🏗️ System Architecture Diagram

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                       │
│                            USER (Browser)                             │
│                                                                       │
│                    ┌──────────────────────────┐                      │
│                    │      MetaMask Wallet     │                      │
│                    │  - Private Key Storage   │                      │
│                    │  - Transaction Signing   │                      │
│                    └──────────────────────────┘                      │
│                                 │                                     │
└─────────────────────────────────┼─────────────────────────────────────┘
                                  │
                                  │ Signs Transactions
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND LAYER                                │
│                    (React + ethers.js v6)                             │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  BlockchainContext.jsx                                       │   │
│  │  - BrowserProvider (ethers v6)                               │   │
│  │  - Contract instance                                         │   │
│  │  - Wallet connection                                         │   │
│  │  - Role management                                           │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │    Admin     │  │  Inspector   │  │   Approver   │             │
│  │  Dashboard   │  │  Dashboard   │  │  Dashboard   │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│                                                                       │
│  ┌──────────────┐                                                   │
│  │   Auditor    │                                                   │
│  │  Dashboard   │                                                   │
│  └──────────────┘                                                   │
│                                                                       │
│  Port: 5173 (Vite)                                                   │
└─────────────────────────────────────────────────────────────────────┘
                    │                              │
                    │                              │
        HTTP API    │                              │ JSON-RPC
        Calls       │                              │ (ethers.js)
                    │                              │
                    ▼                              ▼
┌─────────────────────────────┐    ┌──────────────────────────────────┐
│      BACKEND LAYER          │    │      BLOCKCHAIN LAYER            │
│   (FastAPI + MongoDB)       │    │   (Solidity Smart Contract)      │
│                             │    │                                  │
│  ┌────────────────────┐    │    │  ┌────────────────────────────┐ │
│  │   REST API         │    │    │  │   AuditTrail.sol           │ │
│  │                    │    │    │  │                            │ │
│  │  POST /inspections │    │    │  │  - Role Management         │ │
│  │  GET  /inspections │    │    │  │  - Inspection Storage      │ │
│  │  POST /verify      │    │    │  │  - Access Control          │ │
│  └────────────────────┘    │    │  │  - Immutability Rules      │ │
│                             │    │  └────────────────────────────┘ │
│  ┌────────────────────┐    │    │                                  │
│  │   Hash Generator   │    │    │  Contract Address:               │
│  │   (SHA-256)        │    │    │  0x5FbDB2315678...               │
│  └────────────────────┘    │    │                                  │
│                             │    │  Network: Hardhat Local          │
│  ┌────────────────────┐    │    │  Chain ID: 31337                 │
│  │   MongoDB          │    │    │  RPC: http://127.0.0.1:8545      │
│  │   - Inspections    │    │    │                                  │
│  │   - Full Data      │    │    │  Port: 8545                      │
│  └────────────────────┘    │    └──────────────────────────────────┘
│                             │
│  Port: 8000                 │
└─────────────────────────────┘
```

---

## Data Flow: Creating an Inspection

```
┌──────────┐
│  User    │
│ (Browser)│
└────┬─────┘
     │
     │ 1. Fills inspection form
     │
     ▼
┌─────────────────────────────────────────┐
│  Frontend (Inspector Dashboard)         │
│                                          │
│  Form Data:                              │
│  - projectId: "PROJ-001"                 │
│  - location: "Building A"                │
│  - qualityParameters: {...}              │
│  - remarks: "All checks passed"          │
└────┬─────────────────────────────────────┘
     │
     │ 2. POST /api/inspections
     │    (HTTP Request)
     │
     ▼
┌─────────────────────────────────────────┐
│  Backend (FastAPI)                       │
│                                          │
│  Step 1: Save to MongoDB                 │
│  ┌────────────────────────────────────┐ │
│  │ db.inspections.insert_one({...})   │ │
│  │ Returns: reportId (ObjectId)       │ │
│  └────────────────────────────────────┘ │
│                                          │
│  Step 2: Generate Hash                   │
│  ┌────────────────────────────────────┐ │
│  │ SHA-256(inspection_data)           │ │
│  │ Returns: dataHash                  │ │
│  └────────────────────────────────────┘ │
│                                          │
│  Response: { reportId, dataHash }        │
└────┬─────────────────────────────────────┘
     │
     │ 3. Returns { reportId, dataHash }
     │
     ▼
┌─────────────────────────────────────────┐
│  Frontend                                │
│                                          │
│  Step 3: Convert hash to bytes32         │
│  dataHash = "0x" + hexHash               │
│                                          │
│  Step 4: Call smart contract             │
│  contract.createInspection(              │
│    reportId,                             │
│    dataHash                              │
│  )                                       │
└────┬─────────────────────────────────────┘
     │
     │ 4. Transaction request
     │    (via ethers.js)
     │
     ▼
┌─────────────────────────────────────────┐
│  MetaMask                                │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  Confirm Transaction?              │ │
│  │                                    │ │
│  │  Contract: AuditTrail              │ │
│  │  Function: createInspection        │ │
│  │  Gas: ~150,000                     │ │
│  │                                    │ │
│  │  [Reject]  [Confirm]               │ │
│  └────────────────────────────────────┘ │
└────┬─────────────────────────────────────┘
     │
     │ 5. User clicks Confirm
     │    Signs with private key
     │
     ▼
┌─────────────────────────────────────────┐
│  Blockchain (Smart Contract)             │
│                                          │
│  function createInspection(              │
│    string reportId,                      │
│    bytes32 dataHash                      │
│  ) onlyInspector {                       │
│                                          │
│    // Verify caller is inspector         │
│    require(                              │
│      roles[msg.sender] == INSPECTOR      │
│    );                                    │
│                                          │
│    // Store inspection                   │
│    inspections[reportId] = Inspection({  │
│      reportId: reportId,                 │
│      dataHash: dataHash,                 │
│      inspector: msg.sender,              │
│      timestamp: block.timestamp,         │
│      status: CREATED                     │
│    });                                   │
│                                          │
│    // Emit event                         │
│    emit InspectionCreated(...);          │
│  }                                       │
│                                          │
│  Transaction Hash: 0x1234...             │
└────┬─────────────────────────────────────┘
     │
     │ 6. Transaction mined
     │    Block confirmed
     │
     ▼
┌─────────────────────────────────────────┐
│  Frontend                                │
│                                          │
│  await tx.wait();                        │
│  ✅ Success!                             │
│                                          │
│  Display:                                │
│  "Inspection created successfully!"      │
│  "Report ID: 507f1f77bcf86cd799439011"   │
└──────────────────────────────────────────┘
```

---

## Data Flow: Verifying Integrity (Auditor)

```
┌──────────┐
│ Auditor  │
└────┬─────┘
     │
     │ 1. Enters Report ID
     │
     ▼
┌─────────────────────────────────────────┐
│  Frontend (Auditor Dashboard)            │
│                                          │
│  reportId = "507f1f77bcf86cd799439011"   │
└────┬─────────────────────────────────────┘
     │
     │ 2. Parallel requests
     │
     ├─────────────────────┬────────────────────────┐
     │                     │                        │
     ▼                     ▼                        ▼
┌──────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   Backend    │  │   Blockchain     │  │   Backend        │
│              │  │                  │  │                  │
│ GET          │  │ contract         │  │ POST /verify     │
│ /inspections │  │ .getInspection() │  │                  │
│ /{reportId}  │  │                  │  │ Recalculate hash │
│              │  │ Returns:         │  │                  │
│ Returns:     │  │ - dataHash       │  │ Returns:         │
│ - Full data  │  │ - status         │  │ - calculatedHash │
└──────┬───────┘  └────────┬─────────┘  └────────┬─────────┘
       │                   │                      │
       │                   │                      │
       └───────────────────┴──────────────────────┘
                           │
                           │ 3. Compare hashes
                           │
                           ▼
       ┌─────────────────────────────────────────┐
       │  Frontend                                │
       │                                          │
       │  blockchainHash = "0xabc123..."          │
       │  calculatedHash = "0xabc123..."          │
       │                                          │
       │  if (blockchainHash === calculatedHash)  │
       │    ✅ AUTHENTIC                          │
       │  else                                    │
       │    ❌ TAMPERED                           │
       └──────────────────────────────────────────┘
```

---

## Role-Based Access Control

```
┌─────────────────────────────────────────────────────────────┐
│                    Smart Contract State                      │
│                                                              │
│  mapping(address => Role) public roles;                      │
│                                                              │
│  roles[0x1234...] = ADMIN                                    │
│  roles[0x5678...] = INSPECTOR                                │
│  roles[0x9abc...] = APPROVER                                 │
│  roles[0xdef0...] = AUDITOR                                  │
└─────────────────────────────────────────────────────────────┘
                           │
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│    ADMIN     │  │  INSPECTOR   │  │   APPROVER   │
│              │  │              │  │              │
│ Can:         │  │ Can:         │  │ Can:         │
│ - Register   │  │ - Create     │  │ - Approve    │
│   users      │  │   inspection │  │   inspection │
│ - Assign     │  │ - Submit     │  │ - Reject     │
│   roles      │  │   inspection │  │   inspection │
│              │  │              │  │              │
│ Cannot:      │  │ Cannot:      │  │ Cannot:      │
│ - Create     │  │ - Approve    │  │ - Create     │
│   inspection │  │   inspection │  │   inspection │
│ - Approve    │  │ - Register   │  │ - Register   │
│   inspection │  │   users      │  │   users      │
└──────────────┘  └──────────────┘  └──────────────┘
```

---

## Inspection State Machine

```
┌─────────────────────────────────────────────────────────────┐
│                    Inspection Lifecycle                      │
└─────────────────────────────────────────────────────────────┘

    ┌─────────────┐
    │   CREATED   │  ← Inspector creates inspection
    └──────┬──────┘
           │
           │ Inspector calls submitInspection()
           │
           ▼
    ┌─────────────┐
    │  SUBMITTED  │  ← Waiting for approval
    └──────┬──────┘
           │
           ├─────────────────────┬─────────────────────┐
           │                     │                     │
           │ Approver calls      │ Approver calls      │
           │ approveInspection() │ rejectInspection()  │
           │                     │                     │
           ▼                     ▼                     │
    ┌─────────────┐      ┌─────────────┐             │
    │  APPROVED   │      │  REJECTED   │             │
    │     🔒      │      └─────────────┘             │
    └─────────────┘                                   │
           │                                          │
           │ IMMUTABLE                                │
           │ No further changes allowed               │
           │                                          │
           └──────────────────────────────────────────┘
```

---

## Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│                      Layer 1: Frontend                       │
│                                                              │
│  - Input validation                                          │
│  - Role-based UI rendering                                   │
│  - MetaMask transaction signing                              │
│                                                              │
│  Security: User must explicitly approve each transaction     │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      Layer 2: Backend                        │
│                                                              │
│  - API authentication (can be added)                         │
│  - Input sanitization                                        │
│  - Hash generation                                           │
│                                                              │
│  Security: Never signs blockchain transactions               │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Layer 3: Blockchain                       │
│                                                              │
│  - Role-based access control (modifiers)                     │
│  - State validation (require statements)                     │
│  - Immutability enforcement                                  │
│  - Cryptographic signatures                                  │
│                                                              │
│  Security: Enforced by consensus, cannot be bypassed         │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│                                                              │
│  React 18          │  Modern UI framework                    │
│  Vite              │  Fast build tool                        │
│  ethers.js v6      │  Ethereum library                       │
│  MetaMask          │  Wallet integration                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                         Backend                              │
│                                                              │
│  Python 3.8+       │  Programming language                   │
│  FastAPI           │  Web framework                          │
│  MongoDB           │  Database                               │
│  Pydantic          │  Data validation                        │
│  hashlib           │  SHA-256 hashing                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                        Blockchain                            │
│                                                              │
│  Solidity 0.8.20   │  Smart contract language                │
│  Hardhat 2.x       │  Development environment                │
│  ethers.js         │  Contract interaction                   │
│  Local Network     │  Development blockchain                 │
└─────────────────────────────────────────────────────────────┘
```

---

This architecture ensures:
- ✅ Separation of concerns
- ✅ Security at every layer
- ✅ Scalability
- ✅ Maintainability
- ✅ Testability
