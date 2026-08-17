// ===== FarmConnect AI - Data Layer =====

export const COMMODITIES = [
  { id: 'rice', name: 'Rice (Basmati)', nameHi: 'चावल (बासमती)', nameTe: 'బియ్యం (బాస్మతి)', nameTa: 'அரிசி (பாஸ்மதி)', nameKn: 'ಅಕ್ಕಿ (ಬಾಸ್ಮತಿ)', emoji: '🌾', unit: 'Quintal', category: 'Grain', seasonal: [1.02,1.01,0.98,0.96,0.95,0.97,1.0,1.02,1.04,1.05,1.03,1.02] },
  { id: 'wheat', name: 'Wheat', nameHi: 'गेहूँ', nameTe: 'గోధుమ', nameTa: 'கோதுமை', nameKn: 'ಗೋಧಿ', emoji: '🌿', unit: 'Quintal', category: 'Grain', seasonal: [0.97,0.96,0.95,0.98,1.02,1.04,1.05,1.03,1.01,0.99,0.98,0.97] },
  { id: 'tomato', name: 'Tomato', nameHi: 'टमाटर', nameTe: 'టమాటో', nameTa: 'தக்காளி', nameKn: 'ಟೊಮೆಟೊ', emoji: '🍅', unit: 'Quintal', category: 'Vegetable', seasonal: [0.85,0.80,0.90,1.05,1.15,1.25,1.30,1.20,1.05,0.90,0.85,0.82] },
  { id: 'onion', name: 'Onion', nameHi: 'प्याज', nameTe: 'ఉల్లిపాయ', nameTa: 'வெங்காயம்', nameKn: 'ಈರುಳ್ಳಿ', emoji: '🧅', unit: 'Quintal', category: 'Vegetable', seasonal: [1.10,1.05,0.95,0.90,0.88,0.92,0.98,1.05,1.12,1.18,1.15,1.12] },
  { id: 'potato', name: 'Potato', nameHi: 'आलू', nameTe: 'బంగాళాదుంప', nameTa: 'உருளைக்கிழங்கு', nameKn: 'ಆಲೂಗಡ್ಡೆ', emoji: '🥔', unit: 'Quintal', category: 'Vegetable', seasonal: [0.90,0.88,0.92,0.98,1.05,1.10,1.12,1.08,1.02,0.95,0.92,0.90] },
  { id: 'cotton', name: 'Cotton', nameHi: 'कपास', nameTe: 'పత్తి', nameTa: 'பருத்தி', nameKn: 'ಹತ್ತಿ', emoji: '☁️', unit: 'Quintal', category: 'Cash Crop', seasonal: [0.98,0.97,0.96,0.95,0.97,1.0,1.02,1.04,1.06,1.05,1.02,1.0] },
  { id: 'sugarcane', name: 'Sugarcane', nameHi: 'गन्ना', nameTe: 'చెరకు', nameTa: 'கரும்பு', nameKn: 'ಕಬ್ಬು', emoji: '🎋', unit: 'Quintal', category: 'Cash Crop', seasonal: [1.0,1.0,0.99,0.98,0.97,0.98,1.0,1.01,1.02,1.03,1.02,1.01] },
  { id: 'soybean', name: 'Soybean', nameHi: 'सोयाबीन', nameTe: 'సోయాబీన్', nameTa: 'சோயாபீன்', nameKn: 'ಸೋಯಾಬೀನ್', emoji: '🫘', unit: 'Quintal', category: 'Oilseed', seasonal: [0.95,0.93,0.92,0.94,0.98,1.02,1.06,1.08,1.10,1.06,1.0,0.97] },
  { id: 'mustard', name: 'Mustard', nameHi: 'सरसों', nameTe: 'ఆవాలు', nameTa: 'கடுகு', nameKn: 'ಸಾಸಿವೆ', emoji: '🌼', unit: 'Quintal', category: 'Oilseed', seasonal: [0.96,0.94,0.98,1.02,1.06,1.08,1.05,1.02,0.99,0.97,0.95,0.96] },
  { id: 'chilli', name: 'Red Chilli', nameHi: 'लाल मिर्च', nameTe: 'ఎర్ర మిర్చి', nameTa: 'சிவப்பு மிளகாய்', nameKn: 'ಕೆಂಪು ಮೆಣಸಿನಕಾಯಿ', emoji: '🌶️', unit: 'Quintal', category: 'Spice', seasonal: [1.05,1.02,0.98,0.95,0.93,0.96,1.0,1.04,1.08,1.10,1.08,1.06] },
  { id: 'maize', name: 'Maize', nameHi: 'मक्का', nameTe: 'మొక్కజొన్న', nameTa: 'மக்காச்சோளம்', nameKn: 'ಮೆಕ್ಕೆಜೋಳ', emoji: '🌽', unit: 'Quintal', category: 'Grain', seasonal: [0.98,0.96,0.95,0.97,1.0,1.03,1.05,1.04,1.02,1.0,0.98,0.97] },
  { id: 'groundnut', name: 'Groundnut', nameHi: 'मूंगफली', nameTe: 'వేరుశెనగ', nameTa: 'நிலக்கடலை', nameKn: 'ಕಡಲೆಕಾಯಿ', emoji: '🥜', unit: 'Quintal', category: 'Oilseed', seasonal: [0.97,0.95,0.94,0.96,0.99,1.02,1.05,1.07,1.06,1.03,1.0,0.98] }
];

