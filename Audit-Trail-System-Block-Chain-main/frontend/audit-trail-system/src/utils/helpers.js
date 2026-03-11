/**
 * Convert SHA-256 hex hash to bytes32 format for Solidity
 * @param {string} hexHash - SHA-256 hash in hex format (64 characters)
 * @returns {string} - bytes32 format with 0x prefix
 */
export const hashToBytes32 = (hexHash) => {
  // Remove any existing 0x prefix
  const cleanHash = hexHash.replace('0x', '');
  
  // Add 0x prefix
  return '0x' + cleanHash;
};

/**
 * Get status name from enum value
 */
export const getStatusName = (status) => {
  const statuses = ['CREATED', 'SUBMITTED', 'APPROVED', 'REJECTED'];
  return statuses[status] || 'UNKNOWN';
};

/**
 * Format address for display
 */
export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

/**
 * Format timestamp
 */
export const formatTimestamp = (timestamp) => {
  return new Date(Number(timestamp) * 1000).toLocaleString();
};
