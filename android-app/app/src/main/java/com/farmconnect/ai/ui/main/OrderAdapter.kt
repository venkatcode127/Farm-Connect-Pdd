package com.farmconnect.ai.ui.main

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.farmconnect.ai.data.model.Order
import com.farmconnect.ai.databinding.ItemOrderBinding

class OrderAdapter(
    private var orders: List<Order>,
    private val currentUserPhone: String
) : RecyclerView.Adapter<OrderAdapter.OrderViewHolder>() {

    class OrderViewHolder(val binding: ItemOrderBinding) : RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): OrderViewHolder {
        val binding = ItemOrderBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return OrderViewHolder(binding)
    }

    override fun onBindViewHolder(holder: OrderViewHolder, position: Int) {
        val order = orders[position]
        holder.binding.tvOrderTitle.text = "${order.listingEmoji ?: "📦"} ${order.listingName ?: "Unknown"}"
        holder.binding.tvOrderPrice.text = "₹${order.totalPrice}"
        
        val isBuyer = order.buyer == currentUserPhone
        holder.binding.tvOrderRole.text = if (isBuyer) "Bought from: ${order.seller}" else "Sold to: ${order.buyer}"
        
        holder.binding.tvOrderStatus.text = "Status: ${order.status.uppercase()}"
    }

    override fun getItemCount() = orders.size

    fun updateData(newOrders: List<Order>) {
        orders = newOrders
        notifyDataSetChanged()
    }
}
