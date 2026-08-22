// ===== FarmConnect AI - Data Layer =====

export const COMMODITIES = [
  // Grains & Cereals
  { 
    id: 'rice', 
    name: 'Rice (Basmati)', 
    nameHi: 'चावल (बासमती)', 
    nameTe: 'బియ్యం (బాస్మతి)', 
    nameTa: 'அரிசி (பாஸ்மதி)', 
    nameKn: 'ಅಕ್ಕಿ (ಬಾಸ್ಮತಿ)', 
    emoji: '🌾', 
    unit: 'Quintal', 
    category: 'Grain', 
    basePrice: 3850,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    seasonal: [1.02,1.01,0.98,0.96,0.95,0.97,1.0,1.02,1.04,1.05,1.03,1.02] 
  },
  { 
    id: 'wheat', 
    name: 'Wheat', 
    nameHi: 'गेहूँ', 
    nameTe: 'గోధుమ', 
    nameTa: 'கோதுமை', 
    nameKn: 'ಗೋಧಿ', 
    emoji: '🌿', 
    unit: 'Quintal', 
    category: 'Grain', 
    basePrice: 2450,
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    seasonal: [0.97,0.96,0.95,0.98,1.02,1.04,1.05,1.03,1.01,0.99,0.98,0.97] 
  },
  { 
    id: 'maize', 
    name: 'Maize (Corn)', 
    nameHi: 'मक्का', 
    nameTe: 'మొక్కజొన్న', 
    nameTa: 'மக்காச்சோளம்', 
    nameKn: 'ಮೆಕ್ಕೆಜೋಳ', 
    emoji: '🌽', 
    unit: 'Quintal', 
    category: 'Grain', 
    basePrice: 2050,
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    seasonal: [0.98,0.96,0.95,0.97,1.0,1.03,1.05,1.04,1.02,1.0,0.98,0.97] 
  },
  { 
    id: 'jowar', 
    name: 'Jowar (Sorghum)', 
    nameHi: 'ज्वार', 
    nameTe: 'జొన్నలు', 
    nameTa: 'சோளம்', 
    nameKn: 'ಜೋಳ', 
    emoji: '🌾', 
    unit: 'Quintal', 
    category: 'Grain', 
    basePrice: 3200,
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    seasonal: [1.0,0.98,0.97,0.99,1.01,1.03,1.02,1.0,0.98,0.99,1.01,1.0] 
  },
  { 
    id: 'bajra', 
    name: 'Bajra (Pearl Millet)', 
    nameHi: 'बाजरा', 
    nameTe: 'సజ్జలు', 
    nameTa: 'கம்பு', 
    nameKn: 'ಸಜ್ಜೆ', 
    emoji: '🌾', 
    unit: 'Quintal', 
    category: 'Grain', 
    basePrice: 2350,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    seasonal: [0.95,0.96,0.98,1.02,1.04,1.05,1.01,0.98,0.96,0.95,0.97,0.98] 
  },

  // Pulses & Legumes
  { 
    id: 'chana', 
    name: 'Chana (Gram / Chickpeas)', 
    nameHi: 'चना', 
    nameTe: 'శనగలు', 
    nameTa: 'கொண்டைக்கடலை', 
    nameKn: 'ಕಡಲೆ', 
    emoji: '🫘', 
    unit: 'Quintal', 
    category: 'Pulse', 
    basePrice: 5300,
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=800&q=80',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    seasonal: [0.94,0.93,0.96,1.01,1.06,1.08,1.05,1.02,0.98,0.96,0.95,0.95] 
  },
  { 
    id: 'tur_dal', 
    name: 'Tur / Arhar (Pigeon Pea)', 
    nameHi: 'अरहर दाल', 
    nameTe: 'కందిపప్పు', 
    nameTa: 'துவரம் பருப்பு', 
    nameKn: 'ತೊಗರಿ ಬೇಳೆ', 
    emoji: '🫘', 
    unit: 'Quintal', 
    category: 'Pulse', 
    basePrice: 7800,
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=800&q=80',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    seasonal: [0.96,0.95,0.97,1.02,1.07,1.09,1.05,1.01,0.98,0.96,0.95,0.96] 
  },
  { 
    id: 'moong', 
    name: 'Moong (Green Gram)', 
    nameHi: 'मूँग', 
    nameTe: 'పెసలు', 
    nameTa: 'பாசிப்பயறு', 
    nameKn: 'ಹೆಸರು ಕಾಳು', 
    emoji: '🫘', 
    unit: 'Quintal', 
    category: 'Pulse', 
    basePrice: 7400,
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=800&q=80',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    seasonal: [0.97,0.96,0.98,1.03,1.06,1.07,1.04,1.0,0.98,0.96,0.95,0.96] 
  },

  // Vegetables
  { 
    id: 'tomato', 
    name: 'Tomato (Hybrid & Desi)', 
    nameHi: 'टमाटर', 
    nameTe: 'టమాటో', 
    nameTa: 'தக்காளி', 
    nameKn: 'ಟೊಮೆಟೊ', 
    emoji: '🍅', 
    unit: 'Quintal', 
    category: 'Vegetable', 
    basePrice: 2600,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    seasonal: [0.85,0.80,0.90,1.05,1.15,1.25,1.30,1.20,1.05,0.90,0.85,0.82] 
  },
  { 
    id: 'onion', 
    name: 'Onion (Red Nasik)', 
    nameHi: 'प्याज', 
    nameTe: 'ఉల్లిపాయ', 
    nameTa: 'வெங்காயம்', 
    nameKn: 'ಈರುಳ್ಳಿ', 
    emoji: '🧅', 
    unit: 'Quintal', 
    category: 'Vegetable', 
    basePrice: 1950,
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    seasonal: [1.10,1.05,0.95,0.90,0.88,0.92,0.98,1.05,1.12,1.18,1.15,1.12] 
  },
  { 
    id: 'potato', 
    name: 'Potato (Agra & Jyoti)', 
    nameHi: 'आलू', 
    nameTe: 'బంగాళాదుంప', 
    nameTa: 'உருளைக்கிழங்கு', 
    nameKn: 'ಆಲೂಗಡ್ಡೆ', 
    emoji: '🥔', 
    unit: 'Quintal', 
    category: 'Vegetable', 
    basePrice: 1350,
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    seasonal: [0.90,0.88,0.92,0.98,1.05,1.10,1.12,1.08,1.02,0.95,0.92,0.90] 
  },
  { 
    id: 'garlic', 
    name: 'Garlic (Desi)', 
    nameHi: 'लहसुन', 
    nameTe: 'వెల్లుల్లి', 
    nameTa: 'பூண்டு', 
    nameKn: 'ಬೆಳ್ಳುಳ್ಳಿ', 
    emoji: '🧄', 
    unit: 'Quintal', 
    category: 'Vegetable', 
    basePrice: 9200,
    image: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=800&q=80',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    seasonal: [0.92,0.90,0.95,1.02,1.10,1.15,1.12,1.05,0.98,0.94,0.91,0.90] 
  },
  { 
    id: 'ginger', 
    name: 'Ginger (Fresh Green)', 
    nameHi: 'अदरक', 
    nameTe: 'అల్లం', 
    nameTa: 'இஞ்சி', 
    nameKn: 'ಶುಂಠಿ', 
    emoji: '🫚', 
    unit: 'Quintal', 
    category: 'Vegetable', 
    basePrice: 7500,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    seasonal: [0.94,0.92,0.96,1.04,1.12,1.16,1.10,1.02,0.96,0.92,0.91,0.93] 
  },

  // Fruits
  { 
    id: 'mango', 
    name: 'Mango (Alphonso & Banganapalli)', 
    nameHi: 'आम', 
    nameTe: 'మామిడి', 
    nameTa: 'மாம்பழம்', 
    nameKn: 'ಮಾವಿನ ಹಣ್ಣು', 
    emoji: '🥭', 
    unit: 'Quintal', 
    category: 'Fruit', 
    basePrice: 6800,
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    seasonal: [0.80,0.85,0.95,1.25,1.40,1.30,0.95,0.85,0.80,0.78,0.78,0.80] 
  },
  { 
    id: 'banana', 
    name: 'Banana (Robusta & Cavendish)', 
    nameHi: 'केला', 
    nameTe: 'అరటిపండు', 
    nameTa: 'வாழைப்பழம்', 
    nameKn: 'ಬಾಳೆಹಣ್ಣು', 
    emoji: '🍌', 
    unit: 'Quintal', 
    category: 'Fruit', 
    basePrice: 1850,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    seasonal: [0.95,0.96,0.98,1.02,1.05,1.06,1.04,1.01,0.98,0.96,0.95,0.95] 
  },
  { 
    id: 'apple', 
    name: 'Apple (Kashmiri & Shimla)', 
    nameHi: 'सेब', 
    nameTe: 'యాపిల్', 
    nameTa: 'ஆப்பிள்', 
    nameKn: 'ಸೇಬು', 
    emoji: '🍎', 
    unit: 'Quintal', 
    category: 'Fruit', 
    basePrice: 8500,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    seasonal: [1.10,1.15,1.18,1.20,1.15,1.05,0.90,0.85,0.82,0.88,0.95,1.05] 
  },

  // Cash Crops & Spices
  { 
    id: 'cotton', 
    name: 'Cotton (BT Long Staple)', 
    nameHi: 'कपास', 
    nameTe: 'పత్తి', 
    nameTa: 'பருத்தி', 
    nameKn: 'ಹತ್ತಿ', 
    emoji: '☁️', 
    unit: 'Quintal', 
    category: 'Cash Crop', 
    basePrice: 6250,
    image: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=800&q=80',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    seasonal: [0.98,0.97,0.96,0.95,0.97,1.0,1.02,1.04,1.06,1.05,1.02,1.0] 
  },
  { 
    id: 'sugarcane', 
    name: 'Sugarcane', 
    nameHi: 'गन्ना', 
    nameTe: 'చెరకు', 
    nameTa: 'கரும்பு', 
    nameKn: 'ಕಬ್ಬು', 
    emoji: '🎋', 
    unit: 'Quintal', 
    category: 'Cash Crop', 
    basePrice: 355,
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
    seasonal: [1.0,1.0,0.99,0.98,0.97,0.98,1.0,1.01,1.02,1.03,1.02,1.01] 
  },
  { 
    id: 'chilli', 
    name: 'Red Chilli (Guntur Teja)', 
    nameHi: 'लाल मिर्च', 
    nameTe: 'ఎర్ర మిర్చి', 
    nameTa: 'சிவப்பு மிளகாய்', 
    nameKn: 'ಕೆಂಪು ಮೆಣಸಿನಕಾಯಿ', 
    emoji: '🌶️', 
    unit: 'Quintal', 
    category: 'Spice', 
    basePrice: 8600,
    image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
    seasonal: [1.05,1.02,0.98,0.95,0.93,0.96,1.0,1.04,1.08,1.10,1.08,1.06] 
  },
  { 
    id: 'turmeric', 
    name: 'Turmeric (Nizamabad & Salem)', 
    nameHi: 'हल्दी', 
    nameTe: 'పసుపు', 
    nameTa: 'மஞ்சள்', 
    nameKn: 'ಅರಿಶಿನ', 
    emoji: '🟡', 
    unit: 'Quintal', 
    category: 'Spice', 
    basePrice: 12500,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    seasonal: [1.08,1.05,0.97,0.93,0.92,0.96,1.02,1.06,1.10,1.12,1.09,1.07] 
  },

  // Oilseeds
  { 
    id: 'soybean', 
    name: 'Soybean (Yellow)', 
    nameHi: 'सोयाबीन', 
    nameTe: 'సోయాబీన్', 
    nameTa: 'சோயாபீன்', 
    nameKn: 'ಸೋಯಾಬೀನ್', 
    emoji: '🫘', 
    unit: 'Quintal', 
    category: 'Oilseed', 
    basePrice: 4250,
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=800&q=80',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    seasonal: [0.95,0.93,0.92,0.94,0.98,1.02,1.06,1.08,1.10,1.06,1.0,0.97] 
  },
  { 
    id: 'mustard', 
    name: 'Mustard Seed (Sarson)', 
    nameHi: 'सरसों', 
    nameTe: 'ఆవాలు', 
    nameTa: 'கடுகு', 
    nameKn: 'ಸಾಸಿವೆ', 
    emoji: '🌼', 
    unit: 'Quintal', 
    category: 'Oilseed', 
    basePrice: 5150,
    image: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=800&q=80',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    seasonal: [0.96,0.94,0.98,1.02,1.06,1.08,1.05,1.02,0.99,0.97,0.95,0.96] 
  },
  { 
    id: 'groundnut', 
    name: 'Groundnut (Peanut)', 
    nameHi: 'मूंगफली', 
    nameTe: 'వేరుశెనగ', 
    nameTa: 'நிலக்கடலை', 
    nameKn: 'ಕಡಲೆಕಾಯಿ', 
    emoji: '🥜', 
    unit: 'Quintal', 
    category: 'Oilseed', 
    basePrice: 5400,
    image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    seasonal: [0.97,0.95,0.94,0.96,0.99,1.02,1.05,1.07,1.06,1.03,1.0,0.98] 
  }
];

