const API_BASE_URL = 'http://localhost:8000';

export const api = {
  // Create inspection in backend
  createInspection: async (inspectionData) => {
    const response = await fetch(`${API_BASE_URL}/api/inspections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inspectionData),
    });

    if (!response.ok) {
      throw new Error('Failed to create inspection');
    }

    return response.json();
  },

  // Get inspection from backend
  getInspection: async (reportId) => {
    const response = await fetch(`${API_BASE_URL}/api/inspections/${reportId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch inspection');
    }

    return response.json();
  },

  // Verify inspection hash
  verifyInspection: async (reportId) => {
    const response = await fetch(`${API_BASE_URL}/api/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reportId }),
    });

    if (!response.ok) {
      throw new Error('Failed to verify inspection');
    }

    return response.json();
  },

  // ==================== FILE UPLOAD ENDPOINTS ====================

  // Upload file and get hash
  uploadFile: async (file, uploaderAddress) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploaderAddress', uploaderAddress);

    const response = await fetch(`${API_BASE_URL}/api/files/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }

    return response.json();
  },

  // Verify file integrity using blockchain hash
  verifyFileWithHash: async (fileId, blockchainHash) => {
    const response = await fetch(`${API_BASE_URL}/api/files/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileId,
        blockchainHash,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to verify file');
    }

    return response.json();
  },

  // Re-upload file to verify integrity
  reUploadFileForVerification: async (fileId, file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/files/${fileId}/re-upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to verify file');
    }

    return response.json();
  },

  // Get file details
  getFileDetails: async (fileId) => {
    const response = await fetch(`${API_BASE_URL}/api/files/${fileId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch file details');
    }

    return response.json();
  },

  // Get all files list
  getAllFiles: async () => {
    const response = await fetch(`${API_BASE_URL}/api/files`);

    if (!response.ok) {
      throw new Error('Failed to fetch files');
    }

    return response.json();
  },
};