package com.farmconnect.ai.ui.main

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.farmconnect.ai.databinding.ItemPriceOverviewBinding

data class PriceItem(
    val crop: String,
    val emoji: String,
    val price: String,
    val change: String,
    val isPositive: Boolean
)

class PriceOverviewAdapter(private val items: List<PriceItem>) :
    RecyclerView.Adapter<PriceOverviewAdapter.ViewHolder>() {

    class ViewHolder(val binding: ItemPriceOverviewBinding) : RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemPriceOverviewBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val item = items[position]
        holder.binding.apply {
            tvCropEmoji.text = item.emoji
            tvCropName.text = item.crop
            tvPrice.text = item.price
            tvChange.text = item.change
            tvChange.setTextColor(if (item.isPositive) 0xFF2ECC71.toInt() else 0xFFE74C3C.toInt())
        }
    }

    override fun getItemCount() = items.size
}
