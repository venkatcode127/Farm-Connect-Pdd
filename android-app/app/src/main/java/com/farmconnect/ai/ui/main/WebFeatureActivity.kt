package com.farmconnect.ai.ui.main

import android.os.Bundle
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class WebFeatureActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        val webView = WebView(this)
        webView.settings.javaScriptEnabled = true
        webView.webViewClient = WebViewClient()
        setContentView(webView)

        val targetUrl = intent.getStringExtra("TARGET_URL") ?: "http://10.0.2.2:3000"
        webView.loadUrl(targetUrl)
    }
}
