# 🚀 Setup Guide for New Users

This guide will help you set up the Audit Trail System on your local machine after cloning from GitHub.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **Python** (3.8 or higher) - [Download](https://www.python.org/)
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community)
- **MetaMask** browser extension - [Install](https://metamask.io/)
- **Git** - [Download](https://git-scm.com/)

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Dhanush248/Audit-Trail-System-Block-Chain.git
cd Audit-Trail-System-Block-Chain
```

### 2. Setup Blockchain

Open **Terminal 1**:

```bash
cd blockchain
npm install
npm run node
```

⚠️ **IMPORTANT:** Keep this terminal running! Note down the account addresses and private keys displayed.

### 3. Deploy Smart Contract

Open **Terminal 2**:

```bash
cd blockchain
npm run deploy
```

✅ This creates `deployments/contract-address.json` and `deployments/AuditTrail.json`

### 4. Setup Backend

Open **Terminal 3**:

```bash
cd backend
```

**Create and activate virtual environment:**

For Windows:
```bash
python -m venv venv
venv\Scripts\activate
```

For macOS/Linux:
```bash
python3 -m venv venv
source venv/bin/activate
```

**Install dependencies:**
```bash
pip install -r requirements.txt
```

**Create a `.env` file** in the `backend` folder:

```env
MONGODB_URL=mongodb://localhost:27017/
DB_NAME=audit_trail_db
```

**Start the backend server:**

```bash
uvicorn app.main:app --reload --port 8000
```

⚠️ **Note:** Keep the virtual environment activated while running the backend.

### 5. Setup Frontend

Open **Terminal 4**:

```bash
cd frontend/audit-trail-system
npm install
npm run dev
```

✅ Frontend will be available at: http://localhost:5173

### 6. Configure MetaMask

1. **Add Hardhat Local Network:**
   - Open MetaMask
   - Click network dropdown → "Add Network" → "Add a network manually"
   - Fill in:
     - **Network Name:** `Hardhat Local`
     - **RPC URL:** `http://127.0.0.1:8545`
     - **Chain ID:** `31337`
     - **Currency Symbol:** `ETH`

2. **Import Test Accounts:**
   - From Terminal 1, copy the private keys
   - In MetaMask: Click account icon → "Import Account" → Paste private key
   - Import at least 4 accounts:
     - Account #0 → Admin
     - Account #1 → Inspector
     - Account #2 → Approver
     - Account #3 → Auditor

### 7. Start Using the System

Follow the **Demo Flow** section in the main README.md to test the system.

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod` or start MongoDB service
- Check if port 27017 is available

### MetaMask Not Connecting
- Make sure you're on the "Hardhat Local" network
- Try refreshing the page
- Check browser console for errors

### Contract Not Found
- Ensure you ran `npm run deploy` in the blockchain folder
- Check if `blockchain/deployments/` folder exists
- Restart the frontend after deployment

### Port Already in Use
- Backend (8000): Change port in uvicorn command
- Frontend (5173): Vite will automatically suggest another port
- Blockchain (8545): Stop other Hardhat instances

## Need Help?

Refer to the main [README.md](./README.md) for detailed documentation and common issues.

## Next Steps

Once everything is running, you can:
1. Register users with different roles
2. Create inspections
3. Submit for approval
4. Verify data integrity
5. Test tampering detection

Happy coding! 🎉
