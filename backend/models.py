from pydantic import BaseModel, EmailStr
from typing import Optional

class UserRegister(BaseModel):
    name: str
    phone: str
    email: Optional[EmailStr] = None
    password: str
    role: str = "farmer"  # 'farmer', 'buyer', or 'admin'
    location: Optional[str] = None

class UserLogin(BaseModel):
    phone: str
    password: str

from typing import Optional, List, Dict, Any

class UserResponse(BaseModel):
    id: str
    name: str
    phone: str
    email: Optional[EmailStr] = None
    role: str
    location: Optional[str] = None

class ListingCreate(BaseModel):
    crop: str
    emoji: str
    name: str
    qty: int
    unit: Optional[str] = "Quintal"
    price: float
    location: str
    contact: str
    desc: Optional[str] = None
    seller: str
    imageUrl: Optional[str] = None
    videoUrl: Optional[str] = None
    sold: Optional[bool] = False
    # New optional fields for cluster and place identification
    cluster_name: Optional[str] = None
    place_name: Optional[str] = None

def listing_helper(listing) -> dict:
    return {
        "id": str(listing["_id"]),
        "crop": listing["crop"],
        "emoji": listing.get("emoji", "🌾"),
        "name": listing["name"],
        "qty": listing["qty"],
        "price": listing["price"],
        "location": listing["location"],
        "contact": listing["contact"],
        "desc": listing.get("desc"),
        "seller": listing["seller"],
        "imageUrl": listing.get("imageUrl"),
        "videoUrl": listing.get("videoUrl"),
        # Include new optional fields if present
        "cluster_name": listing.get("cluster_name"),
        "place_name": listing.get("place_name")
    }

class ListingResponse(ListingCreate):
    id: str

from datetime import datetime

class OrderCreate(BaseModel):
    listingId: str
    listingEmoji: str
    listingName: str
    listingPrice: float
    buyer: str
    seller: str
    sellerContact: Optional[str] = ""
    buyerContact: Optional[str] = ""
    qty: int
    totalPrice: float
    status: str = "placed"
    deliveryAddress: Optional[str] = "Standard Delivery Point"
    paymentMethod: Optional[str] = "Direct Mandi Transfer / COD"
    timeline: List[Dict[str, Any]] = []
    createdAt: Optional[datetime] = None

class OrderResponse(OrderCreate):
    id: str

class ReviewCreate(BaseModel):
    targetUser: str            # Username of farmer or buyer being rated
    targetType: str = "farmer" # 'farmer' or 'buyer'
    reviewer: str              # Username of reviewer
    reviewerRole: str = "buyer"# 'buyer' or 'farmer'
    rating: int                # 1 to 5
    title: Optional[str] = ""
    comment: Optional[str] = ""
    tags: List[str] = []       # e.g. ["Fresh Produce", "Timely Delivery"]
    orderId: Optional[str] = None
    listingId: Optional[str] = None
    createdAt: Optional[datetime] = None

class ReviewResponse(ReviewCreate):
    id: str

class RatingSummary(BaseModel):
    targetUser: str
    targetType: str
    averageRating: float
    totalReviews: int
    breakdown: Dict[str, int]

class PricePoint(BaseModel):
    date: str
    price: int
    volume: Optional[int] = None
    confidence: Optional[int] = None

class PredictionData(BaseModel):
    crop: str
    cropName: str
    market: str
    marketName: str
    historical15Days: List[PricePoint]
    forecast15Days: List[PricePoint]
    currentPrice: int
    predicted15DayPrice: int
    expectedChangePercent: float
    confidenceScore: int
    recommendation: str
    reason: str
    low30Day: int
    high30Day: int
    avg30Day: int
    lastUpdated: Optional[str] = None

