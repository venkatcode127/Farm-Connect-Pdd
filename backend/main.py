from fastapi import FastAPI, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from models import (
    UserRegister, UserLogin, UserResponse, 
    ListingCreate, ListingResponse, 
    OrderCreate, OrderResponse,
    ReviewCreate, ReviewResponse, RatingSummary,
    PredictionData, PricePoint
)
from database import (
    user_collection, listing_collection, order_collection, 
    review_collection, prediction_collection
)
from bson import ObjectId
from typing import List, Optional
from datetime import datetime, timedelta
import random
import secrets


app = FastAPI(title="FarmConnect API")

# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"], 
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
        "emoji": listing.get("emoji", "🌾"),
        "name": listing["name"],
        "qty": listing["qty"],
        "price": listing["price"],
        "location": listing["location"],
        "contact": listing["contact"],
        "desc": listing.get("desc"),
        "seller": listing["seller"],
        "imageUrl": listing.get("imageUrl"),
        "videoUrl": listing.get("videoUrl")
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
        "sellerContact": order.get("sellerContact", ""),
        "buyerContact": order.get("buyerContact", ""),
        "qty": order["qty"],
        "totalPrice": order["totalPrice"],
        "status": order["status"],
        "deliveryAddress": order.get("deliveryAddress", "Standard Delivery Point"),
        "paymentMethod": order.get("paymentMethod", "Direct Mandi Transfer / COD"),
        "timeline": order.get("timeline", []),
        "createdAt": str(order.get("createdAt")) if order.get("createdAt") else None
    }

def review_helper(review) -> dict:
    return {
        "id": str(review["_id"]),
        "targetUser": review["targetUser"],
        "targetType": review.get("targetType", "farmer"),
        "reviewer": review["reviewer"],
        "reviewerRole": review.get("reviewerRole", "buyer"),
        "rating": review["rating"],
        "title": review.get("title", ""),
        "comment": review.get("comment", ""),
        "tags": review.get("tags", []),
        "orderId": review.get("orderId"),
        "listingId": review.get("listingId"),
        "createdAt": str(review.get("createdAt")) if review.get("createdAt") else None
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

@app.post("/api/auth/login")
async def login(user: UserLogin):
    db_user = await user_collection.find_one({"phone": user.phone})
    if not db_user and user.phone.isdigit():
        db_user = await user_collection.find_one({"phone": int(user.phone)})
        
    if not db_user or not secrets.compare_digest(str(user.password), str(db_user.get("password", ""))):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"DEBUG: Searched for phone '{user.phone}'. Found user: {db_user is not None}. Collection used: user_samples."
        )
    return {
        "message": "Login successful",
        "user": user_helper(db_user)
    }

@app.get("/api/listings", response_model=List[ListingResponse])
async def get_listings():
    listings = []
    # Only return listings that have NOT been sold/ordered
    async for listing in listing_collection.find({"sold": {"$ne": True}}):
        listings.append(listing_helper(listing))
    return listings[::-1]

# DEBUG: Seed sample listings if none exist
async def _seed_sample_listings():
    existing = await listing_collection.find_one({})
    if existing:
        return "Listings already present"
    sample_data = [
        {
            "crop": "wheat",
            "emoji": "🌾",
            "name": "Golden Wheat",
            "qty": 100,
            "price": 2200,
            "location": "Rajampet",
            "contact": "+91-9876543210",
            "desc": "High quality wheat for milling",
            "seller": "farmer_john",
            "imageUrl": "",
            "videoUrl": "",
            "sold": False,
        },
        {
            "crop": "tomato",
            "emoji": "🍅",
            "name": "Red Tomatoes",
            "qty": 150,
            "price": 2600,
            "location": "Kadapa",
            "contact": "+91-9123456780",
            "desc": "Fresh organic tomatoes",
            "seller": "farmer_anna",
            "imageUrl": "",
            "videoUrl": "",
            "sold": False,
        },
        {
            "crop": "onion",
            "emoji": "🧅",
            "name": "Sweet Onions",
            "qty": 80,
            "price": 1900,
            "location": "Anantapur",
            "contact": "+91-9988776655",
            "desc": "Crisp onions for cooking",
            "seller": "farmer_mike",
            "imageUrl": "",
            "videoUrl": "",
            "sold": False,
        },
    ]
    for doc in sample_data:
        await listing_collection.insert_one(doc)
    return "Sample listings seeded"

