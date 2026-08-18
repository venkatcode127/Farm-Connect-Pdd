package com.farmconnect.ai.ui.main

import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.farmconnect.ai.data.local.SessionManager
import com.farmconnect.ai.data.model.OrderCreate
import com.farmconnect.ai.data.network.RetrofitClient
import com.farmconnect.ai.databinding.ActivityListingDetailBinding
import kotlinx.coroutines.launch

class ListingDetailActivity : AppCompatActivity() {
    private lateinit var binding: ActivityListingDetailBinding
    private lateinit var sessionManager: SessionManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityListingDetailBinding.inflate(layoutInflater)
        setContentView(binding.root)

        sessionManager = SessionManager(this)
        
        setupToolbar()
        displayData()
        setupListeners()
    }

    private fun setupToolbar() {
        setSupportActionBar(binding.toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        binding.toolbar.setNavigationOnClickListener { finish() }
        binding.toolbar.title = "Listing Details"
    }

    private fun displayData() {
        // These keys should match what is passed from the adapter
        val crop = intent.getStringExtra("CROP") ?: ""
        val emoji = intent.getStringExtra("EMOJI") ?: ""
        val seller = intent.getStringExtra("SELLER") ?: ""
        val price = intent.getDoubleExtra("PRICE", 0.0)
        val qty = intent.getIntExtra("QTY", 0)
        val location = intent.getStringExtra("LOCATION") ?: ""
        val desc = intent.getStringExtra("DESC") ?: "No description provided."

        binding.tvEmoji.text = emoji
        binding.tvCropName.text = crop
        binding.tvSellerName.text = "Seller: $seller"
        binding.tvPrice.text = "₹$price"
        binding.tvQuantity.text = "$qty QT"
        binding.tvLocation.text = "📍 $location"
        binding.tvDescription.text = desc
    }

    private fun setupListeners() {
        binding.btnBuy.setOnClickListener {
            val listingId = intent.getStringExtra("ID") ?: return@setOnClickListener
            
            binding.progressBar.visibility = View.VISIBLE
            binding.btnBuy.isEnabled = false
            
            lifecycleScope.launch {
                try {
                    val orderCreate = OrderCreate(
                        listingId = listingId,
                        listingEmoji = intent.getStringExtra("EMOJI") ?: "🌾",
                        listingName = intent.getStringExtra("CROP") ?: "Unknown",
                        listingPrice = intent.getDoubleExtra("PRICE", 0.0),
                        buyer = sessionManager.getUserPhone() ?: "",
                        seller = intent.getStringExtra("SELLER_PHONE") ?: "",
                        qty = 1, // Defaulting to 1 for now
                        totalPrice = intent.getDoubleExtra("PRICE", 0.0)
                    )
                    
                    val response = RetrofitClient.getApiService(this@ListingDetailActivity).createOrder(orderCreate)
                    if (response.isSuccessful) {
                        Toast.makeText(this@ListingDetailActivity, "Order placed successfully!", Toast.LENGTH_LONG).show()
                        finish()
                    } else {
                        Toast.makeText(this@ListingDetailActivity, "Failed to place order: ${response.code()}", Toast.LENGTH_SHORT).show()
                    }
                } catch (e: Exception) {
                    Toast.makeText(this@ListingDetailActivity, "Error: ${e.message}", Toast.LENGTH_SHORT).show()
                } finally {
                    binding.progressBar.visibility = View.GONE
                    binding.btnBuy.isEnabled = true
                }
            }
        }
    }
}
