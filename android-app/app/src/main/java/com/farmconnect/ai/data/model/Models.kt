package com.farmconnect.ai.data.model

data class User(
    val id: String,
    val name: String,
    val phone: String,
    val email: String?,
    val role: String,
    val location: String?
)

data class LoginResponse(
    val message: String,
    val user: User
)

data class Listing(
    val id: String,
    val crop: String,
    val emoji: String,
    val name: String,
    val qty: Int,
    val price: Double,
    val location: String,
    val contact: String,
    val desc: String?,
    val seller: String
)

data class ListingCreate(
    val crop: String,
    val emoji: String,
    val name: String,
    val qty: Int,
    val price: Double,
    val location: String,
    val contact: String,
    val desc: String?,
    val seller: String
)

data class Order(
    val id: String,
    val listingId: String,
    val listingEmoji: String,
    val listingName: String,
    val listingPrice: Double,
    val buyer: String,
    val seller: String,
    val qty: Int,
    val totalPrice: Double,
    val status: String,
    val createdAt: String?
)

data class OrderCreate(
    val listingId: String,
    val listingEmoji: String,
    val listingName: String,
    val listingPrice: Double,
    val buyer: String,
    val seller: String,
    val qty: Int,
    val totalPrice: Double
)
