from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from models import UserRegister, UserLogin, UserResponse, ListingCreate, ListingResponse, OrderCreate, OrderResponse
from database import user_collection, listing_collection, order_collection
from bson import ObjectId
from typing import List

app = FastAPI(title="FarmConnect API")

# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def user_helper(user) -> dict:
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "phone": user["phone"],
        "email": user.get("email"),
        "role": user["role"],
        "location": user.get("location")
    }

def listing_helper(listing) -> dict:
    return {
        "id": str(listing["_id"]),
        "crop": listing["crop"],
        "emoji": listing["emoji"],
        "name": listing["name"],
        "qty": listing["qty"],
        "price": listing["price"],
        "location": listing["location"],
        "contact": listing["contact"],
        "desc": listing.get("desc"),
        "seller": listing["seller"]
    }

def order_helper(order) -> dict:
    return {
        "id": str(order["_id"]),
        "listingId": order["listingId"],
        "listingEmoji": order.get("listingEmoji", "📦"),
        "listingName": order.get("listingName", "Unknown Product"),
        "listingPrice": order.get("listingPrice", 0),
        "buyer": order["buyer"],
        "seller": order["seller"],
        "qty": order["qty"],
        "totalPrice": order["totalPrice"],
        "status": order["status"],
        "timeline": order.get("timeline", []),
        "createdAt": str(order.get("createdAt")) if order.get("createdAt") else None
    }

@app.post("/api/auth/register", response_model=UserResponse)
async def register(user: UserRegister):
    if await user_collection.find_one({"phone": user.phone}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this phone number already exists"
        )
    user_data = user.model_dump()
    new_user = await user_collection.insert_one(user_data)
    created_user = await user_collection.find_one({"_id": new_user.inserted_id})
    return user_helper(created_user)

import secrets

@app.post("/api/auth/login")
async def login(user: UserLogin):
    db_user = await user_collection.find_one({"phone": user.phone})
    if not db_user or not secrets.compare_digest(user.password, db_user.get("password", "")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect phone number or password"
        )
    return {
        "message": "Login successful",
        "user": user_helper(db_user)
    }

@app.get("/api/listings", response_model=List[ListingResponse])
async def get_listings():
    listings = []
    async for listing in listing_collection.find():
        listings.append(listing_helper(listing))
    # Reverse to show newest first
    return listings[::-1]

@app.post("/api/listings", response_model=ListingResponse)
async def create_listing(listing: ListingCreate):
    listing_data = listing.model_dump()
    new_listing = await listing_collection.insert_one(listing_data)
    created_listing = await listing_collection.find_one({"_id": new_listing.inserted_id})
    return listing_helper(created_listing)

@app.get("/api/orders", response_model=List[OrderResponse])
async def get_orders():
    orders = []
    async for order in order_collection.find():
        orders.append(order_helper(order))
    return orders[::-1]

from datetime import datetime

@app.post("/api/orders", response_model=OrderResponse)
async def create_order(order: OrderCreate):
    order_data = order.model_dump()
    if order_data.get("createdAt") is None:
        order_data["createdAt"] = datetime.now()
    new_order = await order_collection.insert_one(order_data)
    created_order = await order_collection.find_one({"_id": new_order.inserted_id})
    return order_helper(created_order)

@app.put("/api/orders/{order_id}")
async def update_order(order_id: str, order_update: dict):
    # Only allow updating status and timeline for simplicity
    update_data = {}
    if "status" in order_update:
        update_data["status"] = order_update["status"]
    if "timeline" in order_update:
        update_data["timeline"] = order_update["timeline"]
        
    if update_data:
        updated = await order_collection.find_one_and_update(
            {"_id": ObjectId(order_id)},
            {"$set": update_data},
            return_document=True
        )
        if updated:
            return order_helper(updated)
    
    raise HTTPException(status_code=404, detail="Order not found")

@app.get("/api/debug/clear-orders")
async def clear_orders():
    await order_collection.delete_many({})
    return {"message": "All orders cleared"}

@app.get("/")
def root():
    return {"message": "Welcome to FarmConnect API"}