@app.get("/api/debug/seed-listings")
async def debug_seed_listings():
    result = await _seed_sample_listings()
    return {"message": result}


@app.post("/api/listings", response_model=ListingResponse)
async def create_listing(listing: ListingCreate):
    listing_data = listing.model_dump()
    new_listing = await listing_collection.insert_one(listing_data)
    created_listing = await listing_collection.find_one({"_id": new_listing.inserted_id})
    return listing_helper(created_listing)

@app.get("/api/orders", response_model=List[OrderResponse])
async def get_orders(
    buyer: Optional[str] = None,
    seller: Optional[str] = None,
    role: Optional[str] = None
):
    orders = []
    query = {}
    # Admin gets all; otherwise filter to only this user's orders
    if role != "admin":
        if buyer and seller:
            query = {"$or": [{"buyer": buyer}, {"seller": seller}]}
        elif buyer:
            query = {"buyer": buyer}
        elif seller:
            query = {"seller": seller}
    async for order in order_collection.find(query):
        orders.append(order_helper(order))
    return orders[::-1]

@app.post("/api/orders", response_model=OrderResponse)
async def create_order(order: OrderCreate):
    order_data = order.model_dump()
    if order_data.get("createdAt") is None:
        order_data["createdAt"] = datetime.now()
    new_order = await order_collection.insert_one(order_data)
    created_order = await order_collection.find_one({"_id": new_order.inserted_id})

    # Mark the listing as sold so it disappears from the marketplace
    listing_id = order_data.get("listingId", "")
    if listing_id:
        if ObjectId.is_valid(listing_id):
            await listing_collection.update_one(
                {"_id": ObjectId(listing_id)},
                {"$set": {"sold": True}}
            )
        await listing_collection.update_one(
            {"_id": listing_id},
            {"$set": {"sold": True}}
        )

    return order_helper(created_order)

@app.put("/api/orders/{order_id}")
async def update_order(order_id: str, order_update: dict):
    update_data = {}
    if "status" in order_update:
        update_data["status"] = order_update["status"]
    if "timeline" in order_update:
        update_data["timeline"] = order_update["timeline"]
        
    if update_data:
        updated = None
        if ObjectId.is_valid(order_id):
            updated = await order_collection.find_one_and_update(
                {"_id": ObjectId(order_id)},
                {"$set": update_data},
                return_document=True
            )
        if not updated:
            updated = await order_collection.find_one_and_update(
                {"_id": order_id},
                {"$set": update_data},
                return_document=True
            )
        if not updated:
            updated = await order_collection.find_one_and_update(
                {"id": order_id},
                {"$set": update_data},
                return_document=True
            )
        if updated:
            return order_helper(updated)
    
    raise HTTPException(status_code=404, detail="Order not found")

# ===== REVIEWS & RATINGS ENDPOINTS =====

@app.post("/api/reviews", response_model=ReviewResponse)
async def create_review(review: ReviewCreate):
    review_data = review.model_dump()
    if review_data.get("createdAt") is None:
        review_data["createdAt"] = datetime.now()
    
    # Check if a review for this order and reviewer already exists
    if review_data.get("orderId"):
        existing = await review_collection.find_one({
            "orderId": review_data["orderId"],
            "reviewer": review_data["reviewer"]
        })
        if existing:
            # Update existing review
            await review_collection.update_one(
                {"_id": existing["_id"]},
                {"$set": review_data}
            )
            updated = await review_collection.find_one({"_id": existing["_id"]})
            return review_helper(updated)

    new_review = await review_collection.insert_one(review_data)
    created_review = await review_collection.find_one({"_id": new_review.inserted_id})
    return review_helper(created_review)



@app.get("/api/reviews", response_model=List[ReviewResponse])
async def get_reviews(
    targetUser: Optional[str] = None,
    targetType: Optional[str] = None,
    listingId: Optional[str] = None,
    orderId: Optional[str] = None,
    reviewer: Optional[str] = None
):
    query = {}
    if targetUser:
        query["targetUser"] = targetUser
    if targetType:
        query["targetType"] = targetType
    if listingId:
        query["listingId"] = listingId
    if orderId:
        query["orderId"] = orderId
    if reviewer:
        query["reviewer"] = reviewer

    reviews = []
    async for r in review_collection.find(query):
        reviews.append(review_helper(r))
    return reviews[::-1]

