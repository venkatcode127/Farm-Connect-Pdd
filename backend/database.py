from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_DETAILS = os.getenv("mongo_connection_string")

if not MONGO_DETAILS:
    raise ValueError("mongo_connection_string not found in .env file")

client = AsyncIOMotorClient(MONGO_DETAILS)
database = client.farm_connect
user_collection = database.get_collection("user_samples")
listing_collection = database.get_collection("listings")
order_collection = database.get_collection("orders")