export const MARKETS = [
  // North India
  { id: 'delhi', name: 'Azadpur APMC, Delhi', state: 'Delhi' },
  { id: 'karnal', name: 'Karnal Grain Market, Haryana', state: 'Haryana' },
  { id: 'khanna', name: 'Khanna Mandi (Asia Largest), Punjab', state: 'Punjab' },
  { id: 'lucknow', name: 'Alambagh Mandi, Lucknow', state: 'Uttar Pradesh' },
  { id: 'varanasi', name: 'Varanasi APMC, Uttar Pradesh', state: 'Uttar Pradesh' },
  { id: 'jaipur', name: 'Muhana Mandi, Jaipur', state: 'Rajasthan' },
  { id: 'kota', name: 'Kota Mandi, Rajasthan', state: 'Rajasthan' },

  // West & Central India
  { id: 'mumbai', name: 'Vashi APMC, Navi Mumbai', state: 'Maharashtra' },
  { id: 'pune', name: 'Gultekdi APMC, Pune', state: 'Maharashtra' },
  { id: 'nashik', name: 'Lasalgaon Onion Market, Nashik', state: 'Maharashtra' },
  { id: 'nagpur', name: 'Kalamna Mandi, Nagpur', state: 'Maharashtra' },
  { id: 'indore', name: 'Choithram APMC, Indore', state: 'Madhya Pradesh' },
  { id: 'neemuch', name: 'Neemuch Mandi, Madhya Pradesh', state: 'Madhya Pradesh' },
  { id: 'ahmedabad', name: 'Ahmedabad APMC, Gujarat', state: 'Gujarat' },
  { id: 'unjha', name: 'Unjha Spice Market, Gujarat', state: 'Gujarat' },

  // South India
  { id: 'hyderabad', name: 'Bowenpally Market, Hyderabad', state: 'Telangana' },
  { id: 'warangal', name: 'Warangal Enmamulagadda Yard, Telangana', state: 'Telangana' },
  { id: 'guntur', name: 'Guntur Mirchi Yard, Andhra Pradesh', state: 'Andhra Pradesh' },
  { id: 'vijayawada', name: 'Gollapudi APMC, Vijayawada', state: 'Andhra Pradesh' },
  { id: 'kurnool', name: 'Kurnool Mandi, Andhra Pradesh', state: 'Andhra Pradesh' },
  { id: 'bangalore', name: 'Yeshwanthpur APMC, Bangalore', state: 'Karnataka' },
  { id: 'mysore', name: 'Bandipalya APMC, Mysore', state: 'Karnataka' },
  { id: 'hubli', name: 'Amargol APMC, Hubli', state: 'Karnataka' },
  { id: 'chennai', name: 'Koyambedu Wholesale, Chennai', state: 'Tamil Nadu' },
  { id: 'madurai', name: 'Mattuthavani APMC, Madurai', state: 'Tamil Nadu' },
  { id: 'salem', name: 'Salem Agromarket, Tamil Nadu', state: 'Tamil Nadu' },
  { id: 'kochi', name: 'Kochi Spices Exchange, Kerala', state: 'Kerala' },

  // East India
  { id: 'kolkata', name: 'Posta Bazar, Kolkata', state: 'West Bengal' },
  { id: 'siliguri', name: 'Regulated Market, Siliguri', state: 'West Bengal' },
  { id: 'patna', name: 'Bazaar Samiti, Patna', state: 'Bihar' }
];





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

