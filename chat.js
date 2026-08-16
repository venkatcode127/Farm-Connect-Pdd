// ===== FarmConnect AI - AI Chat Board =====

const AI_KNOWLEDGE_BASE = {
  greetings: [
    { patterns: ['hello', 'hi', 'hey', 'namaste', 'namaskar', 'नमस्ते'],
      responses: ['Namaste! 🙏 How can I help you today with your farming needs?', 'Hello! Welcome to FarmConnect AI. What would you like to know about?', 'Hi there! 👋 I\'m ready to assist you with market prices, crop advice, or any farming question!'] }
  ],
  prices: [
    { patterns: ['price', 'rate', 'cost', 'भाव', 'मूल्य', 'दाम', 'कीमत'],
      handler: 'handlePriceQuery' },
  ],
  crops: [
    { patterns: ['tomato', 'टमाटर', 'तक்காளி'], crop: 'tomato' },
    { patterns: ['rice', 'चावल', 'basmati', 'बासमती', 'धान'], crop: 'rice' },
    { patterns: ['wheat', 'गेहूँ', 'गेहूं', 'गोधुम'], crop: 'wheat' },
    { patterns: ['onion', 'प्याज', 'ఉల్లి'], crop: 'onion' },
    { patterns: ['potato', 'आलू', 'aloo'], crop: 'potato' },
    { patterns: ['cotton', 'कपास', 'पत्ती'], crop: 'cotton' },
    { patterns: ['sugarcane', 'गन्ना', 'चेरకు'], crop: 'sugarcane' },
    { patterns: ['soybean', 'सोयाबीन', 'soya'], crop: 'soybean' },
    { patterns: ['chilli', 'mirchi', 'मिर्च', 'chili', 'pepper'], crop: 'chilli' },
    { patterns: ['maize', 'मक्का', 'corn'], crop: 'maize' },
    { patterns: ['groundnut', 'मूंगफली', 'peanut'], crop: 'groundnut' },
    { patterns: ['mustard', 'सरसों', 'rai'], crop: 'mustard' }
  ],
  topics: {
    weather: {
      patterns: ['weather', 'rain', 'मौसम', 'बारिश', 'forecast', 'temperature', 'तापमान'],
      responses: [
        'Based on current conditions:\n\n🌡️ **Delhi**: 38°C, Sunny — Avoid fieldwork 11AM-3PM\n☁️ **Mumbai**: 33°C, Humid — Pre-monsoon showers expected\n🌤️ **Bangalore**: 28°C, Pleasant — Ideal for cultivation\n🔥 **Hyderabad**: 36°C, Hot — Use drip irrigation\n\n💡 **Tip**: Check the Weather section for detailed forecasts and crop advisories!'
      ]
    },
    sell: {
      patterns: ['sell', 'बेच', 'selling', 'when to sell', 'best time', 'कब बेचें'],
      responses: [
        'Here\'s my selling advice:\n\n📊 **Current Market Trends**:\n• 🍅 Tomato prices are **rising** — good time to sell!\n• 🧅 Onion prices are **stable** — hold if possible\n• 🌾 Rice is in **steady demand** — sell gradually\n\n💡 **Pro Tips**:\n1. Check the **Analytics** section for \"Best Time to Sell\"\n2. Compare prices across markets before selling\n3. List your produce on the **Marketplace** for direct buyer access\n4. Avoid selling during harvest peaks — prices tend to drop'
      ]
    },
    buy: {
      patterns: ['buy', 'खरीद', 'purchase', 'buying'],
      responses: [
        'Here\'s buying guidance:\n\n🛒 **How to Buy on FarmConnect**:\n1. Go to the **Marketplace** section\n2. Browse available listings\n3. Click **\"Order Now\"** on any listing\n4. Enter quantity and delivery address\n5. Track your order in **My Orders**\n\n💡 **Tips for Buyers**:\n• Compare prices across multiple sellers\n• Check seller ratings and descriptions\n• Verify quality details before ordering\n• Use UPI or bank transfer for safety'
      ]
    },
    order: {
      patterns: ['order', 'track', 'ऑर्डर', 'tracking', 'delivery', 'डिलीवरी', 'shipped'],
      responses: [
        'Here\'s how order tracking works:\n\n📦 **Order Status Flow**:\n1. 📋 **Order Placed** — Your order is submitted\n2. ✅ **Confirmed** — Seller has confirmed\n3. 🚛 **Shipped** — On the way!\n4. 🚚 **Out for Delivery** — Almost there!\n5. 📦 **Delivered** — Enjoy your produce!\n\n🔍 Go to **My Orders** to:\n• View all order details\n• Track real-time status\n• Cancel pending orders\n\nNeed help with a specific order? Tell me the order number!'
      ]
    },
    organic: {
      patterns: ['organic', 'जैविक', 'natural', 'pesticide', 'कीटनाशक'],
      responses: [
        '🌿 **Organic Farming Tips**:\n\n1. **Composting**: Use cow dung, neem cake, and kitchen waste\n2. **Pest Control**: Neem oil spray, garlic-chilli solution\n3. **Soil Health**: Practice crop rotation and green manuring\n4. **Certification**: Get organic certification from APEDA/Jaivik Bharat\n\n📈 **Market Advantage**: Organic produce sells at 30-50% premium!\n\n🏷️ Label your marketplace listings as \"Organic\" to attract premium buyers.'
      ]
    },
    scheme: {
      patterns: ['scheme', 'subsidy', 'government', 'सरकारी', 'योजना', 'pm kisan', 'msp'],
      responses: [
        '🏛️ **Key Government Schemes for Farmers**:\n\n1. **PM-KISAN**: ₹6,000/year direct benefit (Call: 155261)\n2. **PM Fasal Bima Yojana**: Crop insurance\n3. **Kisan Credit Card**: Easy agricultural loans\n4. **eNAM**: Online national market for trading\n5. **MSP**: Minimum Support Price guarantee\n\n📞 **Helpline**: Kisan Call Center — **1800-180-1551** (toll-free)\n\n🌐 Visit [farmer.gov.in](https://farmer.gov.in) for more details.'
      ]
    },
    loan: {
      patterns: ['loan', 'credit', 'ऋण', 'कर्ज', 'finance', 'bank'],
      responses: [
        '💰 **Agricultural Finance Options**:\n\n1. **Kisan Credit Card (KCC)**:\n   • Up to ₹3 lakh at 4% interest\n   • Apply at any nationalized bank\n\n2. **PM-KISAN**: ₹6,000/year direct transfer\n\n3. **NABARD Schemes**:\n   • Farm mechanization loans\n   • Warehouse construction loans\n\n4. **Mudra Loan**: For agri-business up to ₹10 lakh\n\n📝 Documents needed: Aadhaar, land records, bank passbook\n📞 Contact your nearest bank branch or call 1800-180-1551'
      ]
    }
  }
};

