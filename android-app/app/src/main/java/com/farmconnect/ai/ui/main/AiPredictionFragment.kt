package com.farmconnect.ai.ui.main

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.farmconnect.ai.databinding.FragmentAiPredictionBinding
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

class AiPredictionFragment : Fragment() {
    private var _binding: FragmentAiPredictionBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentAiPredictionBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        loadPredictions()
    }

    private fun loadPredictions() {
        binding.rvAiPredictions.visibility = View.GONE
        // Simulation of AI computation
        lifecycleScope.launch {
            delay(1500)
            val sampleData = listOf(
                AiPredictionItem("Red Chilli", "🌶️", "▲ 1.2%", "92%", "7-day trend", "HOLD/BUY"),
                AiPredictionItem("Wheat", "🌾", "▲ 1.2%", "92%", "7-day trend", "HOLD/BUY"),
                AiPredictionItem("Rice (Basmati)", "🌾", "▼ 0.5%", "85%", "7-day trend", "SELL")
            )
            
            binding.rvAiPredictions.layoutManager = LinearLayoutManager(context)
            binding.rvAiPredictions.adapter = AiPredictionAdapter(sampleData)
            binding.rvAiPredictions.visibility = View.VISIBLE
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
