import React, { useState } from 'react';
import { useBlockchain } from '../context/BlockchainContext';
import '../styles/FileManagement.css';

const FileManagement = () => {
  const { account, contract, role } = useBlockchain();
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [fileHash, setFileHash] = useState('');
  const [fileId, setFileId] = useState('');
  
  // Verification state
  const [verifyFileId, setVerifyFileId] = useState('');
  const [blockchainHash, setBlockchainHash] = useState('');
  const [verificationFile, setVerificationFile] = useState(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  
  // File history state
  const [filesList, setFilesList] = useState([]);
  const [filesLoading, setFilesLoading] = useState(false);

  const API_BASE_URL = 'http://localhost:8000';

  // ==================== FILE UPLOAD ====================
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadLoading(true);
    setUploadMessage('');
    setFileHash('');
    setFileId('');

    try {
      // Validate file type
      const validTypes = ['.xlsx', '.xls', '.csv'];
      const fileName = file.name;
      const isValidFile = validTypes.some(type => fileName.toLowerCase().endsWith(type));

      if (!isValidFile) {
        setUploadMessage('❌ Only Excel (.xlsx, .xls) and CSV files are supported');
        setUploadLoading(false);
        return;
      }

      // Create form data for file upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('uploaderAddress', account || 'unknown');

      // Send to backend
      const response = await fetch(`${API_BASE_URL}/api/files/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'File upload failed');
      }

      const data = await response.json();

      setFileId(data.fileId);
      setFileHash(data.fileHash);
      setUploadMessage(
        `✅ File uploaded successfully!\n\nFile ID: ${data.fileId}\nFile Size: ${(data.fileSize / 1024).toFixed(2)} KB`
      );
      setUploadedFile(file);

    } catch (error) {
      console.error('Upload error:', error);
      setUploadMessage(`❌ Error: ${error.message}`);
    } finally {
      setUploadLoading(false);
    }
  };

  // Store file hash on blockchain
  const storeHashOnBlockchain = async () => {
    if (!fileHash || !fileId) {
      alert('No file to store');
      return;
    }

    if (!contract) {
      alert('Wallet not connected or contract not available');
      return;
    }

    try {
      setUploadMessage('⏳ Storing hash on blockchain...');

      // Convert hash string to bytes32
      const hashBytes32 = '0x' + fileHash;

      // Call smart contract
      const tx = await contract.recordFileHash(
        fileId,
        uploadedFile.name,
        hashBytes32,
        uploadedFile.size,
        0, // rowCount - will be retrieved from backend
        0  // columnCount - will be retrieved from backend
      );

      setUploadMessage('⏳ Transaction pending...');
      const receipt = await tx.wait();

      setUploadMessage(
        `✅ Hash stored on blockchain!\n\nTransaction: ${receipt.hash}\nBlock: ${receipt.blockNumber}`
      );

    } catch (error) {
      console.error('Blockchain error:', error);
      setUploadMessage(`❌ Blockchain error: ${error.message}`);
    }
  };

  // ==================== FILE VERIFICATION ====================
  const handleReUploadForVerification = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setVerifyLoading(true);
    setVerificationResult(null);

    try {
      if (!verifyFileId) {
        alert('Please enter File ID');
        setVerifyLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      // Call backend verification endpoint
      const response = await fetch(
        `${API_BASE_URL}/api/files/${verifyFileId}/re-upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Verification failed');
      }

      const result = await response.json();
      setVerificationResult(result);

    } catch (error) {
      console.error('Verification error:', error);
      setVerificationResult({
        isAuthentic: false,
        message: `❌ Error: ${error.message}`,
      });
    } finally {
      setVerifyLoading(false);
    }
  };

  // Verify using blockchain hash
  const verifyWithBlockchainHash = async () => {
    if (!verifyFileId || !blockchainHash) {
      alert('Please enter File ID and Blockchain Hash');
      return;
    }

    setVerifyLoading(true);
    setVerificationResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/files/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileId: verifyFileId,
          blockchainHash: blockchainHash,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Verification failed');
      }

      const result = await response.json();
      setVerificationResult(result);

    } catch (error) {
      console.error('Verification error:', error);
      setVerificationResult({
        isAuthentic: false,
        message: `❌ Error: ${error.message}`,
      });
    } finally {
      setVerifyLoading(false);
    }
  };

  // ==================== FILE HISTORY ====================
  const loadFilesList = async () => {
    setFilesLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/files`);
      if (!response.ok) throw new Error('Failed to load files');

      const data = await response.json();
      setFilesList(data.files || []);
    } catch (error) {
      console.error('Error loading files:', error);
      alert('Failed to load files: ' + error.message);
    } finally {
      setFilesLoading(false);
    }
  };

  // ==================== RENDER ====================
  if (role !== 'INSPECTOR' && role !== 'ADMIN') {
    return (
      <div className="file-management-container">
        <div className="access-denied">
          <h2>📁 File Management</h2>
          <p>Only Inspectors and Admins can manage files.</p>
          <p>Your role: {role}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="file-management-container">
      <h2>🔐 File Upload & Tampering Detection System</h2>
      
      <div className="file-tabs">
        <button
          className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          📤 Upload File
        </button>
        <button
          className={`tab-button ${activeTab === 'verify' ? 'active' : ''}`}
          onClick={() => setActiveTab('verify')}
        >
          ✅ Verify File
        </button>
        <button
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('history');
            loadFilesList();
          }}
        >
          📋 File History
        </button>
      </div>

      {/* ============== UPLOAD TAB ============== */}
      {activeTab === 'upload' && (
        <div className="tab-content upload-tab">
          <h3>📤 Upload Excel File</h3>
          
          <div className="upload-section">
            <div className="upload-info">
              <p>
                <strong>How it works:</strong>
              </p>
              <ol>
                <li>Upload your Excel file</li>
                <li>System generates SHA-256 hash</li>
                <li>Store hash on blockchain</li>
                <li>File becomes tamper-proof</li>
              </ol>
            </div>

            {/* <div className="file-input-wrapper">
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                disabled={uploadLoading}
                className="file-input"
              />
              <label className="file-label">
                {uploadLoading ? '⏳ Uploading...' : '📁 Select File (Excel/CSV)'}
              </label>
            </div> */}
            <div className="file-input-wrapper">
  <input
    type="file"
    id="upload-file"
    accept=".xlsx,.xls,.csv"
    onChange={handleFileUpload}
    disabled={uploadLoading}
    className="file-input"
  />
  <label htmlFor="upload-file" className="file-label">
    {uploadLoading ? '⏳ Uploading...' : '📁 Select File (Excel/CSV)'}
  </label>
</div>

            {uploadMessage && (
              <div className={`message-box ${uploadMessage.includes('✅') ? 'success' : 'error'}`}>
                <p>{uploadMessage}</p>
              </div>
            )}

            {fileHash && (
              <div className="hash-display">
                <h4>📝 File Hash (SHA-256):</h4>
                <div className="hash-box">
                  <code>{fileHash}</code>
                  <button
                    onClick={() => navigator.clipboard.writeText(fileHash)}
                    className="copy-btn"
                  >
                    📋 Copy
                  </button>
                </div>

                {account && contract && (
                  <button
                    onClick={storeHashOnBlockchain}
                    disabled={uploadLoading}
                    className="blockchain-btn"
                  >
                    ⛓️ Store Hash on Blockchain
                  </button>
                )}

                {!account && (
                  <p className="warning">⚠️ Connect wallet to store hash on blockchain</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============== VERIFY TAB ============== */}
      {activeTab === 'verify' && (
        <div className="tab-content verify-tab">
          <h3>✅ Verify File Integrity</h3>

          <div className="verify-methods">
            {/* Method 1: Re-upload file */}
            <div className="verify-method">
              <h4>Method 1: Re-upload File</h4>
              <p>Re-upload the file to check if it matches the original</p>
              
              <div className="verify-inputs">
                <input
                  type="text"
                  placeholder="Enter File ID"
                  value={verifyFileId}
                  onChange={(e) => setVerifyFileId(e.target.value)}
                  className="input-field"
                />

                {/* <div className="file-input-wrapper">
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleReUploadForVerification}
                    disabled={verifyLoading}
                    className="file-input"
                  />
                  <label className="file-label">
                    {verifyLoading ? '⏳ Verifying...' : '📁 Select File for Verification'}
                  </label>
                </div> */}
                <div className="file-input-wrapper">
  <input
    type="file"
    id="verify-file"
    accept=".xlsx,.xls,.csv"
    onChange={handleReUploadForVerification}
    disabled={verifyLoading}
    className="file-input"
  />
  <label htmlFor="verify-file" className="file-label">
    {verifyLoading ? '⏳ Verifying...' : '📁 Select File for Verification'}
  </label>
</div>
              </div>
            </div>

            {/* Method 2: Verify with blockchain hash */}
            <div className="verify-method">
              <h4>Method 2: Verify with Blockchain Hash</h4>
              <p>Enter the blockchain hash to verify</p>
              
              <div className="verify-inputs">
                <input
                  type="text"
                  placeholder="Enter File ID"
                  value={verifyFileId}
                  onChange={(e) => setVerifyFileId(e.target.value)}
                  className="input-field"
                />

                <input
                  type="text"
                  placeholder="Enter Blockchain Hash (0x...)"
                  value={blockchainHash}
                  onChange={(e) => setBlockchainHash(e.target.value)}
                  className="input-field"
                />

                <button
                  onClick={verifyWithBlockchainHash}
                  disabled={verifyLoading}
                  className="verify-btn"
                >
                  {verifyLoading ? '⏳ Verifying...' : '✅ Verify'}
                </button>
              </div>
            </div>
          </div>

          {/* Verification Result */}
          {verificationResult && (
            <div className={`verification-result ${verificationResult.isAuthentic ? 'authentic' : 'tampered'}`}>
              <h4>{verificationResult.isAuthentic ? '✅ File is Authentic' : '❌ File Has Been Tampered!'}</h4>
              <p>{verificationResult.message}</p>
              
              <div className="result-details">
                <p><strong>File ID:</strong> {verificationResult.fileId}</p>
                <p><strong>File Name:</strong> {verificationResult.fileName}</p>
                
                {verificationResult.originalHash && (
                  <div className="hash-comparison">
                    <div className="hash-item">
                      <strong>Original Hash:</strong>
                      <code>{verificationResult.originalHash}</code>
                    </div>
                    <div className="hash-item">
                      <strong>Current Hash:</strong>
                      <code>{verificationResult.currentHash}</code>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============== HISTORY TAB ============== */}
      {activeTab === 'history' && (
        <div className="tab-content history-tab">
          <h3>📋 File Upload History</h3>

          {filesLoading ? (
            <p>⏳ Loading files...</p>
          ) : filesList.length === 0 ? (
            <p>No files uploaded yet</p>
          ) : (
            <div className="files-table">
              <table>
                <thead>
                  <tr>
                    <th>File Name</th>
                    <th>File ID</th>
                    <th>Uploaded By</th>
                    <th>Uploaded At</th>
                    <th>File Size</th>
                    <th>Hash (First 20 chars)</th>
                    <th>Verifications</th>
                    <th>Last Verified</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filesList.map((file) => (
                    <tr key={file.fileId}>
                      <td>{file.fileName}</td>
                      <td className="id-cell">
                        <code className="file-id-full">{file.fileId}</code>
                        <button 
                          className="copy-id-btn" 
                          onClick={() => {
                            navigator.clipboard.writeText(file.fileId);
                            alert('File ID copied!');
                          }}
                          title="Click to copy"
                        >📋 Copy</button>
                      </td>
                      <td>{file.uploadedBy.substring(0, 10)}...</td>
                      <td>{new Date(file.uploadedAt).toLocaleString()}</td>
                      <td>{(file.fileSize / 1024).toFixed(2)} KB</td>
                      <td className="hash-cell">
                        <code className="hash-full">{file.fileHash}</code>
                        <button 
                          className="copy-hash-btn" 
                          onClick={() => {
                            navigator.clipboard.writeText(file.fileHash);
                            alert('Hash copied!');
                          }}
                          title="Click to copy"
                        >📋 Copy</button>
                      </td>
                      <td>{file.totalVerifications || 0}</td>
                      <td>
                        {file.lastVerified 
                          ? new Date(file.lastVerified).toLocaleString() 
                          : 'Never'}
                      </td>
                      <td>
                        {file.tamperedCount > 0 ? (
                          <span className="status tampered">⚠️ Tampered ({file.tamperedCount})</span>
                        ) : (
                          <span className="status authentic">✅ Authentic</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileManagement;
