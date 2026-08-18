package com.farmconnect.ai.ui.auth

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.farmconnect.ai.data.local.SessionManager
import com.farmconnect.ai.data.network.RetrofitClient
import com.farmconnect.ai.databinding.ActivityRegisterBinding
import com.farmconnect.ai.ui.main.MainActivity
import kotlinx.coroutines.launch

class RegisterActivity : AppCompatActivity() {
    private lateinit var binding: ActivityRegisterBinding
    private lateinit var sessionManager: SessionManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityRegisterBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        sessionManager = SessionManager(this)

        binding.btnRegister.setOnClickListener {
            val name = binding.etName.text.toString().trim()
            val phone = binding.etPhone.text.toString().trim()
            val password = binding.etPassword.text.toString().trim()
            val location = binding.etLocation.text.toString().trim()

            if (name.isEmpty() || phone.isEmpty() || password.isEmpty() || location.isEmpty()) {
                Toast.makeText(this, "Please enter all fields", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            binding.progressBar.visibility = View.VISIBLE
            binding.btnRegister.isEnabled = false

            lifecycleScope.launch {
                try {
                    val request = mapOf(
                        "name" to name,
                        "phone" to phone,
                        "password" to password,
                        "role" to "farmer",
                        "location" to location
                    )
                    val response = RetrofitClient.getApiService(this@RegisterActivity).register(request)
                    if (response.isSuccessful && response.body() != null) {
                        val user = response.body()!!
                        sessionManager.saveSession(user.id, user.name, user.phone, user.role)
                        Toast.makeText(this@RegisterActivity, "Registration successful", Toast.LENGTH_SHORT).show()
                        startActivity(Intent(this@RegisterActivity, MainActivity::class.java))
                        finish()
                    } else {
                        Toast.makeText(this@RegisterActivity, "Registration failed", Toast.LENGTH_SHORT).show()
                    }
                } catch (e: Exception) {
                    Toast.makeText(this@RegisterActivity, "Error: ${e.message}", Toast.LENGTH_SHORT).show()
                } finally {
                    binding.progressBar.visibility = View.GONE
                    binding.btnRegister.isEnabled = true
                }
            }
        }
        
        binding.tvLogin.setOnClickListener {
            finish()
        }
    }
}