export const MARKETS = [
  { id: 'delhi', name: 'Azadpur, Delhi', nameHi: 'आज़ादपुर, दिल्ली', nameTe: 'ఆజాద్‌పూర్, ఢిల్లీ', nameTa: 'ஆசாத்பூர், டெல்லி', nameKn: 'ಆಜಾದ್‌ಪುರ, ದೆಹಲಿ', state: 'Delhi', stateHi: 'दिल्ली' },
  { id: 'mumbai', name: 'Vashi, Mumbai', nameHi: 'वाशी, मुंबई', nameTe: 'వాషి, ముంబై', nameTa: 'வாஷி, மும்பை', nameKn: 'ವಾಷಿ, ಮುಂಬೈ', state: 'Maharashtra', stateHi: 'महाराष्ट्र' },
  { id: 'bangalore', name: 'Yeshwanthpur, Bangalore', nameHi: 'येशवंतपुर, बैंगलोर', nameTe: 'యశవంతపుర, బెంగళూరు', nameTa: 'யெஷ்வந்தபூர், பெங்களூரு', nameKn: 'ಯಶವಂತಪುರ, ಬೆಂಗಳೂರು', state: 'Karnataka', stateHi: 'कर्नाटक' },
  { id: 'hyderabad', name: 'Bowenpally, Hyderabad', nameHi: 'बोवेनपल्ली, हैदराबाद', nameTe: 'బోవెన్‌పల్లి, హైదరాబాద్', nameTa: 'போவன்பள்ளி, ஹைதராபாத்', nameKn: 'ಬೋವೆನ್‌ಪಲ್ಲಿ, ಹೈದರಾಬಾದ್', state: 'Telangana', stateHi: 'तेलंगाना' },
  { id: 'chennai', name: 'Koyambedu, Chennai', nameHi: 'कोयम्बेडू, चेन्नई', nameTe: 'కోయంబేడు, చెన్నై', nameTa: 'கோயம்பேடு, சென்னை', nameKn: 'ಕೋಯಂಬೇಡು, ಚೆನ್ನೈ', state: 'Tamil Nadu', stateHi: 'तमिल नाडु' },
  { id: 'lucknow', name: 'Alambagh, Lucknow', nameHi: 'आलमबाग, लखनऊ', nameTe: 'ఆలంబాగ్, లక్నో', nameTa: 'ஆலம்பாக், லக்னோ', nameKn: 'ಆಲಂಬಾಗ್, ಲಕ್ನೋ', state: 'Uttar Pradesh', stateHi: 'उत्तर प्रदेश' },
  { id: 'jaipur', name: 'Muhana, Jaipur', nameHi: 'मुहाना, जयपुर', nameTe: 'ముహానా, జైపూర్', nameTa: 'முஹானா, ஜெய்பூர்', nameKn: 'ಮುಹಾನಾ, ಜೈಪುರ', state: 'Rajasthan', stateHi: 'राजस्थान' },
  { id: 'kolkata', name: 'Posta, Kolkata', nameHi: 'पोस्ता, कोलकाता', nameTe: 'పోస్తా, కోల్‌కతా', nameTa: 'போஸ்தா, கொல்கத்தா', nameKn: 'ಪೋಸ್ತಾ, ಕೋಲ್ಕತಾ', state: 'West Bengal', stateHi: 'पश्चिम बंगाल' },
  { id: 'guntur', name: 'Guntur, Andhra Pradesh', nameHi: 'गुंटूर, आंध्र प्रदेश', nameTe: 'గుంటూరు, ఆంధ్రప్రదేశ్', nameTa: 'குண்டூர், ஆந்திரப் பிரதேசம்', nameKn: 'ಗುಂಟೂರು, ಆಂಧ್ರಪ್ರದೇಶ', state: 'Andhra Pradesh', stateHi: 'आंध्र प्रदेश' },
  { id: 'warangal', name: 'Warangal, Telangana', nameHi: 'वारंगल, तेलंगाना', nameTe: 'వరంగల్, తెలంగాణ', nameTa: 'வாரங்கல், தெலங்கானா', nameKn: 'ವಾರಂಗಲ್, ತೆಲಂಗಾಣ', state: 'Telangana', stateHi: 'तेलंगाना' }
];