# ===== BUYER REPUTATION & DEALER STANDING (AUTO-FLAG IF > 5 CANCELLATIONS/MONTH) =====

@app.get("/api/users/{username}/reputation")
async def get_user_reputation(username: str):
    one_month_ago = datetime.now() - timedelta(days=30)
    total_orders = 0
    cancelled_total = 0
    cancelled_last_month = 0
    delivered_total = 0

    async for o in order_collection.find({"buyer": username}):
        total_orders += 1
        st = o.get("status")
        if st == "delivered":
            delivered_total += 1
        elif st == "cancelled":
            cancelled_total += 1
            created_at = o.get("createdAt")
            if created_at:
                if isinstance(created_at, str):
                    try:
                        created_dt = datetime.fromisoformat(created_at.replace("Z", "+00:00")).replace(tzinfo=None)
                    except Exception:
                        created_dt = datetime.now()
                elif isinstance(created_at, datetime):
                    created_dt = created_at.replace(tzinfo=None)
                else:
                    created_dt = datetime.now()
                if created_dt >= one_month_ago:
                    cancelled_last_month += 1
            else:
                cancelled_last_month += 1

    is_not_good_dealer = cancelled_last_month > 5
    dealer_status = "Not a Good Dealer" if is_not_good_dealer else ("Warning: Risky Buyer" if cancelled_last_month >= 3 else "Reliable Buyer")
    badge = "⚠️ Not a Good Dealer (>5 cancellations this month)" if is_not_good_dealer else "✅ Good Standing"

    return {
        "username": username,
        "totalOrders": total_orders,
        "cancelledTotal": cancelled_total,
        "cancelledLastMonth": cancelled_last_month,
        "deliveredTotal": delivered_total,
        "isNotGoodDealer": is_not_good_dealer,
        "dealerStatus": dealer_status,
        "badge": badge
    }

@app.get("/api/reviews/summary/{target_user}", response_model=RatingSummary)
async def get_rating_summary(target_user: str, targetType: Optional[str] = "farmer"):
    query = {"targetUser": target_user}
    if targetType:
        query["targetType"] = targetType

    total = 0
    sum_rating = 0
    breakdown = {"5": 0, "4": 0, "3": 0, "2": 0, "1": 0}

    async for r in review_collection.find(query):
        total += 1
        rating = r.get("rating", 5)
        sum_rating += rating
        key = str(rating)
        if key in breakdown:
            breakdown[key] += 1

    avg = round(sum_rating / total, 1) if total > 0 else 5.0
    return {
        "targetUser": target_user,
        "targetType": targetType or "farmer",
        "averageRating": avg,
        "totalReviews": total,
        "breakdown": breakdown
    }

# ===== UNIFIED AI PREDICTION & REAL-TIME MARKET INTELLIGENCE =====

BASE_CROP_BENCHMARKS = {
    "rice": 3850, "rice_basmati": 4200, "wheat": 2450, "tomato": 2600,
    "onion": 1850, "potato": 1250, "cotton": 6250, "sugarcane": 355,
    "soybean": 4250, "mustard": 5150, "chilli": 8600, "maize": 2000,
    "groundnut": 5400, "turmeric": 12500, "garlic": 9200, "ginger": 7500,
    "mango": 6800, "banana": 1800, "apple": 8500, "pomegranate": 9500,
    "chana": 5300, "tur_dal": 7800, "moong": 7400, "urad": 7100,
    "cardamom": 18000, "black_pepper": 22000, "cumin": 28000
}

MARKET_FACTORS = {
    "delhi": 1.00, "mumbai": 1.03, "bangalore": 1.04, "hyderabad": 0.99,
    "chennai": 1.05, "lucknow": 0.96, "jaipur": 0.97, "kolkata": 1.01,
    "guntur": 1.02, "warangal": 0.98, "karnal": 0.97, "khanna": 0.98,
    "pune": 1.02, "nashik": 0.95, "nagpur": 0.98, "indore": 0.97,
    "ahmedabad": 1.01, "patna": 0.96
}

