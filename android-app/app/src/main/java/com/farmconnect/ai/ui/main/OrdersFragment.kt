package com.farmconnect.ai.ui.main

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.farmconnect.ai.data.local.SessionManager
import com.farmconnect.ai.data.network.RetrofitClient
import com.farmconnect.ai.databinding.FragmentOrdersBinding
import kotlinx.coroutines.launch

class OrdersFragment : Fragment() {
    private var _binding: FragmentOrdersBinding? = null
    private val binding get() = _binding!!
    private lateinit var adapter: OrderAdapter
    private lateinit var sessionManager: SessionManager

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentOrdersBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        sessionManager = SessionManager(requireContext())
        
        adapter = OrderAdapter(emptyList(), sessionManager.getUserPhone() ?: "")
        binding.recyclerViewOrders.layoutManager = LinearLayoutManager(context)
        binding.recyclerViewOrders.adapter = adapter

        loadOrders()
    }

    private fun loadOrders() {
        binding.progressBar.visibility = View.VISIBLE
        lifecycleScope.launch {
            try {
                val response = RetrofitClient.getApiService(requireContext()).getOrders()
                if (response.isSuccessful && response.body() != null) {
                    val allOrders = response.body()!!
                    val myPhone = sessionManager.getUserPhone()
                    val myOrders = allOrders.filter { it.buyer == myPhone || it.seller == myPhone }
                    adapter.updateData(myOrders)
                }
            } catch (e: Exception) {
                Toast.makeText(context, "Error: ${e.message}", Toast.LENGTH_SHORT).show()
            } finally {
                binding.progressBar.visibility = View.GONE
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