const BASE_PRICES = {
  rice:       { delhi: 3850, mumbai: 3920, bangalore: 4050, hyderabad: 3780, chennai: 4100, lucknow: 3700, jaipur: 3680, kolkata: 3800, guntur: 3820, warangal: 3750 },
  wheat:      { delhi: 2450, mumbai: 2520, bangalore: 2600, hyderabad: 2480, chennai: 2650, lucknow: 2380, jaipur: 2400, kolkata: 2460, guntur: 2500, warangal: 2470 },
  tomato:     { delhi: 2800, mumbai: 3200, bangalore: 2400, hyderabad: 2600, chennai: 2900, lucknow: 2500, jaipur: 2700, kolkata: 3100, guntur: 2550, warangal: 2650 },
  onion:      { delhi: 1800, mumbai: 1950, bangalore: 2100, hyderabad: 1850, chennai: 2200, lucknow: 1700, jaipur: 1650, kolkata: 1900, guntur: 1820, warangal: 1880 },
  potato:     { delhi: 1200, mumbai: 1350, bangalore: 1500, hyderabad: 1280, chennai: 1450, lucknow: 1100, jaipur: 1150, kolkata: 1180, guntur: 1300, warangal: 1260 },
  cotton:     { delhi: 6200, mumbai: 6350, bangalore: 6100, hyderabad: 6280, chennai: 6150, lucknow: 6050, jaipur: 6180, kolkata: 6100, guntur: 6320, warangal: 6250 },
  sugarcane:  { delhi: 350, mumbai: 360, bangalore: 370, hyderabad: 355, chennai: 365, lucknow: 340, jaipur: 345, kolkata: 350, guntur: 358, warangal: 352 },
  soybean:    { delhi: 4200, mumbai: 4350, bangalore: 4100, hyderabad: 4250, chennai: 4150, lucknow: 4050, jaipur: 4180, kolkata: 4120, guntur: 4200, warangal: 4180 },
  mustard:    { delhi: 5100, mumbai: 5250, bangalore: 5050, hyderabad: 5150, chennai: 5080, lucknow: 4950, jaipur: 5200, kolkata: 5050, guntur: 5120, warangal: 5100 },
  chilli:     { delhi: 8500, mumbai: 8800, bangalore: 8200, hyderabad: 8600, chennai: 8400, lucknow: 8100, jaipur: 8300, kolkata: 8450, guntur: 8900, warangal: 8650 },
  maize:      { delhi: 1950, mumbai: 2050, bangalore: 2100, hyderabad: 1980, chennai: 2080, lucknow: 1880, jaipur: 1900, kolkata: 1920, guntur: 2000, warangal: 1960 },
  groundnut:  { delhi: 5400, mumbai: 5550, bangalore: 5300, hyderabad: 5450, chennai: 5350, lucknow: 5200, jaipur: 5380, kolkata: 5280, guntur: 5480, warangal: 5400 }
};

