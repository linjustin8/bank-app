# Holds the shared MongoDB client instance and database connection.
import os
from pathlib import Path

from dotenv import load_dotenv
from pymongo import MongoClient

# Load the backend environment file so the URI stays out of source code.
load_dotenv(Path(__file__).resolve().parents[1] / ".env")

# Read the MongoDB settings, using bankApp when no database name is provided.
MONGO_URI = os.getenv("MONGODB_URI")
MONGO_DATABASE = os.getenv("MONGO_DATABASE", "bankApp")

# Stop immediately with a clear error when the connection URI is missing.
if not MONGO_URI:
	raise RuntimeError("MONGODB_URI is not configured.")

# Reuse one client and database handle throughout the application.
client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
database = client[MONGO_DATABASE]