function initChat() {
  const fab = document.getElementById('aiChatFab');
  const panel = document.getElementById('aiChatPanel');
  const closeBtn = document.getElementById('aiChatClose');
  const input = document.getElementById('aiChatInput');
  const sendBtn = document.getElementById('aiChatSend');

  fab.onclick = () => {
    const isOpen = panel.style.display !== 'none';
    panel.style.display = isOpen ? 'none' : 'flex';
    fab.classList.toggle('fab-open', !isOpen);
    if (!isOpen) {
      setTimeout(() => input.focus(), 300);
    }
  };

  closeBtn.onclick = () => {
    panel.style.display = 'none';
    fab.classList.remove('fab-open');
  };

  sendBtn.onclick = () => sendMessage();
  input.onkeydown = e => { if (e.key === 'Enter') sendMessage(); };

  // Suggestion chips
  document.querySelectorAll('.ai-suggest-chip').forEach(chip => {
    chip.onclick = () => {
      input.value = chip.dataset.query;
      sendMessage();
    };
  });
}

function sendMessage() {
  const input = document.getElementById('aiChatInput');
  const text = input.value.trim();
  if (!text) return;

  addChatMessage(text, 'user');
  input.value = '';

  // Show typing indicator
  const typingId = showTypingIndicator();

  // Simulate AI response delay
  setTimeout(() => {
    removeTypingIndicator(typingId);
    const response = generateAIResponse(text);
    addChatMessage(response, 'bot');
  }, 800 + Math.random() * 1200);
}