// Generate realistic 90-day price history using random walk with seasonal adjustment
function generatePriceHistory() {
  const history = {};
  const today = new Date();
  COMMODITIES.forEach(c => {
    history[c.id] = {};
    MARKETS.forEach(m => {
      const base = BASE_PRICES[c.id][m.id];
      const prices = [];
      let price = base * (0.92 + Math.random() * 0.08);
      for (let i = 89; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const month = date.getMonth();
        const seasonalFactor = c.seasonal[month];
        const dailyChange = (Math.random() - 0.48) * base * 0.025;
        price = price * 0.97 + (base * seasonalFactor) * 0.03 + dailyChange;
        price = Math.max(base * 0.7, Math.min(base * 1.4, price));
        prices.push({ date: date.toISOString().split('T')[0], price: Math.round(price) });
      }
      history[c.id][m.id] = prices;
    });
  });
  return history;
}

export const PRICE_HISTORY = generatePriceHistory();

export const WEATHER_DATA = {
  delhi:     { temp: 38, high: 42, low: 28, humidity: 35, wind: 14, condition: 'Sunny', conditionHi: 'धूप', icon: '☀️', rainfall: 2, soil_moisture: 30 },
  mumbai:    { temp: 33, high: 35, low: 27, humidity: 78, wind: 18, condition: 'Humid', conditionHi: 'उमस', icon: '🌤️', rainfall: 45, soil_moisture: 65 },
  bangalore: { temp: 28, high: 32, low: 22, humidity: 55, wind: 10, condition: 'Pleasant', conditionHi: 'सुहावना', icon: '⛅', rainfall: 25, soil_moisture: 50 },
  hyderabad: { temp: 36, high: 40, low: 26, humidity: 40, wind: 12, condition: 'Hot', conditionHi: 'गर्म', icon: '🌞', rainfall: 8, soil_moisture: 35 },
  chennai:   { temp: 35, high: 38, low: 28, humidity: 72, wind: 16, condition: 'Warm & Humid', conditionHi: 'गर्म और उमस', icon: '🌤️', rainfall: 15, soil_moisture: 45 },
  lucknow:   { temp: 40, high: 44, low: 29, humidity: 30, wind: 8, condition: 'Very Hot', conditionHi: 'बहुत गर्म', icon: '🔥', rainfall: 0, soil_moisture: 22 },
  jaipur:    { temp: 41, high: 45, low: 28, humidity: 20, wind: 15, condition: 'Dry & Hot', conditionHi: 'शुष्क और गर्म', icon: '☀️', rainfall: 0, soil_moisture: 18 },
  kolkata:   { temp: 34, high: 37, low: 27, humidity: 80, wind: 12, condition: 'Humid', conditionHi: 'उमस', icon: '🌥️', rainfall: 35, soil_moisture: 60 },
  guntur:    { temp: 37, high: 41, low: 27, humidity: 45, wind: 11, condition: 'Hot & Dry', conditionHi: 'गर्म और शुष्क', icon: '🌞', rainfall: 5, soil_moisture: 28 },
  warangal:  { temp: 35, high: 39, low: 25, humidity: 42, wind: 10, condition: 'Hot', conditionHi: 'गर्म', icon: '☀️', rainfall: 10, soil_moisture: 32 }
};

