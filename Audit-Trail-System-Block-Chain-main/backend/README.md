# Backend API - FastAPI + MongoDB

## Setup

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Configure Environment
Create `.env` file with:
```
MONGODB_URL=mongodb://localhost:27017/
DB_NAME=audit_trail_db
```

### 3. Start MongoDB
Make sure MongoDB is running on your system.

### 4. Run Server
```bash
uvicorn app.main:app --reload --port 8000
```

Server will run at: http://localhost:8000

## API Endpoints

### POST /api/inspections
Create inspection and get hash.

**Request:**
```json
{
  "projectId": "PROJ-001",
  "location": "Building A",
  "qualityParameters": {
    "strength": "Good",
    "finish": "Excellent"
  },
  "remarks": "All checks passed",
  "images": ["image1.jpg"],
  "inspector": "0x123..."
}
```

**Response:**
```json
{
  "reportId": "507f1f77bcf86cd799439011",
  "dataHash": "a3f5...",
  "message": "Inspection stored successfully"
}
```

### GET /api/inspections/{report_id}
Retrieve inspection data.

### POST /api/verify
Recalculate hash for verification.

**Request:**
```json
{
  "reportId": "507f1f77bcf86cd799439011"
}
```

**Response:**
```json
{
  "reportId": "507f1f77bcf86cd799439011",
  "calculatedHash": "a3f5...",
  "message": "Compare with blockchain"
}
```

## Important Notes

- Backend NEVER writes to blockchain
- Backend only stores data and generates hashes
- Frontend is responsible for blockchain transactions
- All hashes are SHA-256
