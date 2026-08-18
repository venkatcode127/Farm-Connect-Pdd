package com.farmconnect.ai.ui.main

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.farmconnect.ai.data.local.SessionManager
import com.farmconnect.ai.databinding.ActivitySettingsBinding

class SettingsActivity : AppCompatActivity() {
    private lateinit var binding: ActivitySettingsBinding
    private lateinit var sessionManager: SessionManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySettingsBinding.inflate(layoutInflater)
        setContentView(binding.root)

        sessionManager = SessionManager(this)

        val currentIp = sessionManager.getServerIp() ?: "192.168.1.28"
        binding.etServerIp.setText(currentIp)

        binding.btnSave.setOnClickListener {
            val newIp = binding.etServerIp.text.toString().trim()
            if (newIp.isNotEmpty()) {
                sessionManager.saveServerIp(newIp)
                Toast.makeText(this, "Server IP updated! Please restart the app.", Toast.LENGTH_LONG).show()
                finish()
            }
        }
    }
}