function addChatMessage(text, type) {
  const container = document.getElementById('aiChatMessages');
  const msg = document.createElement('div');
  msg.className = `ai-msg ai-msg-${type}`;

  if (type === 'user') {
    msg.innerHTML = `
      <div class="ai-msg-bubble ai-msg-user-bubble">${escapeHtml(text)}</div>
      <div class="ai-msg-avatar">👤</div>
    `;
  } else {
    msg.innerHTML = `
      <div class="ai-msg-avatar">🤖</div>
      <div class="ai-msg-bubble">${formatBotMessage(text)}</div>
    `;
  }

  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;

  // Animate in
  msg.style.opacity = '0';
  msg.style.transform = 'translateY(10px)';
  requestAnimationFrame(() => {
    msg.style.transition = 'opacity 0.3s, transform 0.3s';
    msg.style.opacity = '1';
    msg.style.transform = 'translateY(0)';
  });
}

function showTypingIndicator() {
  const container = document.getElementById('aiChatMessages');
  const typing = document.createElement('div');
  typing.className = 'ai-msg ai-msg-bot ai-typing-indicator';
  typing.id = 'aiTyping_' + Date.now();
  typing.innerHTML = `
    <div class="ai-msg-avatar">🤖</div>
    <div class="ai-msg-bubble ai-typing-bubble">
      <div class="typing-dots">
        <span></span><span></span><span></span>
      </div>
    </div>
  `;
  container.appendChild(typing);
  container.scrollTop = container.scrollHeight;
  return typing.id;
}

