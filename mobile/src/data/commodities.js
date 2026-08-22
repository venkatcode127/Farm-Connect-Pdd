export const COMMODITIES = [
  { id: 'rice', name: 'Rice (Basmati)', emoji: '🌾', unit: 'Quintal', category: 'Grain', basePrice: 3850, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80' },
  { id: 'wheat', name: 'Wheat', emoji: '🌿', unit: 'Quintal', category: 'Grain', basePrice: 2450, image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80' },
  { id: 'maize', name: 'Maize (Corn)', emoji: '🌽', unit: 'Quintal', category: 'Grain', basePrice: 2050, image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80' },
  { id: 'jowar', name: 'Jowar (Sorghum)', emoji: '🌾', unit: 'Quintal', category: 'Grain', basePrice: 3200, image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80' },
  { id: 'bajra', name: 'Bajra (Pearl Millet)', emoji: '🌾', unit: 'Quintal', category: 'Grain', basePrice: 2350, image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80' },
  { id: 'gram', name: 'Gram (Chana)', emoji: '🫘', unit: 'Quintal', category: 'Pulses', basePrice: 5350, image: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=600&q=80' },
  { id: 'tur', name: 'Tur (Arhar/Pigeon Pea)', emoji: '🫘', unit: 'Quintal', category: 'Pulses', basePrice: 7200, image: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=600&q=80' },
  { id: 'moong', name: 'Moong (Green Gram)', emoji: '🫘', unit: 'Quintal', category: 'Pulses', basePrice: 7750, image: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=600&q=80' },
  { id: 'soybean', name: 'Soybean', emoji: '🌱', unit: 'Quintal', category: 'Oilseed', basePrice: 4600, image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80' },
  { id: 'mustard', name: 'Mustard Seed', emoji: '🌼', unit: 'Quintal', category: 'Oilseed', basePrice: 5450, image: 'https://images.unsplash.com/photo-1508784411316-02b8cd4d3a3a?auto=format&fit=crop&w=600&q=80' },
  { id: 'groundnut', name: 'Groundnut (Peanut)', emoji: '🥜', unit: 'Quintal', category: 'Oilseed', basePrice: 6300, image: 'https://images.unsplash.com/photo-1567892328221-5a0225d304a0?auto=format&fit=crop&w=600&q=80' },
  { id: 'cotton', name: 'Cotton (Raw)', emoji: '☁️', unit: 'Quintal', category: 'Commercial', basePrice: 7100, image: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=600&q=80' },
  { id: 'sugarcane', name: 'Sugarcane', emoji: '🎋', unit: 'Quintal', category: 'Commercial', basePrice: 380, image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80' },
  { id: 'tomato', name: 'Tomato', emoji: '🍅', unit: 'Quintal', category: 'Vegetable', basePrice: 2200, image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80' },
  { id: 'onion', name: 'Onion', emoji: '🧅', unit: 'Quintal', category: 'Vegetable', basePrice: 1850, image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80' },
  { id: 'potato', name: 'Potato', emoji: '🥔', unit: 'Quintal', category: 'Vegetable', basePrice: 1450, image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80' },
  { id: 'chilli_green', name: 'Chilli (Green)', emoji: '🌶️', unit: 'Quintal', category: 'Vegetable', basePrice: 4200, image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=600&q=80' },
  { id: 'turmeric', name: 'Turmeric (Haldi)', emoji: '🫚', unit: 'Quintal', category: 'Spices', basePrice: 13500, image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80' },
  { id: 'ginger', name: 'Ginger', emoji: '🫚', unit: 'Quintal', category: 'Spices', basePrice: 8500, image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80' },
  { id: 'garlic', name: 'Garlic', emoji: '🧄', unit: 'Quintal', category: 'Spices', basePrice: 11000, image: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=600&q=80' }
];

export const MARKETS = [
  { id: 'delhi', name: 'Azadpur APMC, Delhi', state: 'Delhi' },
  { id: 'mumbai', name: 'Vashi APMC, Navi Mumbai', state: 'Maharashtra' },
  { id: 'pune', name: 'Gultekdi APMC, Pune', state: 'Maharashtra' },
  { id: 'hyderabad', name: 'Bowenpally APMC, Hyderabad', state: 'Telangana' },
  { id: 'warangal', name: 'Warangal Grain APMC', state: 'Telangana' },
  { id: 'vijayawada', name: 'Gollapudi APMC, Vijayawada', state: 'Andhra Pradesh' },
  { id: 'guntur', name: 'Guntur Mirchi Yard APMC', state: 'Andhra Pradesh' },
  { id: 'bangalore', name: 'Yeshwanthpur APMC, Bengaluru', state: 'Karnataka' },
  { id: 'chennai', name: 'Koyambedu APMC, Chennai', state: 'Tamil Nadu' },
  { id: 'ahmedabad', name: 'Jamalpur APMC, Ahmedabad', state: 'Gujarat' },
  { id: 'jaipur', name: 'Muhana Mandi APMC, Jaipur', state: 'Rajasthan' },
  { id: 'kolkata', name: 'Koley Market APMC, Kolkata', state: 'West Bengal' },
  { id: 'ludhiana', name: 'Ludhiana Grain Mandi', state: 'Punjab' },
  { id: 'bhopal', name: 'Karond Mandi, Bhopal', state: 'Madhya Pradesh' }
];
