package com.farmconnect.ai.data.network

import android.content.Context
import com.farmconnect.ai.data.local.SessionManager
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object RetrofitClient {
    private var retrofit: Retrofit? = null

    private fun getRetrofit(context: Context): Retrofit {
        val sessionManager = SessionManager(context)
        val ip = sessionManager.getServerIp() ?: "192.168.1.28"
        val baseUrl = "http://$ip:8000"

        val loggingInterceptor = HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        }

        val okHttpClient = OkHttpClient.Builder()
            .addInterceptor(loggingInterceptor)
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .build()

        return Retrofit.Builder()
            .baseUrl(baseUrl)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }

    fun getApiService(context: Context): ApiService {
        return getRetrofit(context).create(ApiService::class.java)
    }
}
