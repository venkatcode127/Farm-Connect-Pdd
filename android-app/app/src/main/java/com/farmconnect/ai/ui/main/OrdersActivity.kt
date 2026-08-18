package com.farmconnect.ai.ui.main

import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.farmconnect.ai.data.local.SessionManager
import com.farmconnect.ai.data.network.RetrofitClient
import com.farmconnect.ai.databinding.ActivityOrdersBinding
import kotlinx.coroutines.launch

class OrdersActivity : AppCompatActivity() {
    private lateinit var binding: ActivityOrdersBinding
    private lateinit var adapter: OrderAdapter
    private lateinit var sessionManager: SessionManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityOrdersBinding.inflate(layoutInflater)
        setContentView(binding.root)

        sessionManager = SessionManager(this)
        
        adapter = OrderAdapter(emptyList(), sessionManager.getUserPhone() ?: "")
        binding.recyclerViewOrders.layoutManager = LinearLayoutManager(this)
        binding.recyclerViewOrders.adapter = adapter

        loadOrders()
    }

    private fun loadOrders() {
        binding.progressBar.visibility = View.VISIBLE
        lifecycleScope.launch {
            try {
                val response = RetrofitClient.getApiService(this@OrdersActivity).getOrders()
                if (response.isSuccessful && response.body() != null) {
                    val allOrders = response.body()!!
                    // Filter orders relevant to current user
                    val myPhone = sessionManager.getUserPhone()
                    val myOrders = allOrders.filter { it.buyer == myPhone || it.seller == myPhone }
                    
                    adapter.updateData(myOrders)
                } else {
                    Toast.makeText(this@OrdersActivity, "Failed to load orders", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(this@OrdersActivity, "Error: ${e.message}", Toast.LENGTH_SHORT).show()
            } finally {
                binding.progressBar.visibility = View.GONE
            }
        }
    }
}
