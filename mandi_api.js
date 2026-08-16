// ===== FarmConnect AI - Real-time Mandi API Integration =====

const MANDI_API_KEY = '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b';
const MANDI_API_URL = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${MANDI_API_KEY}&format=json`;

async function fetchRealTimeMandiData(limit = 1000) {
    try {
        console.log("Fetching real-time Indian market data...");
        const response = await fetch(`${MANDI_API_URL}&limit=${limit}`);
        const data = await response.json();
        
        if (data.status === 'ok' && data.records) {
            console.log(`Successfully fetched ${data.records.length} market records.`);
            return data.records;
        } else {
            console.error("API error or no records found:", data.message);
            return null;
        }
    } catch (error) {
        console.error("Error fetching Mandi data:", error);
        return null;
    }
}

// Function to sync API data with our app's data structures
async function syncMarketData() {
    const records = await fetchRealTimeMandiData();
    if (!records) return;

    // Clear or update existing BASE_PRICES
    // We will update the global BASE_PRICES object from data.js
    
    records.forEach(record => {
        const commodityId = mapCommodityToId(record.commodity);
        const marketId = mapMarketToId(record.market, record.state);
        
        if (commodityId && marketId) {
            if (!BASE_PRICES[commodityId]) BASE_PRICES[commodityId] = {};
            BASE_PRICES[commodityId][marketId] = parseFloat(record.modal_price);
            
            // Also update PRICE_HISTORY to make it consistent with the new base price
            // We'll regenerate a bit of history to avoid a massive spike/drop
            updateHistoryForCommodity(commodityId, marketId, parseFloat(record.modal_price));
        }
    });

    console.log("Data sync complete. Real-time prices applied.");
    
    // Refresh UI components that depend on this data
    if (typeof showToast === 'function') showToast('📊 Real-time Market Data Synced!');
    if (typeof initDashboard === 'function') initDashboard();
    if (typeof renderMarketTable === 'function') renderMarketTable();
    if (typeof renderVolatility === 'function') renderVolatility();
}

function mapCommodityToId(apiName) {
    const name = apiName.toLowerCase();
    if (name.includes('rice') || name.includes('paddy')) return 'rice';
    if (name.includes('wheat')) return 'wheat';
    if (name.includes('tomato')) return 'tomato';
    if (name.includes('onion')) return 'onion';
    if (name.includes('potato')) return 'potato';
    if (name.includes('cotton')) return 'cotton';
    if (name.includes('sugarcane')) return 'sugarcane';
    if (name.includes('soybean')) return 'soybean';
    if (name.includes('mustard')) return 'mustard';
    if (name.includes('chilli')) return 'chilli';
    if (name.includes('maize')) return 'maize';
    if (name.includes('groundnut')) return 'groundnut';
    return null;
}

function mapMarketToId(marketName, stateName) {
    const market = marketName.toLowerCase();
    const state = stateName.toLowerCase();

    if (state.includes('delhi')) return 'delhi';
    if (state.includes('maharashtra') && (market.includes('mumbai') || market.includes('vashi'))) return 'mumbai';
    if (state.includes('karnataka') && (market.includes('bangalore') || market.includes('bengaluru'))) return 'bangalore';
    if (state.includes('telangana') && market.includes('hyderabad')) return 'hyderabad';
    if (state.includes('tamil nadu') && market.includes('chennai')) return 'chennai';
    if (state.includes('uttar pradesh') && market.includes('lucknow')) return 'lucknow';
    if (state.includes('rajasthan') && market.includes('jaipur')) return 'jaipur';
    if (state.includes('west bengal') && market.includes('kolkata')) return 'kolkata';
    if (state.includes('andhra pradesh') && market.includes('guntur')) return 'guntur';
    if (state.includes('telangana') && market.includes('warangal')) return 'warangal';
    
    return null;
}

function updateHistoryForCommodity(commodityId, marketId, newPrice) {
    if (!PRICE_HISTORY[commodityId] || !PRICE_HISTORY[commodityId][marketId]) return;
    
    const history = PRICE_HISTORY[commodityId][marketId];
    const lastPrice = history[history.length - 1].price;
    const diff = newPrice - lastPrice;
    
    // Smoothly adjust the last 30 days of history to lead up to the new price
    // This makes the "real time" transition look natural in charts
    for (let i = 0; i < history.length; i++) {
        const factor = i / (history.length - 1);
        history[i].price = Math.round(history[i].price + (diff * factor));
    }
}
