package com.farmconnect.ai.ui.main

import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.farmconnect.ai.data.local.SessionManager
import com.farmconnect.ai.data.model.ListingCreate
import com.farmconnect.ai.data.network.RetrofitClient
import com.farmconnect.ai.databinding.ActivityAddListingBinding
import kotlinx.coroutines.launch

class AddListingActivity : AppCompatActivity() {
    private lateinit var binding: ActivityAddListingBinding
    private lateinit var sessionManager: SessionManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityAddListingBinding.inflate(layoutInflater)
        setContentView(binding.root)

        sessionManager = SessionManager(this)

        binding.btnSubmit.setOnClickListener {
            val crop = binding.etCrop.text.toString().trim()
            val emoji = binding.etEmoji.text.toString().trim()
            val qtyStr = binding.etQty.text.toString().trim()
            val priceStr = binding.etPrice.text.toString().trim()
            val desc = binding.etDesc.text.toString().trim()

            if (crop.isEmpty() || emoji.isEmpty() || qtyStr.isEmpty() || priceStr.isEmpty()) {
                Toast.makeText(this, "Please enter required fields", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val qty = qtyStr.toIntOrNull() ?: 0
            val price = priceStr.toDoubleOrNull() ?: 0.0

            binding.progressBar.visibility = View.VISIBLE
            binding.btnSubmit.isEnabled = false

            lifecycleScope.launch {
                try {
                    val listingCreate = ListingCreate(
                        crop = crop,
                        emoji = emoji,
                        name = sessionManager.getUserName() ?: "Unknown",
                        qty = qty,
                        price = price,
                        location = "Unknown Location", // Simplification
                        contact = sessionManager.getUserPhone() ?: "",
                        desc = desc,
                        seller = sessionManager.getUserId() ?: ""
                    )
                    
                    val response = RetrofitClient.getApiService(this@AddListingActivity).createListing(listingCreate)
                    if (response.isSuccessful) {
                        Toast.makeText(this@AddListingActivity, "Listing created!", Toast.LENGTH_SHORT).show()
                        finish()
                    } else {
                        Toast.makeText(this@AddListingActivity, "Failed to create listing", Toast.LENGTH_SHORT).show()
                    }
                } catch (e: Exception) {
                    Toast.makeText(this@AddListingActivity, "Error: ${e.message}", Toast.LENGTH_SHORT).show()
                } finally {
                    binding.progressBar.visibility = View.GONE
                    binding.btnSubmit.isEnabled = true
                }
            }
        }
    }
}
