import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

def test_connection():
    print("Testing MongoDB connection...")
    print(f"Database URL: {os.getenv('MONGODB_URL')[:50]}...")
    print(f"Database Name: {os.getenv('DB_NAME')}")
    
    try:
        # Simple connection without SSL verification
        client = MongoClient(os.getenv('MONGODB_URL'))
        
        # Test basic connection
        server_info = client.server_info()
        print(f"MongoDB Server Version: {server_info.get('version', 'Unknown')}")
        
        # Access database
        db = client[os.getenv('DB_NAME')]
        print(f"Database '{os.getenv('DB_NAME')}' accessed successfully!")
        
        # List collections (will be empty initially)
        collections = db.list_collection_names()
        print(f"Collections in database: {collections if collections else 'None (empty database)'}")
        
        client.close()
        return True
        
    except Exception as e:
        print(f"Connection failed: {str(e)[:100]}...")
        return False

if __name__ == "__main__":
    success = test_connection()
    if success:
        print("\n=== CONNECTION TEST PASSED ===")
    else:
        print("\n=== CONNECTION TEST FAILED ===")
        print("This might be due to:")
        print("1. Network connectivity issues")
        print("2. Firewall blocking the connection")
        print("3. MongoDB Atlas IP whitelist restrictions")
        print("4. SSL/TLS configuration issues")