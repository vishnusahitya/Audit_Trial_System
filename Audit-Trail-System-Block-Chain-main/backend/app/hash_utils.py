import hashlib
import json

def generate_hash(data: dict) -> str:
    """
    Generate SHA-256 hash of inspection data.
    
    This hash will be stored on blockchain to ensure data integrity.
    Any modification to the data will result in a different hash.
    """
    # Convert dict to sorted JSON string for consistent hashing
    json_string = json.dumps(data, sort_keys=True)
    
    # Generate SHA-256 hash
    hash_object = hashlib.sha256(json_string.encode())
    hash_hex = hash_object.hexdigest()
    
    return hash_hex

def verify_hash(data: dict, expected_hash: str) -> bool:
    """
    Verify if data matches the expected hash.
    Returns True if data is authentic, False if tampered.
    """
    calculated_hash = generate_hash(data)
    return calculated_hash == expected_hash
