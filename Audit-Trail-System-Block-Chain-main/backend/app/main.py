from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from app.db import get_database, test_connection
from app.models import (
    InspectionCreate, InspectionResponse, InspectionData, VerifyRequest,
    FileUploadResponse, FileRecord, FileVerifyRequest, FileVerifyResponse
)
from app.hash_utils import generate_hash, verify_hash
from app.file_handler import generate_file_hash, parse_file, verify_file_integrity, calculate_detailed_hash
from datetime import datetime
from bson import ObjectId
import uuid

app = FastAPI(title="Audit Trail API")

# CORS configuration for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite and CRA default ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "Audit Trail Backend Running"}

@app.get("/test-db")
def test_db_route():
    client, db = test_connection()
    if client is not None and db is not None:
        client.close()
        return {
            "status": "success",
            "message": "Database connection successful",
            "database": db.name
        }
    else:
        return {
            "status": "error", 
            "message": "Database connection failed"
        }

@app.post("/api/inspections", response_model=InspectionResponse)
def create_inspection(inspection: InspectionCreate):
    """
    Store inspection report and return hash.
    Frontend will then store this hash on blockchain.
    """
    db = get_database()
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    # Prepare inspection data
    inspection_data = {
        "projectId": inspection.projectId,
        "location": inspection.location,
        "qualityParameters": inspection.qualityParameters,
        "remarks": inspection.remarks,
        "images": inspection.images,
        "inspector": inspection.inspector,
        "createdAt": datetime.utcnow().isoformat()
    }
    
    # Generate SHA-256 hash
    data_hash = generate_hash(inspection_data)
    
    # Store in MongoDB
    result = db.inspections.insert_one(inspection_data)
    report_id = str(result.inserted_id)
    
    return InspectionResponse(
        reportId=report_id,
        dataHash=data_hash,
        message="Inspection stored successfully. Use this hash for blockchain."
    )

