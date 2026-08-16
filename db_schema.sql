-- ---------------------------------------------------
-- AgriSmart AI Server Database Schema (PostgreSQL)
-- ---------------------------------------------------
-- Users table (farmers, buyers, admins)
CREATE TABLE users (
    id               BIGSERIAL PRIMARY KEY,
    name             VARCHAR(100) NOT NULL,
    phone            VARCHAR(20) UNIQUE NOT NULL,
    email            VARCHAR(255) UNIQUE,
    password_hash    VARCHAR(255) NOT NULL,
    role             VARCHAR(20) CHECK (role IN ('farmer','buyer','admin')) NOT NULL,
    location         VARCHAR(200),
    created_at       TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crops master data
CREATE TABLE crops (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    category    VARCHAR(100),
    season      VARCHAR(50),
    image_url   TEXT,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Daily market price snapshots (used for AI and charts)
CREATE TABLE market_prices (
    id          BIGSERIAL PRIMARY KEY,
    crop_id     BIGINT REFERENCES crops(id) ON DELETE CASCADE,
    mandi       VARCHAR(100) NOT NULL,
    state       VARCHAR(100) NOT NULL,
    price_per_qt NUMERIC(12,2) NOT NULL,
    price_date  DATE NOT NULL,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (crop_id, mandi, price_date)
);

-- Marketplace listings created by sellers (farmers/traders)
CREATE TABLE listings (
    id            BIGSERIAL PRIMARY KEY,
    crop_id       BIGINT REFERENCES crops(id) ON DELETE RESTRICT,
    seller_id    BIGINT REFERENCES users(id) ON DELETE RESTRICT,
    quantity_qt  NUMERIC(12,2) NOT NULL,
    price_per_qt  NUMERIC(12,2) NOT NULL,
    location      VARCHAR(200),
    contact       VARCHAR(20),
    description   TEXT,
    status        VARCHAR(20) CHECK (status IN ('active','sold','removed')) DEFAULT 'active',
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Orders placed by buyers against listings
CREATE TABLE orders (
    id            BIGSERIAL PRIMARY KEY,
    listing_id    BIGINT REFERENCES listings(id) ON DELETE RESTRICT,
    buyer_id      BIGINT REFERENCES users(id) ON DELETE RESTRICT,
    quantity_qt   NUMERIC(12,2) NOT NULL,
    total_price   NUMERIC(12,2) NOT NULL,
    status        VARCHAR(20) CHECK (status IN ('new','accepted','shipped','delivered','cancelled')) DEFAULT 'new',
    ordered_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Cached weather advisories for regions (optional)
CREATE TABLE weather_advisories (
    id            BIGSERIAL PRIMARY KEY,
    region        VARCHAR(100) NOT NULL,
    advisory_date DATE NOT NULL,
    forecast_json JSONB,
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (region, advisory_date)
);

-- AI price predictions (pre‑computed for fast UI)
CREATE TABLE ai_predictions (
    id              BIGSERIAL PRIMARY KEY,
    crop_id         BIGINT REFERENCES crops(id) ON DELETE CASCADE,
    mandi           VARCHAR(100) NOT NULL,
    predicted_price NUMERIC(12,2) NOT NULL,
    confidence      NUMERIC(5,2) NOT NULL,
    generated_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (crop_id, mandi)
);

-- User notifications (push / in‑app)
CREATE TABLE notifications (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT REFERENCES users(id) ON DELETE CASCADE,
    type        VARCHAR(50),
    message     TEXT NOT NULL,
    is_read     BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_market_prices_crop_date ON market_prices (crop_id, price_date DESC);
CREATE INDEX idx_listings_status ON listings (status);
CREATE INDEX idx_orders_status ON orders (status);
CREATE INDEX idx_ai_predictions_crop_mandi ON ai_predictions (crop_id, mandi);
-- ---------------------------------------------------
-- End of schema
-- ---------------------------------------------------
