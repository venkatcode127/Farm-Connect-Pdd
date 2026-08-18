package com.farmconnect.ai.ui.main

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import com.farmconnect.ai.databinding.FragmentAnalyticsBinding

class AnalyticsFragment : Fragment() {
    private var _binding: FragmentAnalyticsBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentAnalyticsBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        setupSummary()
        setupTrendsList()
    }

    private fun setupSummary() {
        binding.tvTotalEarnings.text = "₹12,450"
        binding.tvOrdersCount.text = "14 Completed"
    }

    private fun setupTrendsList() {
        val trendData = listOf(
            PriceItem("Wheat Demand", "📈", "High", "+15% YoY", true),
            PriceItem("Organic Farming", "🌿", "Growing", "+22%", true),
            PriceItem("Fertilizer Costs", "🧪", "Rising", "+8%", false)
        )
        binding.rvTrends.layoutManager = LinearLayoutManager(context)
        binding.rvTrends.adapter = PriceOverviewAdapter(trendData)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
