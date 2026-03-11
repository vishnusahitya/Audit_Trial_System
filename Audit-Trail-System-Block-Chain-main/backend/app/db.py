import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

def get_database():
    """Get MongoDB database connection"""
    try:
        client = MongoClient(os.getenv('MONGODB_URL'))
        db = client[os.getenv('DB_NAME', 'audit_trail_db')]
        return db
    except Exception as e:
        print(f"Database connection error: {e}")
        return None

def test_connection():
    try:
        client = MongoClient(os.getenv('MONGODB_URL'))
        db = client[os.getenv('DB_NAME')]
        client.admin.command('ping')
        return client, db
    except Exception as e:
        return None, None

if __name__ == "__main__":
    test_connection()