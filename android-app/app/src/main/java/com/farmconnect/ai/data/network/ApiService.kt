package com.farmconnect.ai.data.network

import com.farmconnect.ai.data.model.*
import retrofit2.Response
import retrofit2.http.*

interface ApiService {
    @POST("/api/auth/register")
    suspend fun register(@Body user: Map<String, String>): Response<User>

    @POST("/api/auth/login")
    suspend fun login(@Body credentials: Map<String, String>): Response<LoginResponse>

    @GET("/api/listings")
    suspend fun getListings(): Response<List<Listing>>

    @POST("/api/listings")
    suspend fun createListing(@Body listing: ListingCreate): Response<Listing>

    @GET("/api/orders")
    suspend fun getOrders(): Response<List<Order>>

    @POST("/api/orders")
    suspend fun createOrder(@Body order: OrderCreate): Response<Order>
}
