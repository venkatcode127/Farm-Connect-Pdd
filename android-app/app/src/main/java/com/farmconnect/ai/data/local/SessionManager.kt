package com.farmconnect.ai.data.local

import android.content.Context
import android.content.SharedPreferences

class SessionManager(context: Context) {
    private val prefs: SharedPreferences = context.getSharedPreferences("farm_connect_session", Context.MODE_PRIVATE)

    fun saveSession(userId: String, name: String, phone: String, role: String) {
        prefs.edit().apply {
            putString("USER_ID", userId)
            putString("USER_NAME", name)
            putString("USER_PHONE", phone)
            putString("USER_ROLE", role)
            putBoolean("IS_LOGGED_IN", true)
            apply()
        }
    }

    fun isLoggedIn(): Boolean = prefs.getBoolean("IS_LOGGED_IN", false)
    
    fun getUserId(): String? = prefs.getString("USER_ID", null)
    fun getUserName(): String? = prefs.getString("USER_NAME", null)
    fun getUserPhone(): String? = prefs.getString("USER_PHONE", null)

    fun logout() {
        prefs.edit().clear().apply()
    }

    fun saveServerIp(ip: String) {
        prefs.edit().putString("SERVER_IP", ip).apply()
    }

    fun getServerIp(): String? = prefs.getString("SERVER_IP", null)
}