// ===== Generate PRICE_HISTORY for all crops across all markets =====
// Each market has a unique multiplier (±20%) and 30 days of realistic fluctuation data.
const MARKET_MULTIPLIERS = {
  delhi:      1.08, karnal:    1.05, khanna:    1.03, lucknow:   0.98,
  varanasi:   0.96, jaipur:    1.01, kota:      0.99, mumbai:    1.12,
  pune:       1.09, nashik:    1.06, nagpur:    1.04, indore:    1.02,
  neemuch:    0.97, ahmedabad: 1.07, unjha:     1.10, hyderabad: 1.05,
  warangal:   0.95, guntur:    1.00, vijayawada:1.03, kurnool:   0.94,
  bangalore:  1.08, mysore:    1.05, hubli:     0.97, chennai:   1.06,
  madurai:    1.01, salem:     0.98, kochi:     1.14, kolkata:   1.03,
  siliguri:   0.96, patna:     0.93
};

const _generateHistory = (basePrice, marketId, days = 30) => {
  const multiplier = MARKET_MULTIPLIERS[marketId] || 1.0;
  const base = Math.round(basePrice * multiplier);
  const history = [];
  let price = base;
  // Seeded pseudo-random using marketId + day for reproducibility
  const seed = marketId.split('').reduce((s, c) => s + c.charCodeAt(0), 0);
  for (let d = days; d >= 0; d--) {
    const noise = ((seed * (d + 1) * 9301 + 49297) % 233280) / 233280; // 0-1
    const delta = Math.round((noise - 0.5) * basePrice * 0.04); // ±2% swing
    price = Math.max(Math.round(base * 0.85), Math.min(Math.round(base * 1.15), price + delta));
    const date = new Date();
    date.setDate(date.getDate() - d);
    history.push({ date: date.toISOString().slice(0, 10), price });
  }
  return history;
};

export const PRICE_HISTORY = (() => {
  const ph = {};
  COMMODITIES.forEach(crop => {
    ph[crop.id] = {};
    MARKETS.forEach(market => {
      ph[crop.id][market.id] = _generateHistory(crop.basePrice, market.id);
    });
  });
  return ph;
})();