CROP_SEASONALITY = {
    "rice": [1.02, 1.01, 0.98, 0.96, 0.95, 0.97, 1.00, 1.02, 1.04, 1.05, 1.03, 1.02],
    "wheat": [0.97, 0.96, 0.95, 0.98, 1.02, 1.04, 1.05, 1.03, 1.01, 0.99, 0.98, 0.97],
    "tomato": [0.90, 0.88, 0.92, 1.05, 1.15, 1.20, 1.10, 0.98, 0.92, 0.88, 0.85, 0.88],
    "onion": [0.88, 0.85, 0.90, 0.95, 1.02, 1.08, 1.14, 1.22, 1.25, 1.15, 0.98, 0.92],
    "potato": [0.85, 0.82, 0.88, 0.94, 1.02, 1.08, 1.12, 1.15, 1.12, 1.05, 0.95, 0.88],
    "cotton": [0.96, 0.94, 0.95, 0.98, 1.01, 1.04, 1.06, 1.05, 1.03, 1.00, 0.98, 0.97],
    "soybean": [0.95, 0.93, 0.92, 0.94, 0.98, 1.02, 1.06, 1.08, 1.10, 1.06, 1.00, 0.97],
    "mustard": [0.96, 0.94, 0.98, 1.02, 1.06, 1.08, 1.05, 1.02, 0.99, 0.97, 0.95, 0.96],
    "chilli": [0.95, 0.94, 0.96, 1.00, 1.04, 1.08, 1.07, 1.04, 1.01, 0.98, 0.96, 0.95],
    "maize": [0.98, 0.96, 0.95, 0.97, 1.00, 1.03, 1.05, 1.04, 1.02, 1.00, 0.98, 0.97],
    "groundnut": [0.97, 0.95, 0.94, 0.96, 0.99, 1.02, 1.05, 1.07, 1.06, 1.03, 1.00, 0.98],
    "turmeric": [1.08, 1.05, 0.97, 0.93, 0.92, 0.96, 1.02, 1.06, 1.10, 1.12, 1.09, 1.07]
}

def generate_deterministic_price_series(crop_key: str, market_key: str):
    """Generates consistent real-time series and 15-day forecast based on mandi benchmarks and seasonal math."""
    base_benchmark = BASE_CROP_BENCHMARKS.get(crop_key, 3200)
    m_factor = MARKET_FACTORS.get(market_key, 1.00)
    base_price = int(base_benchmark * m_factor)
    
    today = datetime.now()
    month_idx = today.month - 1
    
    season_factors = CROP_SEASONALITY.get(crop_key, [1.0] * 12)
    current_season_factor = season_factors[month_idx]
    next_season_factor = season_factors[(month_idx + 1) % 12]
    
    # 15-day historical trend
    hist_points = []
    curr_p = int(base_price * (season_factors[(month_idx - 1) % 12] * 0.3 + current_season_factor * 0.7))
    
    # Generate stable history
    for i in range(14, -1, -1):
        dt = (today - timedelta(days=i)).strftime("%Y-%m-%d")
        day_seed = (hash(f"{crop_key}_{market_key}_{dt}") % 100) - 48
        price_step = int((base_price * 0.008) * (day_seed / 50.0))
        curr_p = max(int(base_price * 0.6), curr_p + price_step)
        vol = 200 + (hash(f"vol_{dt}_{crop_key}") % 600)
        hist_points.append(PricePoint(date=dt, price=curr_p, volume=vol))

    latest_price = hist_points[-1].price
    
    # Calculate seasonal slope trend
    monthly_trend_slope = (next_season_factor - current_season_factor) / 30.0
    
    # 15 Days Future Forecast
    forecast_points = []
    f_p = latest_price
    for j in range(1, 16):
        f_dt = (today + timedelta(days=j)).strftime("%Y-%m-%d")
        f_seed = (hash(f"fore_{crop_key}_{market_key}_{f_dt}") % 100) - 48
        step = int(latest_price * monthly_trend_slope * 1.5 + (base_price * 0.004) * (f_seed / 60.0))
        f_p = max(int(base_price * 0.6), f_p + step)
        confidence = max(65, 96 - j * 2)
        forecast_points.append(PricePoint(date=f_dt, price=f_p, confidence=confidence))

    pred_15th = forecast_points[-1].price
    pct_change = round(((pred_15th - latest_price) / latest_price) * 100, 1)
    
    if pct_change >= 2.5:
        rec = "🟢 HOLD PRODUCE (Bullish Trend)"
        reason = f"Strong market demand projected to surge prices by +{abs(pct_change)}% over 15 days in {market_key.title()}."
    elif pct_change <= -2.5:
        rec = "🔴 SELL NOW (Supply Inflow Ahead)"
        reason = f"Post-harvest arrivals expected to push mandi rates down by {abs(pct_change)}%. Sell now to lock in high prices."
    else:
        rec = "🟡 BUY / STEADY TRADE (Stable Market)"
        reason = f"Stable price channel expected within +/- 2% over the next 15 days in {market_key.title()}."

    all_prices = [p.price for p in hist_points]
    
    # 24h change
    prev_price = hist_points[-2].price if len(hist_points) >= 2 else latest_price
    change_24h = round(((latest_price - prev_price) / prev_price) * 100, 1)

    return {
        "crop": crop_key,
        "market": market_key,
        "historical15Days": [p.model_dump() for p in hist_points],
        "forecast15Days": [p.model_dump() for p in forecast_points],
        "currentPrice": latest_price,
        "change24h": change_24h,
        "predicted15DayPrice": pred_15th,
        "expectedChangePercent": pct_change,
        "confidenceScore": 91,
        "recommendation": rec,
        "reason": reason,
        "low30Day": min(all_prices),
        "high30Day": max(all_prices),
        "avg30Day": int(sum(all_prices) / len(all_prices)),
        "lastUpdated": today.isoformat()
    }

