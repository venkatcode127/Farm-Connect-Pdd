package com.farmconnect.ai.ui.main

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.farmconnect.ai.databinding.ItemAiPredictionBinding

data class AiPredictionItem(
    val crop: String,
    val emoji: String,
    val trend: String,
    val confidence: String,
    val days: String,
    val recommendation: String
)

class AiPredictionAdapter(private val items: List<AiPredictionItem>) :
    RecyclerView.Adapter<AiPredictionAdapter.ViewHolder>() {

    class ViewHolder(val binding: ItemAiPredictionBinding) : RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemAiPredictionBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val item = items[position]
        holder.binding.apply {
            tvEmoji.text = item.emoji
            tvCropName.text = item.crop
            tvTrend.text = item.trend
            tvConfidence.text = "🎯 ${item.confidence} confidence"
            tvDays.text = "📈 ${item.days}"
            tvRecommendation.text = item.recommendation
        }
    }

    override fun getItemCount() = items.size
}
