package com.farmconnect.ai.ui.main

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.farmconnect.ai.data.network.RetrofitClient
import com.farmconnect.ai.databinding.FragmentAdminBinding
import kotlinx.coroutines.launch

class AdminFragment : Fragment() {
    private var _binding: FragmentAdminBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentAdminBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        setupActivities()
    }

    private fun setupActivities() {
        binding.rvActivities.layoutManager = LinearLayoutManager(context)
        
        lifecycleScope.launch {
            try {
                val response = RetrofitClient.getApiService(requireContext()).getListings()
                if (response.isSuccessful && response.body() != null) {
                    val listings = response.body()!!
                    // Reuse ListingAdapter for Admin too, or a specific activity adapter
                    val adapter = ListingAdapter(listings) { listing ->
                        Toast.makeText(context, "Admin: managing ${listing.crop}", Toast.LENGTH_SHORT).show()
                    }
                    binding.rvActivities.adapter = adapter
                }
            } catch (e: Exception) {
                // Silently fail or show error
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
