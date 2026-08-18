package com.farmconnect.ai.ui.main

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import com.farmconnect.ai.databinding.FragmentDashboardBinding

class DashboardFragment : Fragment() {
    private var _binding: FragmentDashboardBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentDashboardBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        setupMandiSelector()
        setupPriceOverview()
        setupListeners()
    }

    private fun setupListeners() {
        binding.btnGetPrediction.setOnClickListener {
            (activity as? MainActivity)?.navigateToAiPrediction()
        }

        binding.cardTopGainer.setOnClickListener {
            (activity as? MainActivity)?.navigateToAiPrediction()
        }

        binding.cardPriceAlerts.setOnClickListener {
            Toast.makeText(context, "You have 5 active price alerts for your region.", Toast.LENGTH_SHORT).show()
        }

        binding.cardActiveListings.setOnClickListener {
            (activity as? MainActivity)?.navigateToMarketplace()
        }

        binding.cardMarketsTracked.setOnClickListener {
            (activity as? MainActivity)?.navigateToMarketPrices()
        }
        
        binding.cardMandi.setOnClickListener {
            binding.spinnerMandi.performClick()
        }
    }

    private fun setupMandiSelector() {
        val states = listOf(
            "Azadpur, Delhi 📍", 
            "Vashi, Mumbai", 
            "Koyambedu, Chennai",
            "Kalyan, West Bengal",
            "Sardarpura, Rajasthan",
            "Guntur, Andhra Pradesh",
            "Indore, Madhya Pradesh",
            "Nashik, Maharashtra"
        )
        val adapter = ArrayAdapter(requireContext(), android.R.layout.simple_spinner_item, states)
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        binding.spinnerMandi.adapter = adapter
    }

    private fun setupPriceOverview() {
        val sampleData = listOf(
            PriceItem("Rice (Basmati)", "🌾", "₹3,853", "▲ 1%", true),
            PriceItem("Wheat", "🌾", "₹2,542", "▲ 1.2%", true),
            PriceItem("Tomato", "🍅", "₹3,466", "▼ 0.6%", false)
        )
        
        binding.rvPriceOverview.layoutManager = LinearLayoutManager(context)
        binding.rvPriceOverview.adapter = PriceOverviewAdapter(sampleData)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