export const CROP_ADVISORIES = {
  delhi: [
    { icon: '🌾', text: 'Irrigate wheat fields in early morning to avoid evaporation', textHi: 'वाष्पीकरण से बचने के लिए सुबह जल्दी गेहूँ के खेतों में सिंचाई करें' },
    { icon: '🍅', text: 'Apply mulch to tomato beds to retain moisture', textHi: 'नमी बनाए रखने के लिए टमाटर की क्यारियों में मल्चिंग करें' },
    { icon: '⚠️', text: 'Heat wave advisory: Provide shade to young saplings', textHi: 'लू चेतावनी: छोटे पौधों को छाया दें' }
  ],
  mumbai: [
    { icon: '🌧️', text: 'Pre-monsoon showers expected — prepare drainage channels', textHi: 'पूर्व-मानसून बारिश की उम्मीद — जल निकासी चैनल तैयार करें' },
    { icon: '🫘', text: 'Good time to prepare fields for kharif sowing', textHi: 'खरीफ बुवाई के लिए खेत तैयार करने का अच्छा समय' },
    { icon: '🐛', text: 'Watch for pest activity due to high humidity', textHi: 'उच्च आर्द्रता के कारण कीट गतिविधि पर नज़र रखें' }
  ],
  bangalore: [
    { icon: '☕', text: 'Ideal conditions for coffee and pepper cultivation', textHi: 'कॉफी और काली मिर्च की खेती के लिए आदर्श स्थिति' },
    { icon: '🥬', text: 'Excellent weather for leafy vegetable cultivation', textHi: 'पत्तेदार सब्जियों की खेती के लिए उत्कृष्ट मौसम' },
    { icon: '💧', text: 'Moderate irrigation recommended for ragi fields', textHi: 'रागी के खेतों के लिए मध्यम सिंचाई की सिफारिश' }
  ],
  hyderabad: [
    { icon: '🌶️', text: 'Optimal time for chilli harvesting in Guntur belt', textHi: 'गुंटूर बेल्ट में मिर्च की कटाई का सर्वोत्तम समय' },
    { icon: '☁️', text: 'Cotton sowing can begin with first monsoon showers', textHi: 'पहली मानसून बारिश के साथ कपास की बुवाई शुरू की जा सकती है' },
    { icon: '💧', text: 'Drip irrigation advised to conserve water', textHi: 'पानी बचाने के लिए ड्रिप सिंचाई की सलाह' }
  ],
  chennai: [
    { icon: '🌾', text: 'Paddy transplanting recommended in delta regions', textHi: 'डेल्टा क्षेत्रों में धान रोपाई की सिफारिश' },
    { icon: '🥥', text: 'Apply fertilizer to coconut palms this month', textHi: 'इस महीने नारियल के पेड़ों में खाद डालें' },
    { icon: '🌊', text: 'Coastal salinity risk — check soil pH before sowing', textHi: 'तटीय लवणता जोखिम — बुवाई से पहले मिट्टी का pH जांचें' }
  ],
  lucknow: [
    { icon: '🥭', text: 'Mango orchards need extra watering in this heat', textHi: 'इस गर्मी में आम के बागों को अतिरिक्त पानी की आवश्यकता' },
    { icon: '🌾', text: 'Prepare for sugarcane ratoon management', textHi: 'गन्ने के पेड़ी प्रबंधन की तैयारी करें' },
    { icon: '🔥', text: 'Extreme heat: Avoid fieldwork between 11AM-3PM', textHi: 'अत्यधिक गर्मी: 11AM-3PM के बीच खेत का काम न करें' }
  ],
  jaipur: [
    { icon: '🌼', text: 'Mustard harvesting season — dry crops thoroughly before storage', textHi: 'सरसों की कटाई का मौसम — भंडारण से पहले फसलों को अच्छी तरह सुखाएं' },
    { icon: '🐫', text: 'Desert conditions: Use sand mulching for water conservation', textHi: 'रेगिस्तानी स्थिति: जल संरक्षण के लिए रेत मल्चिंग का उपयोग करें' },
    { icon: '🌿', text: 'Consider drought-resistant varieties for next sowing', textHi: 'अगली बुवाई के लिए सूखा प्रतिरोधी किस्मों पर विचार करें' }
  ],
  kolkata: [
    { icon: '🌾', text: 'Boro rice harvest underway — ensure proper drying', textHi: 'बोरो धान की कटाई जारी — उचित सुखाने को सुनिश्चित करें' },
    { icon: '🐟', text: 'Fish-rice integrated farming recommended', textHi: 'मछली-चावल एकीकृत खेती की सिफारिश' },
    { icon: '🌧️', text: 'Early monsoon possible — keep harvested grain covered', textHi: 'जल्दी मानसून संभव — कटी हुई फसल को ढककर रखें' }
  ],
  guntur: [
    { icon: '🌶️', text: 'Guntur chilli harvest peak — grade and dry thoroughly', textHi: 'गुंटूर मिर्च कटाई चरम — ग्रेड करें और अच्छी तरह सुखाएं' },
    { icon: '☁️', text: 'Cotton crop needs pest monitoring in AP region', textHi: 'AP क्षेत्र में कपास फसल को कीट निगरानी की जरूरत' },
    { icon: '🌾', text: 'Paddy fields: maintain 2-3cm water level', textHi: 'धान के खेत: 2-3 सेमी जल स्तर बनाए रखें' }
  ],
  warangal: [
    { icon: '🌾', text: 'Rice transplanting season — prepare nursery beds', textHi: 'चावल रोपाई का मौसम — नर्सरी बेड तैयार करें' },
    { icon: '☁️', text: 'Cotton sowing recommended in black soil areas', textHi: 'काली मिट्टी क्षेत्रों में कपास बुवाई की सिफारिश' },
    { icon: '💧', text: 'Check borewell levels before summer irrigation', textHi: 'गर्मी की सिंचाई से पहले बोरवेल स्तर जांचें' }
  ]
};

