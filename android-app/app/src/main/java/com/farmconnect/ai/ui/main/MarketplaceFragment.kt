package com.farmconnect.ai.ui.main

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.farmconnect.ai.data.network.RetrofitClient
import com.farmconnect.ai.databinding.FragmentMarketplaceBinding
import kotlinx.coroutines.launch

class MarketplaceFragment : Fragment() {
    private var _binding: FragmentMarketplaceBinding? = null
    private val binding get() = _binding!!
    private lateinit var adapter: ListingAdapter

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentMarketplaceBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        setupRecyclerView()
        setupListeners()
        loadListings()
    }

    private fun setupRecyclerView() {
        adapter = ListingAdapter(emptyList()) { listing ->
            Toast.makeText(context, "Clicked: ${listing.crop}", Toast.LENGTH_SHORT).show()
        }
        binding.recyclerView.layoutManager = LinearLayoutManager(context)
        binding.recyclerView.adapter = adapter
    }

    private fun setupListeners() {
        binding.btnAdd.setOnClickListener {
            startActivity(Intent(context, AddListingActivity::class.java))
        }
    }

    private fun loadListings() {
        binding.progressBar.visibility = View.VISIBLE
        binding.recyclerView.visibility = View.GONE
        
        lifecycleScope.launch {
            try {
                val response = RetrofitClient.apiService.getListings()
                if (response.isSuccessful && response.body() != null) {
                    adapter.updateData(response.body()!!)
                    binding.recyclerView.visibility = View.VISIBLE
                } else {
                    Toast.makeText(context, "Failed to load listings", Toast.LENGTH_SHORT).show()
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
