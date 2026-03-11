from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class InspectionCreate(BaseModel):
    projectId: str
    location: str
    qualityParameters: dict
    remarks: str
    images: Optional[List[str]] = []
    inspector: str  # Wallet address

class InspectionResponse(BaseModel):
    reportId: str
    dataHash: str
    message: str

class InspectionData(BaseModel):
    reportId: str
    projectId: str
    location: str
    qualityParameters: dict
    remarks: str
    images: Optional[List[str]] = []
    inspector: str
    createdAt: str

class VerifyRequest(BaseModel):
    reportId: str
# File Upload Models
class FileUploadResponse(BaseModel):
    fileId: str
    fileName: str
    fileHash: str
    fileSize: int
    message: str

class FileRecord(BaseModel):
    fileId: str
    fileName: str
    fileHash: str
    fileSize: int
    uploadedBy: str  # Wallet address
    uploadedAt: str
    rowCount: int
    columnCount: int
    sheetNames: list

class FileVerifyRequest(BaseModel):
    fileId: str
    blockchainHash: str

class FileVerifyResponse(BaseModel):
    fileId: str
    fileName: str
    isAuthentic: bool
    storedHash: str
    currentHash: str
    message: str

class FileHistoryItem(BaseModel):
    fileId: str
    fileName: str
    fileHash: str
    uploadedBy: str
    uploadedAt: str
    status: str  # 'original', 'modified', 'verified'