export const SAMPLE_LISTINGS = [
  { id: 1, crop: 'rice', emoji: '🌾', name: 'Premium Basmati Rice', nameHi: 'प्रीमियम बासमती चावल', qty: 50, price: 3900, location: 'Karnal, Haryana', locationHi: 'करनाल, हरियाणा', contact: '+91 98XXX XXXXX', desc: 'Grade A Pusa 1121, freshly harvested', descHi: 'ग्रेड A पूसा 1121, ताज़ी कटाई', seller: 'Rajesh Kumar' },
  { id: 2, crop: 'tomato', emoji: '🍅', name: 'Fresh Farm Tomatoes', nameHi: 'ताज़े खेत के टमाटर', qty: 20, price: 2600, location: 'Kolar, Karnataka', locationHi: 'कोलार, कर्नाटक', contact: '+91 87XXX XXXXX', desc: 'Organic, no pesticides used', descHi: 'जैविक, कोई कीटनाशक नहीं', seller: 'Anjali Devi' },
  { id: 3, crop: 'onion', emoji: '🧅', name: 'Red Onion (Nashik)', nameHi: 'लाल प्याज (नासिक)', qty: 100, price: 1850, location: 'Nashik, Maharashtra', locationHi: 'नासिक, महाराष्ट्र', contact: '+91 92XXX XXXXX', desc: 'Export quality, 45-55mm size', descHi: 'निर्यात गुणवत्ता, 45-55mm आकार', seller: 'Sunil Patil' },
  { id: 4, crop: 'wheat', emoji: '🌿', name: 'Sharbati Wheat', nameHi: 'शरबती गेहूँ', qty: 200, price: 2550, location: 'Sehore, MP', locationHi: 'सीहोर, मध्य प्रदेश', contact: '+91 76XXX XXXXX', desc: 'MP Sharbati, high protein content', descHi: 'MP शरबती, उच्च प्रोटीन', seller: 'Hari Singh' },
  { id: 5, crop: 'cotton', emoji: '☁️', name: 'Raw Cotton Bales', nameHi: 'कच्ची कपास की गांठें', qty: 30, price: 6300, location: 'Guntur, AP', locationHi: 'गुंटूर, आंध्र प्रदेश', contact: '+91 95XXX XXXXX', desc: 'Long staple, 28mm+', descHi: 'लंबा रेशा, 28mm+', seller: 'Venkat Rao' },
  { id: 6, crop: 'potato', emoji: '🥔', name: 'Cold Storage Potatoes', nameHi: 'कोल्ड स्टोरेज आलू', qty: 150, price: 1180, location: 'Agra, UP', locationHi: 'आगरा, उत्तर प्रदेश', contact: '+91 88XXX XXXXX', desc: 'Pukhraj variety, sorted and graded', descHi: 'पुखराज किस्म, छंटा और ग्रेडेड', seller: 'Mohan Lal' },
  { id: 7, crop: 'chilli', emoji: '🌶️', name: 'Dried Red Chilli', nameHi: 'सूखी लाल मिर्च', qty: 15, price: 8700, location: 'Warangal, Telangana', locationHi: 'वारंगल, तेलंगाना', contact: '+91 93XXX XXXXX', desc: 'Teja S17 variety, high pungency', descHi: 'तेजा S17 किस्म, तीखापन अधिक', seller: 'Lakshmi Bai' },
  { id: 8, crop: 'soybean', emoji: '🫘', name: 'Soybean (JS-9560)', nameHi: 'सोयाबीन (JS-9560)', qty: 80, price: 4280, location: 'Indore, MP', locationHi: 'इंदौर, मध्य प्रदेश', contact: '+91 81XXX XXXXX', desc: 'Clean, moisture <10%', descHi: 'साफ, नमी <10%', seller: 'Dinesh Joshi' }
];

