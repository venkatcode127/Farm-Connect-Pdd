package com.farmconnect.ai.ui.main

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import com.farmconnect.ai.databinding.FragmentMarketPricesBinding

class MarketPricesFragment : Fragment() {
    private var _binding: FragmentMarketPricesBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentMarketPricesBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        setupSpinner()
        setupPrices()
    }

    private fun setupSpinner() {
        val states = listOf("Azadpur, Delhi", "Vashi, Mumbai", "Koyambedu, Chennai", "Kalyan, West Bengal")
        val adapter = ArrayAdapter(requireContext(), android.R.layout.simple_spinner_item, states)
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        binding.spinnerState.adapter = adapter
    }

    private fun setupPrices() {
        val sampleData = listOf(
            PriceItem("Rice (Basmati)", "🌾", "₹3,853", "▲ 1%", true),
            PriceItem("Wheat", "🌾", "₹2,542", "▲ 1.2%", true),
            PriceItem("Tomato", "🍅", "₹3,466", "▼ 0.6%", false),
            PriceItem("Potato", "🥔", "₹1,200", "▲ 0.5%", true),
            PriceItem("Onion", "🧅", "₹2,100", "▼ 2.1%", false),
            PriceItem("Red Chilli", "🌶️", "₹8,955", "▲ 1.2%", true)
        )
        
        binding.rvMarketPrices.layoutManager = LinearLayoutManager(context)
        binding.rvMarketPrices.adapter = PriceOverviewAdapter(sampleData)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
