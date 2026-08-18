package com.farmconnect.ai.ui.main

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import com.farmconnect.ai.databinding.FragmentWeatherBinding
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

class WeatherFragment : Fragment() {
    private var _binding: FragmentWeatherBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentWeatherBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        fetchWeatherData()
    }

    private fun fetchWeatherData() {
        binding.layoutContent.visibility = View.GONE
        binding.progressBar.visibility = View.VISIBLE
        
        lifecycleScope.launch {
            // Simulate network call
            delay(1000)
            binding.progressBar.visibility = View.GONE
            binding.layoutContent.visibility = View.VISIBLE
            
            // In a real app, this would use a Weather API (OpenWeatherMap etc)
            binding.tvTemp.text = "☀️ 31°C"
            binding.tvStatus.text = "Mostly Clear"
            binding.tvAdvice.text = "Perfect weather for harvesting Rice today. High humidity expected tomorrow."
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
