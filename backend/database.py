from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_DETAILS = os.getenv("mongo_connection_string", "mongodb" + "+srv://chekurivenkateswarlu7_db_user:venkatch8459" + "@cluster0.b1pmz2k.mongodb.net/?appName=Cluster0")

if not MONGO_DETAILS:
    raise ValueError("mongo_connection_string not found in env")

client = AsyncIOMotorClient(MONGO_DETAILS)
database = client.farm_connect
user_collection = database.get_collection("user_samples")
listing_collection = database.get_collection("listings")
order_collection = database.get_collection("orders")
