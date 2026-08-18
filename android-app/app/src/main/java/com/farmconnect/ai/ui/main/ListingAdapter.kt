package com.farmconnect.ai.ui.main

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.farmconnect.ai.data.model.Listing
import com.farmconnect.ai.databinding.ItemListingBinding

class ListingAdapter(
    private var listings: List<Listing>,
    private val onItemClick: (Listing) -> Unit
) : RecyclerView.Adapter<ListingAdapter.ListingViewHolder>() {

    class ListingViewHolder(val binding: ItemListingBinding) : RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ListingViewHolder {
        val binding = ItemListingBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ListingViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ListingViewHolder, position: Int) {
        val listing = listings[position]
        holder.binding.apply {
            tvEmoji.text = listing.emoji
            tvCrop.text = listing.crop
            tvSellerName.text = "Seller: ${listing.name}"
            tvPrice.text = "₹${listing.price}"
            tvLocation.text = listing.location
            tvQuantity.text = "Qty: ${listing.qty}"
            
            root.setOnClickListener { onItemClick(listing) }
        }
    }

    override fun getItemCount() = listings.size

    fun updateData(newListings: List<Listing>) {
        listings = newListings
        notifyDataSetChanged()
    }
}
