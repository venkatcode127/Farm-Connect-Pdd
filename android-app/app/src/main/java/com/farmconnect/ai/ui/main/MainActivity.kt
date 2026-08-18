package com.farmconnect.ai.ui.main

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.ActionBarDrawerToggle
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.GravityCompat
import androidx.fragment.app.Fragment
import com.farmconnect.ai.R
import com.farmconnect.ai.data.local.SessionManager
import com.farmconnect.ai.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding
    private lateinit var sessionManager: SessionManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        sessionManager = SessionManager(this)

        setupToolbar()
        setupNavigation()
        
        if (savedInstanceState == null) {
            replaceFragment(DashboardFragment(), "Dashboard")
        }
    }

    private fun setupToolbar() {
        setSupportActionBar(binding.toolbar)
        val toggle = ActionBarDrawerToggle(
            this, binding.drawerLayout, binding.toolbar,
            R.string.navigation_drawer_open, R.string.navigation_drawer_close
        )
        binding.drawerLayout.addDrawerListener(toggle)
        toggle.syncState()

        binding.toolbar.setNavigationOnClickListener {
            if (binding.drawerLayout.isDrawerOpen(GravityCompat.START)) {
                binding.drawerLayout.closeDrawer(GravityCompat.START)
            } else {
                binding.drawerLayout.openDrawer(GravityCompat.START)
            }
        }
    }

    private fun setupNavigation() {
        binding.bottomNav.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_dashboard -> replaceFragment(DashboardFragment(), "Dashboard")
                R.id.nav_ai -> replaceFragment(AiPredictionFragment(), "AI Prediction")
                R.id.nav_market -> replaceFragment(MarketplaceFragment(), "Marketplace")
                R.id.nav_settings -> {
                    startActivity(Intent(this, SettingsActivity::class.java))
                    false
                }
                else -> false
            }
        }

        binding.navigationView.setNavigationItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_dashboard -> {
                    replaceFragment(DashboardFragment(), "Dashboard")
                    binding.bottomNav.selectedItemId = R.id.nav_dashboard
                }
                R.id.nav_ai -> {
                    replaceFragment(AiPredictionFragment(), "AI Prediction")
                    binding.bottomNav.selectedItemId = R.id.nav_ai
                }
                R.id.nav_market_prices -> replaceFragment(MarketPricesFragment(), "Market Prices")
                R.id.nav_marketplace -> {
                    replaceFragment(MarketplaceFragment(), "Marketplace")
                    binding.bottomNav.selectedItemId = R.id.nav_market
                }
                R.id.nav_orders -> replaceFragment(OrdersFragment(), "My Orders")
                R.id.nav_weather -> replaceFragment(WeatherFragment(), "Weather")
                R.id.nav_analytics -> replaceFragment(AnalyticsFragment(), "Analytics")
                R.id.nav_admin -> replaceFragment(AdminFragment(), "Admin Panel")
                R.id.nav_settings -> startActivity(Intent(this, SettingsActivity::class.java))
            }
            binding.drawerLayout.closeDrawer(GravityCompat.START)
            true
        }
    }

    fun navigateToAiPrediction() {
        replaceFragment(AiPredictionFragment(), "AI Prediction")
        binding.bottomNav.selectedItemId = R.id.nav_ai
    }

    fun navigateToMarketplace() {
        replaceFragment(MarketplaceFragment(), "Marketplace")
        binding.bottomNav.selectedItemId = R.id.nav_market
    }

    fun navigateToMarketPrices() {
        replaceFragment(MarketPricesFragment(), "Market Prices")
    }

    private fun replaceFragment(fragment: Fragment, title: String): Boolean {
        binding.toolbar.title = title
        supportFragmentManager.beginTransaction()
            .replace(R.id.nav_host_fragment, fragment)
            .commit()
        return true
    }

    override fun onBackPressed() {
        if (binding.drawerLayout.isDrawerOpen(GravityCompat.START)) {
            binding.drawerLayout.closeDrawer(GravityCompat.START)
        } else {
            super.onBackPressed()
        }
    }
}