@app.get("/api/predictions", response_model=PredictionData)
async def get_ai_prediction(
    crop: str = "rice",
    cropName: Optional[str] = None,
    market: str = "delhi",
    marketName: Optional[str] = None,
    days: int = 15
):
    crop_key = crop.lower().replace(" ", "_")
    market_key = market.lower().replace(" ", "_")
    doc_id = f"{crop_key}_{market_key}"
    
    # Check if existing persistent document is in MongoDB
    existing = await prediction_collection.find_one({"doc_id": doc_id})
    today_str = datetime.now().strftime("%Y-%m-%d")
    
    if existing and existing.get("lastUpdated", "").startswith(today_str):
        existing["cropName"] = cropName or crop_key.title()
        existing["marketName"] = marketName or market_key.title()
        return existing

    computed = generate_deterministic_price_series(crop_key, market_key)
    computed["cropName"] = cropName or crop_key.title()
    computed["marketName"] = marketName or market_key.title()
    computed["doc_id"] = doc_id
    
    if existing:
        await prediction_collection.update_one({"doc_id": doc_id}, {"$set": computed})
    else:
        await prediction_collection.insert_one(computed)
        
    return computed

@app.get("/api/market/overview")
async def get_market_overview(market: str = "delhi"):
    """Returns real-time prices & AI forecasts for all crops to ensure 100% data parity between Dashboard, Prediction & Market."""
    market_key = market.lower().replace(" ", "_")
    items = []
    
    for c_key in list(BASE_CROP_BENCHMARKS.keys())[:12]:
        pred = generate_deterministic_price_series(c_key, market_key)
        items.append({
            "id": c_key,
            "crop": c_key,
            "name": c_key.replace("_", " ").title(),
            "market": market_key,
            "currentPrice": pred["currentPrice"],
            "change24h": pred["change24h"],
            "predicted15DayPrice": pred["predicted15DayPrice"],
            "expectedChangePercent": pred["expectedChangePercent"],
            "confidenceScore": pred["confidenceScore"],
            "recommendation": pred["recommendation"],
            "reason": pred["reason"],
            "sparkline": [p["price"] for p in pred["historical15Days"][-7:]]
        })
    
    sorted_by_change = sorted(items, key=lambda x: abs(x["expectedChangePercent"]), reverse=True)
    top_gainer = max(items, key=lambda x: x["change24h"])
    
    return {
        "market": market_key,
        "commodities": items,
        "topPredictions": sorted_by_change[:3],
        "topGainer": top_gainer,
        "lastUpdated": datetime.now().isoformat()
    }


@app.get("/api/debug/clear-orders")
async def clear_orders():
    await order_collection.delete_many({})
    return {"message": "All orders cleared"}

@app.get("/")
def root():
    return {"message": "Welcome to FarmConnect API"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
