-- ===== FarmConnect AI - Complete Database Schema =====
-- Database for agricultural price prediction and farmer marketplace platform
-- Created: 2026-05-11
-- Purpose: Store user data, prices, predictions, transactions, and analytics

-- ===== 1. USERS TABLE =====
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  phone VARCHAR(15) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('farmer', 'buyer', 'trader', 'admin') DEFAULT 'farmer',
  location VARCHAR(255) NOT NULL,
  state VARCHAR(50) NOT NULL,
  district VARCHAR(50),
  village VARCHAR(100),
  profile_photo_url VARCHAR(500),
  bio TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INT DEFAULT 0,
  verification_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
  kyc_document_url VARCHAR(500),
  bank_account_number VARCHAR(20),
  bank_ifsc_code VARCHAR(11),
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_phone (phone),
  INDEX idx_state (state),
  INDEX idx_role (role),
  INDEX idx_location (location),
  INDEX idx_verification (verification_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== 2. COMMODITIES TABLE =====
CREATE TABLE IF NOT EXISTS commodities (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(20) UNIQUE NOT NULL,
  name_en VARCHAR(100) NOT NULL,
  name_hi VARCHAR(100),
  name_te VARCHAR(100),
  name_ta VARCHAR(100),
  name_kn VARCHAR(100),
  emoji VARCHAR(5),
  category VARCHAR(50) NOT NULL,
  unit VARCHAR(20) DEFAULT 'Quintal',
  min_price DECIMAL(10,2),
  max_price DECIMAL(10,2),
  base_price DECIMAL(10,2),
  description TEXT,
  seasonal_peak_months VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_code (code),
  INDEX idx_category (category),
  INDEX idx_name (name_en)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== 3. MARKETS/MANDIS TABLE =====
CREATE TABLE IF NOT EXISTS markets (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(20) UNIQUE NOT NULL,
  name_en VARCHAR(100) NOT NULL,
  name_hi VARCHAR(100),
  name_te VARCHAR(100),
  name_ta VARCHAR(100),
  name_kn VARCHAR(100),
  state VARCHAR(50) NOT NULL,
  district VARCHAR(50),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  contact_person VARCHAR(100),
  contact_phone VARCHAR(15),
  email VARCHAR(100),
  opening_time TIME,
  closing_time TIME,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_code (code),
  INDEX idx_state (state),
  INDEX idx_district (district),
  SPATIAL INDEX idx_location (POINT(latitude, longitude))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== 4. DAILY PRICES TABLE =====
CREATE TABLE IF NOT EXISTS daily_prices (
  id INT PRIMARY KEY AUTO_INCREMENT,
  commodity_id INT NOT NULL,
  market_id INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  min_price DECIMAL(10,2),
  max_price DECIMAL(10,2),
  avg_price DECIMAL(10,2),
  quantity_traded DECIMAL(15,2),
  price_change_24h DECIMAL(5,2),
  price_change_percent DECIMAL(5,2),
  arrival_quantity DECIMAL(15,2),
  traded_quantity DECIMAL(15,2),
  date DATE NOT NULL,
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE KEY unique_commodity_market_date (commodity_id, market_id, date),
  INDEX idx_commodity (commodity_id),
  INDEX idx_market (market_id),
  INDEX idx_date (date),
  INDEX idx_price (price),
  FOREIGN KEY (commodity_id) REFERENCES commodities(id) ON DELETE CASCADE,
  FOREIGN KEY (market_id) REFERENCES markets(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== 5. PRICE HISTORY TABLE (30-day trend) =====
CREATE TABLE IF NOT EXISTS price_history (
  id INT PRIMARY KEY AUTO_INCREMENT,
  commodity_id INT NOT NULL,
  market_id INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL,
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE KEY unique_history (commodity_id, market_id, date),
  INDEX idx_commodity_market_date (commodity_id, market_id, date),
  FOREIGN KEY (commodity_id) REFERENCES commodities(id) ON DELETE CASCADE,
  FOREIGN KEY (market_id) REFERENCES markets(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== 6. AI PREDICTIONS TABLE =====
CREATE TABLE IF NOT EXISTS ai_predictions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  commodity_id INT NOT NULL,
  market_id INT NOT NULL,
  prediction_date DATE NOT NULL,
  forecast_days INT DEFAULT 7,
  predicted_price DECIMAL(10,2) NOT NULL,
  price_trend VARCHAR(20),
  confidence_score DECIMAL(5,2),
  recommendation ENUM('sell_now', 'wait', 'hold', 'buy') DEFAULT 'hold',
  volatility_score DECIMAL(5,2),
  model_version VARCHAR(50),
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_commodity (commodity_id),
  INDEX idx_market (market_id),
  INDEX idx_prediction_date (prediction_date),
  INDEX idx_recommendation (recommendation),
  FOREIGN KEY (commodity_id) REFERENCES commodities(id) ON DELETE CASCADE,
  FOREIGN KEY (market_id) REFERENCES markets(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== 7. PRICE ALERTS TABLE =====
CREATE TABLE IF NOT EXISTS price_alerts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  commodity_id INT NOT NULL,
  market_id INT NOT NULL,
  target_price DECIMAL(10,2),
  alert_type ENUM('price_increase', 'price_decrease', 'target_reached') DEFAULT 'price_increase',
  threshold_percent DECIMAL(5,2),
  is_active BOOLEAN DEFAULT TRUE,
  triggered_count INT DEFAULT 0,
  last_triggered_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_user (user_id),
  INDEX idx_commodity (commodity_id),
  INDEX idx_market (market_id),
  INDEX idx_active (is_active),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (commodity_id) REFERENCES commodities(id) ON DELETE CASCADE,
  FOREIGN KEY (market_id) REFERENCES markets(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== 8. MARKETPLACE LISTINGS TABLE =====
CREATE TABLE IF NOT EXISTS listings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  seller_id INT NOT NULL,
  commodity_id INT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  unit VARCHAR(20) DEFAULT 'Quintal',
  price_per_unit DECIMAL(10,2) NOT NULL,
  total_value DECIMAL(15,2),
  location VARCHAR(255) NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  description TEXT,
  quality_grade VARCHAR(20),
  harvest_date DATE,
  listing_status ENUM('active', 'sold', 'pending', 'expired', 'cancelled') DEFAULT 'active',
  listing_type ENUM('direct_sale', 'auction', 'pre_booking') DEFAULT 'direct_sale',
  photos_url JSON,
  views_count INT DEFAULT 0,
  interested_buyers INT DEFAULT 0,
  delivery_available BOOLEAN DEFAULT TRUE,
  delivery_radius_km INT DEFAULT 0,
  organic_certified BOOLEAN DEFAULT FALSE,
  storage_location VARCHAR(255),
  expiry_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_seller (seller_id),
  INDEX idx_commodity (commodity_id),
  INDEX idx_status (listing_status),
  INDEX idx_price (price_per_unit),
  INDEX idx_location (location),
  INDEX idx_created (created_at),
  FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (commodity_id) REFERENCES commodities(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== 9. ORDERS TABLE =====
CREATE TABLE IF NOT EXISTS orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_number VARCHAR(20) UNIQUE NOT NULL,
  buyer_id INT NOT NULL,
  seller_id INT NOT NULL,
  listing_id INT NOT NULL,
  commodity_id INT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(15,2) NOT NULL,
  
  order_status ENUM('pending', 'confirmed', 'paid', 'processing', 'dispatched', 'delivered', 'cancelled', 'refunded') DEFAULT 'pending',
  payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  delivery_status ENUM('pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'failed') DEFAULT 'pending',
  
  delivery_address TEXT,
  delivery_city VARCHAR(100),
  delivery_state VARCHAR(50),
  delivery_pincode VARCHAR(10),
  delivery_date DATE,
  delivery_proof_url VARCHAR(500),
  
  payment_method ENUM('credit_card', 'debit_card', 'upi', 'net_banking', 'wallet', 'cod') DEFAULT 'upi',
  transaction_id VARCHAR(100),
  
  quality_rating INT,
  quality_feedback TEXT,
  seller_rating INT,
  seller_feedback TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_buyer (buyer_id),
  INDEX idx_seller (seller_id),
  INDEX idx_order_number (order_number),
  INDEX idx_status (order_status),
  INDEX idx_payment_status (payment_status),
  INDEX idx_delivery_status (delivery_status),
  INDEX idx_created (created_at),
  FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE,
  FOREIGN KEY (commodity_id) REFERENCES commodities(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== 10. WEATHER DATA TABLE =====
CREATE TABLE IF NOT EXISTS weather_data (
  id INT PRIMARY KEY AUTO_INCREMENT,
  market_id INT NOT NULL,
  date DATE NOT NULL,
  temperature DECIMAL(5,2),
  min_temperature DECIMAL(5,2),
  max_temperature DECIMAL(5,2),
  humidity DECIMAL(5,2),
  rainfall_mm DECIMAL(8,2),
  wind_speed_kmh DECIMAL(5,2),
  wind_direction VARCHAR(10),
  soil_moisture DECIMAL(5,2),
  pressure_mb DECIMAL(7,2),
  uv_index DECIMAL(3,1),
  weather_condition VARCHAR(50),
  cloud_coverage DECIMAL(5,2),
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE KEY unique_market_date (market_id, date),
  INDEX idx_market (market_id),
  INDEX idx_date (date),
  FOREIGN KEY (market_id) REFERENCES markets(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== 11. CROP ADVISORY TABLE =====
CREATE TABLE IF NOT EXISTS crop_advisory (
  id INT PRIMARY KEY AUTO_INCREMENT,
  market_id INT NOT NULL,
  commodity_id INT,
  title_en VARCHAR(255) NOT NULL,
  title_hi VARCHAR(255),
  description_en TEXT,
  description_hi TEXT,
  advisory_type ENUM('weather', 'pest', 'disease', 'irrigation', 'harvesting', 'market', 'general') DEFAULT 'general',
  severity ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
  affected_commodities JSON,
  recommended_actions TEXT,
  start_date DATE,
  end_date DATE,
  issued_by VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_market (market_id),
  INDEX idx_commodity (commodity_id),
  INDEX idx_type (advisory_type),
  INDEX idx_severity (severity),
  FOREIGN KEY (market_id) REFERENCES markets(id) ON DELETE CASCADE,
  FOREIGN KEY (commodity_id) REFERENCES commodities(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== 12. USER RATINGS & REVIEWS TABLE =====
CREATE TABLE IF NOT EXISTS user_reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  reviewer_id INT NOT NULL,
  reviewed_user_id INT NOT NULL,
  order_id INT,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  review_text TEXT,
  review_type ENUM('quality', 'delivery', 'behavior', 'overall') DEFAULT 'overall',
  helpful_count INT DEFAULT 0,
  unhelpful_count INT DEFAULT 0,
  images_url JSON,
  verified_purchase BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_reviewer (reviewer_id),
  INDEX idx_reviewed_user (reviewed_user_id),
  INDEX idx_rating (rating),
  INDEX idx_created (created_at),
  FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== 13. TRANSACTIONS TABLE =====
CREATE TABLE IF NOT EXISTS transactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  transaction_id VARCHAR(100) UNIQUE NOT NULL,
  order_id INT NOT NULL,
  user_id INT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  payment_method VARCHAR(50),
  payment_gateway VARCHAR(50),
  transaction_status ENUM('success', 'failed', 'pending', 'refunded') DEFAULT 'pending',
  transaction_type ENUM('payment', 'refund', 'adjustment') DEFAULT 'payment',
  
  response_code VARCHAR(50),
  response_message TEXT,
  gateway_reference VARCHAR(100),
  
  commission_amount DECIMAL(10,2),
  commission_status ENUM('pending', 'paid') DEFAULT 'pending',
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  UNIQUE KEY unique_transaction (transaction_id),
  INDEX idx_order (order_id),
  INDEX idx_user (user_id),
  INDEX idx_status (transaction_status),
  INDEX idx_created (created_at),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== 14. USER ACTIVITY LOG TABLE =====
CREATE TABLE IF NOT EXISTS user_activity_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  activity_type VARCHAR(100),
  action VARCHAR(255),
  details JSON,
  ip_address VARCHAR(45),
  user_agent VARCHAR(500),
  device_type VARCHAR(20),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_user (user_id),
  INDEX idx_activity_type (activity_type),
  INDEX idx_timestamp (timestamp),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== 15. MARKET ANALYTICS TABLE =====
CREATE TABLE IF NOT EXISTS market_analytics (
  id INT PRIMARY KEY AUTO_INCREMENT,
  commodity_id INT NOT NULL,
  market_id INT NOT NULL,
  date DATE NOT NULL,
  
  -- Price analytics
  avg_price DECIMAL(10,2),
  min_price DECIMAL(10,2),
  max_price DECIMAL(10,2),
  price_volatility DECIMAL(5,2),
  price_trend VARCHAR(20),
  
  -- Volume analytics
  total_arrivals DECIMAL(15,2),
  total_traded DECIMAL(15,2),
  avg_transaction_size DECIMAL(10,2),
  
  -- Market health
  demand_level VARCHAR(20),
  supply_level VARCHAR(20),
  buyer_count INT,
  seller_count INT,
  
  -- Forecast
  forecasted_price DECIMAL(10,2),
  forecast_accuracy DECIMAL(5,2),
  
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE KEY unique_analytics (commodity_id, market_id, date),
  INDEX idx_commodity (commodity_id),
  INDEX idx_market (market_id),
  INDEX idx_date (date),
  FOREIGN KEY (commodity_id) REFERENCES commodities(id) ON DELETE CASCADE,
  FOREIGN KEY (market_id) REFERENCES markets(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== 16. USER PREFERENCES TABLE =====
CREATE TABLE IF NOT EXISTS user_preferences (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT UNIQUE NOT NULL,
  
  preferred_markets JSON,
  preferred_commodities JSON,
  preferred_languages JSON DEFAULT '["en"]',
  
  notification_price_alerts BOOLEAN DEFAULT TRUE,
  notification_orders BOOLEAN DEFAULT TRUE,
  notification_messages BOOLEAN DEFAULT TRUE,
  notification_recommendations BOOLEAN DEFAULT TRUE,
  
  email_notifications BOOLEAN DEFAULT FALSE,
  sms_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT TRUE,
  
  theme VARCHAR(20) DEFAULT 'light',
  display_language VARCHAR(10) DEFAULT 'en',
  
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== 17. WISHLISTS TABLE =====
CREATE TABLE IF NOT EXISTS wishlists (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  listing_id INT NOT NULL,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE KEY unique_user_listing (user_id, listing_id),
  INDEX idx_user (user_id),
  INDEX idx_listing (listing_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== 18. MESSAGE/CHAT TABLE =====
CREATE TABLE IF NOT EXISTS messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  order_id INT,
  message_text TEXT NOT NULL,
  message_type ENUM('text', 'image', 'file') DEFAULT 'text',
  attachment_url VARCHAR(500),
  
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_sender (sender_id),
  INDEX idx_receiver (receiver_id),
  INDEX idx_order (order_id),
  INDEX idx_created (created_at),
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== 19. ADMIN NOTIFICATIONS TABLE =====
CREATE TABLE IF NOT EXISTS admin_notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  admin_id INT,
  notification_type VARCHAR(100),
  title VARCHAR(255),
  description TEXT,
  severity ENUM('info', 'warning', 'critical') DEFAULT 'info',
  related_entity_type VARCHAR(50),
  related_entity_id INT,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_admin (admin_id),
  INDEX idx_type (notification_type),
  INDEX idx_is_read (is_read),
  FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== 20. SYSTEM LOGS TABLE =====
CREATE TABLE IF NOT EXISTS system_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  log_level ENUM('debug', 'info', 'warning', 'error', 'critical') DEFAULT 'info',
  log_type VARCHAR(100),
  message TEXT,
  details JSON,
  ip_address VARCHAR(45),
  user_id INT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_level (log_level),
  INDEX idx_type (log_type),
  INDEX idx_timestamp (timestamp),
  INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== VIEWS FOR COMMON QUERIES =====

-- Active listings view
CREATE OR REPLACE VIEW active_listings_view AS
SELECT 
  l.id,
  l.seller_id,
  u.name AS seller_name,
  l.commodity_id,
  c.name_en AS commodity_name,
  c.emoji,
  l.quantity,
  l.unit,
  l.price_per_unit,
  l.total_value,
  l.location,
  l.description,
  l.views_count,
  l.interested_buyers,
  l.created_at,
  TIMESTAMPDIFF(DAY, l.created_at, NOW()) AS days_active
FROM listings l
JOIN users u ON l.seller_id = u.id
JOIN commodities c ON l.commodity_id = c.id
WHERE l.listing_status = 'active' AND l.expiry_date > NOW();

-- Current market prices view
CREATE OR REPLACE VIEW current_market_prices_view AS
SELECT 
  dp.id,
  dp.commodity_id,
  c.name_en,
  c.emoji,
  dp.market_id,
  m.name_en AS market_name,
  m.state,
  dp.price,
  dp.min_price,
  dp.max_price,
  dp.price_change_24h,
  dp.price_change_percent,
  dp.quantity_traded,
  dp.date,
  ROW_NUMBER() OVER (PARTITION BY dp.commodity_id, dp.market_id ORDER BY dp.date DESC) AS rn
FROM daily_prices dp
JOIN commodities c ON dp.commodity_id = c.id
JOIN markets m ON dp.market_id = m.id
WHERE dp.date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY);

-- Top rated sellers view
CREATE OR REPLACE VIEW top_rated_sellers_view AS
SELECT 
  u.id,
  u.name,
  u.phone,
  u.location,
  u.state,
  COUNT(DISTINCT ur.id) AS total_reviews,
  AVG(ur.rating) AS avg_rating,
  COUNT(DISTINCT o.id) AS total_orders
FROM users u
LEFT JOIN user_reviews ur ON u.id = ur.reviewed_user_id
LEFT JOIN orders o ON u.id = o.seller_id AND o.order_status = 'delivered'
WHERE u.role IN ('farmer', 'trader')
GROUP BY u.id
HAVING total_reviews > 0
ORDER BY avg_rating DESC;

-- User transaction summary view
CREATE OR REPLACE VIEW user_transaction_summary_view AS
SELECT 
  t.user_id,
  u.name,
  COUNT(DISTINCT t.id) AS total_transactions,
  SUM(CASE WHEN t.transaction_status = 'success' THEN t.amount ELSE 0 END) AS total_successful_amount,
  SUM(CASE WHEN t.transaction_status = 'failed' THEN 1 ELSE 0 END) AS failed_transactions,
  COUNT(DISTINCT t.order_id) AS total_orders
FROM transactions t
JOIN users u ON t.user_id = u.id
GROUP BY t.user_id;

-- ===== INDEXES FOR PERFORMANCE =====

-- Add composite indexes for common query patterns
ALTER TABLE daily_prices ADD INDEX idx_commodity_market_date (commodity_id, market_id, date);
ALTER TABLE listings ADD INDEX idx_commodity_price_created (commodity_id, price_per_unit, created_at);
ALTER TABLE orders ADD INDEX idx_buyer_created (buyer_id, created_at);
ALTER TABLE orders ADD INDEX idx_seller_status (seller_id, order_status);
ALTER TABLE price_history ADD INDEX idx_commodity_market_date (commodity_id, market_id, date);

-- ===== SAMPLE DATA INSERTION HINTS =====
/*
INSERT INTO commodities (code, name_en, name_hi, emoji, category, base_price)
VALUES 
('RICE', 'Rice (Basmati)', 'चावल (बासमती)', '🌾', 'Grain', 3850),
('WHEAT', 'Wheat', 'गेहूँ', '🌿', 'Grain', 2450),
('TOMATO', 'Tomato', 'टमाटर', '🍅', 'Vegetable', 2800),
('ONION', 'Onion', 'प्याज', '🧅', 'Vegetable', 1800),
...
*/

-- ===== END OF DATABASE SCHEMA =====