function removeTypingIndicator(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

function generateAIResponse(query) {
  const q = query.toLowerCase();

  // Check greetings
  for (const g of AI_KNOWLEDGE_BASE.greetings) {
    if (g.patterns.some(p => q.includes(p))) {
      return g.responses[Math.floor(Math.random() * g.responses.length)];
    }
  }

  // Detect crop mention
  let detectedCrop = null;
  for (const c of AI_KNOWLEDGE_BASE.crops) {
    if (c.patterns.some(p => q.includes(p))) {
      detectedCrop = c.crop;
      break;
    }
  }

  // Check for price query
  const isPriceQuery = AI_KNOWLEDGE_BASE.prices[0].patterns.some(p => q.includes(p));
  if (isPriceQuery || (detectedCrop && (q.includes('how much') || q.includes('kitna') || q.includes('कितना')))) {
    return handlePriceQuery(detectedCrop);
  }

  // Check for sell query with crop
  if (detectedCrop && AI_KNOWLEDGE_BASE.topics.sell.patterns.some(p => q.includes(p))) {
    return handleSellAdvice(detectedCrop);
  }

  // Check topics
  for (const [key, topic] of Object.entries(AI_KNOWLEDGE_BASE.topics)) {
    if (topic.patterns.some(p => q.includes(p))) {
      return topic.responses[Math.floor(Math.random() * topic.responses.length)];
    }
  }

  // If crop detected but no specific topic, give general crop info
  if (detectedCrop) {
    return handleCropInfo(detectedCrop);
  }

  // Default fallback
  return getSmartFallback(query);
}

function handlePriceQuery(cropId) {
  if (!cropId) {
    // Generic price overview
    let response = '📊 **Current Market Prices** (Top commodities):\n\n';
    COMMODITIES.slice(0, 6).forEach(c => {
      const prices = PRICE_HISTORY[c.id].delhi;
      const cur = prices[prices.length - 1].price;
      const prev = prices[prices.length - 2].price;
      const chg = ((cur - prev) / prev * 100).toFixed(1);
      const arrow = chg >= 0 ? '📈' : '📉';
      response += `${c.emoji} **${c.name}**: ₹${cur.toLocaleString()}/Qt ${arrow} ${chg >= 0 ? '+' : ''}${chg}%\n`;
    });
    response += '\n💡 Visit the **Market Prices** section for detailed data across all markets!';
    return response;
  }

  const commodity = COMMODITIES.find(c => c.id === cropId);
  if (!commodity) return 'Sorry, I don\'t have data for that crop yet.';

  let response = `${commodity.emoji} **${commodity.name} Prices Today**:\n\n`;
  MARKETS.slice(0, 5).forEach(m => {
    const prices = PRICE_HISTORY[cropId][m.id];
    const cur = prices[prices.length - 1].price;
    const prev = prices[prices.length - 2].price;
    const chg = ((cur - prev) / prev * 100).toFixed(1);
    const arrow = chg >= 0 ? '▲' : '▼';
    response += `📍 **${m.name}**: ₹${cur.toLocaleString()}/Qt (${arrow}${Math.abs(chg)}%)\n`;
  });

  const delhiPrices = PRICE_HISTORY[cropId].delhi;
  const allP = delhiPrices.slice(-30).map(p => p.price);
  const avg = Math.round(allP.reduce((a, b) => a + b) / allP.length);
  response += `\n📈 **30-day avg (Delhi)**: ₹${avg.toLocaleString()}/Qt`;
  response += '\n\n💡 Use **AI Prediction** for 7-day price forecast!';
  return response;
}

function handleSellAdvice(cropId) {
  const commodity = COMMODITIES.find(c => c.id === cropId);
  if (!commodity) return AI_KNOWLEDGE_BASE.topics.sell.responses[0];

  const prices = PRICE_HISTORY[cropId].delhi;
  const cur = prices[prices.length - 1].price;
  const recent = prices.slice(-7).map(p => p.price);
  const avg7 = Math.round(recent.reduce((a, b) => a + b) / recent.length);
  const trend = cur > avg7 ? 'rising' : cur < avg7 ? 'falling' : 'stable';

  const bestMonth = commodity.seasonal.indexOf(Math.max(...commodity.seasonal));
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  let advice;
  if (trend === 'rising') {
    advice = `📈 **Prices are RISING** — Consider holding for a few more days for better returns!`;
  } else if (trend === 'falling') {
    advice = `📉 **Prices are FALLING** — Consider selling soon before further drop!`;
  } else {
    advice = `➡️ **Prices are STABLE** — Good time to sell if you have storage costs.`;
  }

  return `${commodity.emoji} **${commodity.name} Selling Advice**:\n\n` +
    `Current Price: **₹${cur.toLocaleString()}/Qt**\n7-day avg: **₹${avg7.toLocaleString()}/Qt**\n\n` +
    `${advice}\n\n` +
    `📅 **Best month to sell**: ${months[bestMonth]} (historically highest prices)\n\n` +
    `💡 List on the **Marketplace** to reach buyers directly!`;
}

function handleCropInfo(cropId) {
  const commodity = COMMODITIES.find(c => c.id === cropId);
  if (!commodity) return 'I don\'t have detailed information for that crop yet.';

  const prices = PRICE_HISTORY[cropId].delhi;
  const cur = prices[prices.length - 1].price;

  return `${commodity.emoji} **${commodity.name} Overview**:\n\n` +
    `📊 **Current Price**: ₹${cur.toLocaleString()}/Qt (Delhi)\n` +
    `📦 **Category**: ${commodity.category}\n` +
    `📏 **Unit**: ${commodity.unit}\n\n` +
    `I can tell you more about:\n• 💰 Current prices across markets\n• 📈 Price trends & predictions\n• 🕐 Best time to sell\n\nJust ask!`;
}

function getSmartFallback(query) {
  const fallbacks = [
    'I\'m not sure about that, but I can help you with:\n\n📊 **Market prices** — Ask about any crop price\n🌾 **Crop advice** — Growing tips and best practices\n🌤️ **Weather** — Forecasts and crop advisories\n💰 **Selling guidance** — When and where to sell\n📦 **Orders** — Track your marketplace orders\n🏛️ **Government schemes** — PM-KISAN, MSP, subsidies\n\nTry asking something like:\n• "What\'s the tomato price today?"\n• "When should I sell wheat?"\n• "Tell me about government schemes"',
    'I appreciate your question! While I\'m focused on agricultural topics, here are some things I can help with:\n\n🌾 Crop prices & predictions\n🛒 Marketplace guidance\n📦 Order tracking\n🌤️ Weather advisories\n💰 Financial schemes\n\nCould you rephrase your question related to these topics?'
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

function formatBotMessage(text) {
  // Convert markdown-style formatting to HTML
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>')
    .replace(/• /g, '&bull; ')
    .replace(/^\d+\.\s/gm, match => `<span class="ai-list-num">${match}</span>`);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', initChat);