@app.get("/api/inspections/{report_id}", response_model=InspectionData)
def get_inspection(report_id: str):
    """
    Retrieve inspection report by ID.
    """
    db = get_database()
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    try:
        inspection = db.inspections.find_one({"_id": ObjectId(report_id)})
        if not inspection:
            raise HTTPException(status_code=404, detail="Inspection not found")
        
        return InspectionData(
            reportId=str(inspection["_id"]),
            projectId=inspection["projectId"],
            location=inspection["location"],
            qualityParameters=inspection["qualityParameters"],
            remarks=inspection["remarks"],
            images=inspection.get("images", []),
            inspector=inspection["inspector"],
            createdAt=inspection["createdAt"]
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid report ID: {str(e)}")

@app.post("/api/verify")
def verify_inspection(request: VerifyRequest):
    """
    Recalculate hash of stored inspection data.
    Frontend will compare this with blockchain hash.
    """
    db = get_database()
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    try:
        inspection = db.inspections.find_one({"_id": ObjectId(request.reportId)})
        if not inspection:
            raise HTTPException(status_code=404, detail="Inspection not found")
        
        # Recreate the data structure used for hashing
        inspection_data = {
            "projectId": inspection["projectId"],
            "location": inspection["location"],
            "qualityParameters": inspection["qualityParameters"],
            "remarks": inspection["remarks"],
            "images": inspection.get("images", []),
            "inspector": inspection["inspector"],
            "createdAt": inspection["createdAt"]
        }
        
        # Recalculate hash
        calculated_hash = generate_hash(inspection_data)
        
        return {
            "reportId": request.reportId,
            "calculatedHash": calculated_hash,
            "message": "Compare this hash with blockchain hash to verify integrity"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Verification failed: {str(e)}")


# ==================== FILE UPLOAD & TAMPERING DETECTION ENDPOINTS ====================

@app.post("/api/files/upload", response_model=FileUploadResponse)
async def upload_file(file: UploadFile = File(...), uploaderAddress: str = None):
    """
    Upload Excel or CSV file, store in backend, and generate SHA-256 hash.
    
    The hash will be stored on blockchain to create immutable proof of the original file.
    Any modification to the file will result in a different hash, allowing tampering detection.
    
    Args:
        file: Excel (.xlsx/.xls) or CSV file
        uploaderAddress: Wallet address of uploader
        
    Returns:
        FileUploadResponse with fileId and hash
    """
    db = get_database()
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    try:
        # Validate file type
        filename_lower = file.filename.lower()
        if not any(filename_lower.endswith(ext) for ext in ['.xlsx', '.xls', '.csv']):
            raise HTTPException(status_code=400, detail="Only Excel (.xlsx, .xls) and CSV files are supported")
        
        # Read file content
        file_content = await file.read()
        
        if not file_content:
            raise HTTPException(status_code=400, detail="File is empty")
        
        # Generate file hash (SHA-256)
        file_hash = generate_file_hash(file_content)
        
        # Parse file for metadata (handles both Excel and CSV)
        try:
            metadata, _ = parse_file(file_content, file.filename)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
        
        # Create unique file ID
        file_id = str(uuid.uuid4())
        
        # Store file record in MongoDB
        file_record = {
            "fileId": file_id,
            "fileName": file.filename,
            "fileHash": file_hash,
            "fileSize": len(file_content),
            "fileContent": file_content,  # Store actual file bytes
            "uploadedBy": uploaderAddress or "unknown",
            "uploadedAt": datetime.utcnow().isoformat(),
            "rowCount": metadata["row_count"],
            "columnCount": metadata["column_count"],
            "sheetNames": metadata["sheet_names"],
            "status": "uploaded",
            "verifications": []  # Track all verification attempts
        }
        
        result = db.files.insert_one(file_record)
        
        return FileUploadResponse(
            fileId=file_id,
            fileName=file.filename,
            fileHash=file_hash,
            fileSize=len(file_content),
            message="File uploaded successfully. Store this hash on blockchain for tampering detection."
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")


@app.post("/api/files/verify", response_model=FileVerifyResponse)
async def verify_file(request: FileVerifyRequest):
    """
    Verify file integrity by comparing current hash with blockchain hash.
    
    This endpoint detects if a file has been tampered with by:
    1. Retrieving the stored file from database
    2. Regenerating its SHA-256 hash
    3. Comparing with the hash stored on blockchain
    
    Args:
        request: FileVerifyRequest with fileId and blockchainHash
        
    Returns:
        FileVerifyResponse indicating if file is authentic
    """
    db = get_database()
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    try:
        # Find file record
        file_record = db.files.find_one({"fileId": request.fileId})
        
        if not file_record:
            raise HTTPException(status_code=404, detail="File not found")
        
        # Regenerate hash of stored file
        stored_file_content = file_record["fileContent"]
        current_hash = generate_file_hash(stored_file_content)
        
        # Normalize blockchain hash (remove 0x prefix if present)
        blockchain_hash = request.blockchainHash
        if blockchain_hash.startswith('0x'):
            blockchain_hash = blockchain_hash[2:]
        
        # Compare hashes
        is_authentic = current_hash == blockchain_hash
        
        # Record verification attempt
        verification_record = {
            "verifiedAt": datetime.utcnow().isoformat(),
            "blockchainHash": blockchain_hash,
            "storedHash": current_hash,
            "isAuthentic": is_authentic,
            "tampering_detected": not is_authentic
        }
        
        # Update file record with verification attempt
        db.files.update_one(
            {"fileId": request.fileId},
            {"$push": {"verifications": verification_record}}
        )
        
        return FileVerifyResponse(
            fileId=request.fileId,
            fileName=file_record["fileName"],
            isAuthentic=is_authentic,
            storedHash=current_hash,
            currentHash=blockchain_hash,
            message="✅ File is authentic and has not been tampered" if is_authentic else "❌ FILE HAS BEEN TAMPERED WITH! Hashes do not match."
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Verification failed: {str(e)}")


@app.get("/api/files/{file_id}")
def get_file_details(file_id: str):
    """
    Retrieve file metadata and verification history.
    
    Shows:
    - Original file information
    - SHA-256 hash
    - All verification attempts
    - Tampering detection results
    """
    db = get_database()
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    try:
        file_record = db.files.find_one({"fileId": file_id})
        
        if not file_record:
            raise HTTPException(status_code=404, detail="File not found")
        
        # Don't return the actual file content, just metadata
        return {
            "fileId": file_record["fileId"],
            "fileName": file_record["fileName"],
            "fileHash": file_record["fileHash"],
            "fileSize": file_record["fileSize"],
            "uploadedBy": file_record["uploadedBy"],
            "uploadedAt": file_record["uploadedAt"],
            "rowCount": file_record["rowCount"],
            "columnCount": file_record["columnCount"],
            "sheetNames": file_record["sheetNames"],
            "status": file_record["status"],
            "verifications": file_record.get("verifications", []),
            "totalVerifications": len(file_record.get("verifications", []))
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to retrieve file: {str(e)}")


@app.get("/api/files")
def list_all_files():
    """
    List all uploaded files with their status and verification results.
    """
    db = get_database()
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    try:
        files = list(db.files.find({}, {
            "fileId": 1,
            "fileName": 1,
            "fileHash": 1,
            "fileSize": 1,
            "uploadedBy": 1,
            "uploadedAt": 1,
            "status": 1,
            "verifications": 1,
            "_id": 0
        }).sort("uploadedAt", -1))
        
        # Add verification summary
        for file in files:
            verifications = file.get("verifications", [])
            file["totalVerifications"] = len(verifications)
            file["lastVerified"] = verifications[-1]["verifiedAt"] if verifications else None
            file["tamperedCount"] = sum(1 for v in verifications if not v.get("isAuthentic", False))
        
        return {
            "status": "success",
            "totalFiles": len(files),
            "files": files
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list files: {str(e)}")


@app.post("/api/files/{file_id}/re-upload")
async def re_upload_file_for_verification(file_id: str, file: UploadFile = File(...)):
    """
    Re-upload a file to verify if it matches the original (stored on blockchain).
    
    This is the main tampering detection mechanism:
    1. User re-uploads a file
    2. System generates hash of the re-uploaded file
    3. Compares with the original file hash stored in database
    4. If hashes match - File is authentic
    5. If hashes differ - File has been tampered with
    
    Args:
        file_id: ID of the file to verify against
        file: Re-uploaded file for verification
        
    Returns:
        Verification result
    """
    db = get_database()
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    try:
        # Find original file record
        original_file = db.files.find_one({"fileId": file_id})
        
        if not original_file:
            raise HTTPException(status_code=404, detail="Original file not found")
        
        # Read re-uploaded file content
        re_uploaded_content = await file.read()
        
        if not re_uploaded_content:
            raise HTTPException(status_code=400, detail="Re-uploaded file is empty")
        
        # Generate hash of re-uploaded file
        new_file_hash = generate_file_hash(re_uploaded_content)
        original_file_hash = original_file["fileHash"]
        
        # Compare hashes
        is_matching = new_file_hash == original_file_hash
        
        # Record this verification attempt
        verification_record = {
            "verifiedAt": datetime.utcnow().isoformat(),
            "originalHash": original_file_hash,
            "reUploadedHash": new_file_hash,
            "isMatching": is_matching,
            "isAuthentic": is_matching,
            "tampering_detected": not is_matching,
            "reUploadedFileName": file.filename
        }
        
        # Update verification attempts
        db.files.update_one(
            {"fileId": file_id},
            {"$push": {"verifications": verification_record}}
        )
        
        return {
            "fileId": file_id,
            "fileName": original_file["fileName"],
            "isAuthentic": is_matching,
            "originalHash": original_file_hash,
            "currentHash": new_file_hash,
            "reUploadedFileName": file.filename,
            "message": "✅ File is authentic and matches original" if is_matching else "❌ FILE HAS BEEN TAMPERED! Hashes do not match.",
            "verificationCount": len(original_file.get("verifications", [])) + 1
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Verification failed: {str(e)}")