// Activity feed data
const ACTIVITIES = [
  { color: 'var(--green)', text: 'Tomato prices surged 12% in Delhi', textHi: 'दिल्ली में टमाटर के दाम 12% बढ़े', textTe: 'ఢిల్లీలో టమాటా ధరలు 12% పెరిగాయి', textTa: 'டெல்லியில் தக்காளி விலை 12% உயர்ந்தது', textKn: 'ದೆಹಲಿಯಲ್ಲಿ ಟೊಮೆಟೊ ಬೆಲೆ 12% ಏರಿಕೆ', time: '2 min ago', timeHi: '2 मिनट पहले', timeTe: '2 నిమిషాల క్రితం', timeTa: '2 நிமிடங்களுக்கு முன்', timeKn: '2 ನಿಮಿಷಗಳ ಹಿಂದೆ' },
  { color: 'var(--red)', text: 'Onion prices dropped 5% in Mumbai', textHi: 'मुंबई में प्याज के भाव 5% गिरे', textTe: 'ముంబైలో ఉల్లి ధరలు 5% తగ్గాయి', textTa: 'மும்பையில் வெங்காய விலை 5% குறைந்தது', textKn: 'ಮುಂಬೈನಲ್ಲಿ ಈರುಳ್ಳಿ ಬೆಲೆ 5% ಇಳಿಕೆ', time: '15 min ago', timeHi: '15 मिनट पहले', timeTe: '15 నిమిషాల క్రితం', timeTa: '15 நிமிடங்களுக்கு முன்', timeKn: '15 ನಿಮಿಷಗಳ ಹಿಂದೆ' },
  { color: 'var(--blue)', text: 'New listing: 200qt Wheat from MP', textHi: 'नई लिस्टिंग: 200क्विं गेहूँ, MP', textTe: 'కొత్త జాబితా: 200క్వి గోధుమ, MP', textTa: 'புதிய பட்டியல்: 200குவி கோதுமை, MP', textKn: 'ಹೊಸ ಪಟ್ಟಿ: 200ಕ್ವಿ ಗೋಧಿ, MP', time: '32 min ago', timeHi: '32 मिनट पहले', timeTe: '32 నిమిషాల క్రితం', timeTa: '32 நிமிடங்களுக்கு முன்', timeKn: '32 ನಿಮಿಷಗಳ ಹಿಂದೆ' },
  { color: 'var(--amber)', text: 'Heat wave alert for North India', textHi: 'उत्तर भारत के लिए लू चेतावनी', textTe: 'ఉత్తర భారతదేశంలో వేడి గాలుల హెచ్చరిక', textTa: 'வட இந்தியாவில் வெப்ப அலை எச்சரிக்கை', textKn: 'ಉತ್ತರ ಭಾರತಕ್ಕೆ ಶಾಖ ಅಲೆ ಎಚ್ಚರಿಕೆ', time: '1 hr ago', timeHi: '1 घंटा पहले', timeTe: '1 గంట క్రితం', timeTa: '1 மணி நேரத்திற்கு முன்', timeKn: '1 ಗಂಟೆ ಹಿಂದೆ' },
  { color: 'var(--green)', text: 'Cotton prices rising in Gujarat', textHi: 'गुजरात में कपास के भाव बढ़ रहे', textTe: 'గుజరాత్‌లో పత్తి ధరలు పెరుగుతున్నాయి', textTa: 'குஜராத்தில் பருத்தி விலை உயர்கிறது', textKn: 'ಗುಜರಾತ್‌ನಲ್ಲಿ ಹತ್ತಿ ಬೆಲೆ ಏರಿಕೆ', time: '2 hr ago', timeHi: '2 घंटे पहले', timeTe: '2 గంటల క్రితం', timeTa: '2 மணி நேரத்திற்கு முன்', timeKn: '2 ಗಂಟೆಗಳ ಹಿಂದೆ' },
  { color: 'var(--purple)', text: 'Soybean MSP update announced', textHi: 'सोयाबीन MSP अपडेट घोषित', textTe: 'సోయాబీన్ MSP నవీకరణ ప్రకటించబడింది', textTa: 'சோயாபீன் MSP புதுப்பிப்பு அறிவிக்கப்பட்டது', textKn: 'ಸೋಯಾಬೀನ್ MSP ನವೀಕರಣ ಘೋಷಣೆ', time: '3 hr ago', timeHi: '3 घंटे पहले', timeTe: '3 గంటల క్రితం', timeTa: '3 மணி நேரத்திற்கு முன்', timeKn: '3 ಗಂಟೆಗಳ ಹಿಂದೆ' }
];
