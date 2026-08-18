package com.farmconnect.ai.ui.auth

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.farmconnect.ai.data.local.SessionManager
import com.farmconnect.ai.data.network.RetrofitClient
import com.farmconnect.ai.databinding.ActivityLoginBinding
import com.farmconnect.ai.ui.main.MainActivity
import kotlinx.coroutines.launch

class LoginActivity : AppCompatActivity() {
    private lateinit var binding: ActivityLoginBinding
    private lateinit var sessionManager: SessionManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        sessionManager = SessionManager(this)
        
        if (sessionManager.isLoggedIn()) {
            startActivity(Intent(this, MainActivity::class.java))
            finish()
            return
        }

        binding.btnLogin.setOnClickListener {
            val phone = binding.etPhone.text.toString().trim()
            val password = binding.etPassword.text.toString().trim()

            if (phone.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "Please enter all fields", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            binding.progressBar.visibility = View.VISIBLE
            binding.btnLogin.isEnabled = false

            lifecycleScope.launch {
                try {
                    val request = mapOf("phone" to phone, "password" to password)
                    val response = RetrofitClient.getApiService(this@LoginActivity).login(request)
                    if (response.isSuccessful && response.body() != null) {
                        val user = response.body()!!.user
                        sessionManager.saveSession(user.id, user.name, user.phone, user.role)
                        Toast.makeText(this@LoginActivity, "Login successful", Toast.LENGTH_SHORT).show()
                        startActivity(Intent(this@LoginActivity, MainActivity::class.java))
                        finish()
                    } else {
                        Toast.makeText(this@LoginActivity, "Invalid credentials", Toast.LENGTH_SHORT).show()
                    }
                } catch (e: Exception) {
                    Toast.makeText(this@LoginActivity, "Error: ${e.message}", Toast.LENGTH_SHORT).show()
                } finally {
                    binding.progressBar.visibility = View.GONE
                    binding.btnLogin.isEnabled = true
                }
            }
        }
        
        binding.tvRegister.setOnClickListener {
            startActivity(Intent(this, RegisterActivity::class.java))
        }
    }
}
