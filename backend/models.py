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
    price: float
    location: str
    contact: str
    desc: Optional[str] = None
    seller: str

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
    qty: int
    totalPrice: float
    status: str = "placed"
    timeline: List[Dict[str, Any]] = []
    createdAt: Optional[datetime] = None

class OrderResponse(OrderCreate):
    id: str
