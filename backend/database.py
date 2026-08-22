from motor.motor_asyncio import AsyncIOMotorClient
import os
import asyncio
from bson import ObjectId
from dotenv import load_dotenv

load_dotenv()

MONGO_DETAILS = os.getenv(
    "mongo_connection_string", 
    "mongodb+srv://chekurivenkateswarlu7_db_user:venkatch8459@cluster0.b1pmz2k.mongodb.net/?appName=Cluster0"
)

# Robust fallback collection for offline/network blocked development
class ResilientCollection:
    def __init__(self, name, mongo_collection=None, seed_data=None):
        self.name = name
        self.mongo_col = mongo_collection
        self._items = seed_data or []

    async def _try_mongo(self, fn):
        if self.mongo_col is not None:
            try:
                return await fn()
            except Exception as e:
                from fastapi import HTTPException
                raise HTTPException(status_code=503, detail=f"Database connection failed: {str(e)}")
        return None

    async def find_one(self, query):
        async def mongo_fn():
            return await self.mongo_col.find_one(query)
        return await self._try_mongo(mongo_fn)

    def find(self, query=None):
        query = query or {}
        if self.mongo_col is not None:
            return self.mongo_col.find(query)
        # Fallback to an empty async cursor if mongo_col is entirely missing
        class EmptyCursor:
            def __aiter__(self): return self
            async def __anext__(self): raise StopAsyncIteration
        return EmptyCursor()

    async def insert_one(self, doc):
        doc_copy = dict(doc)
        if "_id" not in doc_copy:
            doc_copy["_id"] = ObjectId()
        
        async def mongo_fn():
            return await self.mongo_col.insert_one(doc_copy)
        m_res = await self._try_mongo(mongo_fn)
        if m_res is not None:
            doc_copy["_id"] = m_res.inserted_id

        class InsertResult:
            def __init__(self, iid):
                self.inserted_id = iid
        return InsertResult(doc_copy["_id"])

    async def update_one(self, filter_q, update_q):
        async def mongo_fn():
            return await self.mongo_col.update_one(filter_q, update_q)
        m_res = await self._try_mongo(mongo_fn)
        return m_res is not None

    async def find_one_and_update(self, filter_q, update_q, return_document=True):
        from pymongo import ReturnDocument
        rd = ReturnDocument.AFTER if return_document else ReturnDocument.BEFORE
        
        async def mongo_fn():
            return await self.mongo_col.find_one_and_update(filter_q, update_q, return_document=rd)
        return await self._try_mongo(mongo_fn)

    async def delete_many(self, query):
        async def mongo_fn():
            return await self.mongo_col.delete_many(query)
        await self._try_mongo(mongo_fn)
        return True

# Initialize client with quick connection timeout
raw_client = AsyncIOMotorClient(MONGO_DETAILS, serverSelectionTimeoutMS=2000)
raw_db = raw_client.farm_connect

# Default Seed Listings with rich images & videos
# Clean database collection initialization without unwanted mock data
user_collection = ResilientCollection("user_samples", raw_db.get_collection("user_samples"))
listing_collection = ResilientCollection("listings", raw_db.get_collection("listings"))
order_collection = ResilientCollection("orders", raw_db.get_collection("orders"))
review_collection = ResilientCollection("reviews", raw_db.get_collection("reviews"))
prediction_collection = ResilientCollection("ai_predictions", raw_db.get_collection("ai_predictions"))


