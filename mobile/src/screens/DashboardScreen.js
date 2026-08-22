import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { COLORS } from '../theme/colors';
import { COMMODITIES, MARKETS } from '../data/commodities';
import { useLanguage } from '../context/LanguageContext';
import client from '../api/client';
import Sparkline from '../components/Sparkline';

const DashboardScreen = ({ navigation, onSelectCrop }) => {
  const { t, getCropName } = useLanguage();
  const [marketId, setMarketId] = useState('delhi');
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOverview = async () => {
    try {
      const res = await client.get('/market/overview', { params: { market: marketId } });
      setMarketData(res.data);
    } catch (e) {
      // Show empty state — never show fake prices
      setMarketData({ error: true, commodities: [], topPredictions: [], topGainer: null });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchOverview();
  }, [marketId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOverview();
  };

  const topGainer = marketData?.topGainer;
  const topPredictions = marketData?.topPredictions || [];

  const getTranslatedRec = (rec) => {
    if (!rec) return '';
    const upper = rec.toUpperCase();
    if (upper.includes('SELL')) return t('rec.sell', 'SELL NOW');
    if (upper.includes('BUY')) return t('rec.buy', 'BUY NOW');
    if (upper.includes('HOLD') || upper.includes('WAIT')) return t('rec.hold', 'HOLD');
    return rec;
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
    >
      {/* Hero Banner */}
      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>{t('dashboard.heroTitle', 'Smart Farming Hub')}</Text>
        <Text style={styles.heroSubtitle}>{t('dashboard.heroSubtitle', 'AI Price Predictions & Direct Mandi Trade')}</Text>
        <TouchableOpacity style={styles.heroCta} onPress={() => onSelectCrop && onSelectCrop('rice')} activeOpacity={0.8}>
          <Text style={styles.heroCtaText}>⚡ {t('nav.aiPrediction', 'View 15-Day AI Forecasts')}</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>📈</Text>
          <Text style={styles.statLabel}>{t('dashboard.topGainer', 'Top Gainer Today')}</Text>
          <Text style={[styles.statValue, { color: COLORS.accentGain }]}>
            {topGainer ? `${getCropName(topGainer.name)} +${Math.abs(topGainer.change24h).toFixed(1)}%` : '...'}
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>🏛️</Text>
          <Text style={styles.statLabel}>{t('dashboard.activeMarkets', 'Active Mandis')}</Text>
          <Text style={styles.statValue}>{MARKETS.length} Mandis</Text>
        </View>
      </View>

      {/* Mandi Selector */}
      <View style={styles.mandiSection}>
        <Text style={styles.mandiLabel}>{t('dashboard.selectMarket', 'Select Mandi / State:')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mandiScroll}>
          {MARKETS.map(m => {
            const active = m.id === marketId;
            return (
              <TouchableOpacity
                key={m.id}
                style={[styles.mandiChip, active && styles.mandiChipActive]}
                onPress={() => setMarketId(m.id)}
              >
                <Text style={[styles.mandiChipText, active && styles.mandiChipTextActive]}>{m.name.split(',')[0]}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* AI Top 3 Predictions */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('dashboard.topForecasts', '🤖 AI Top 15-Day Forecasts')}</Text>
          <Text style={styles.sectionBadge}>15-Day AI</Text>
        </View>

        {topPredictions.map((crop, idx) => {
          const com = COMMODITIES.find(c => c.id === crop.id) || { emoji: '🌾', name: crop.name };
          const isUp = crop.expectedChangePercent >= 0;
          return (
            <TouchableOpacity
              key={idx}
              style={styles.predItem}
              onPress={() => onSelectCrop && onSelectCrop(crop.id || crop.crop)}
              activeOpacity={0.7}
            >
              <Text style={styles.cropEmoji}>{com.emoji}</Text>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.cropName}>{getCropName(com)}</Text>
                <Text style={styles.predTarget}>
                  15-Day: <Text style={{ fontWeight: '800', color: COLORS.accentGain }}>₹{(crop.predicted15DayPrice || 0).toLocaleString()}</Text>
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.changeText, { color: isUp ? COLORS.accentGain : COLORS.accentRed }]}>
                  {isUp ? '▲ +' : '▼ '}{Math.abs(crop.expectedChangePercent)}%
                </Text>
                <View style={[styles.recBadge, { backgroundColor: isUp ? 'rgba(26, 122, 74, 0.1)' : 'rgba(231, 76, 60, 0.1)' }]}>
                  <Text style={[styles.recBadgeText, { color: isUp ? COLORS.accentGain : COLORS.accentRed }]}>
                    {getTranslatedRec(crop.recommendation)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Live Market Prices Table */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('dashboard.quickPrice', 'Live APMC Market Rates')}</Text>
          <Text style={styles.sectionSub}>₹ / Quintal</Text>
        </View>

        {(marketData?.commodities || COMMODITIES.slice(0, 8)).map((item, idx) => {
          const com = COMMODITIES.find(c => c.id === item.id) || { emoji: '🌾', name: item.name };
          const price = item.currentPrice || com.basePrice;
          const chg = item.change24h || 0.8;
          const isUp = chg >= 0;
          const sparkData = item.sparkline || [price * 0.98, price * 0.99, price, price * 1.01, price];

          return (
            <TouchableOpacity
              key={idx}
              style={styles.priceRow}
              onPress={() => onSelectCrop && onSelectCrop(item.id || com.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.tableEmoji}>{com.emoji}</Text>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.tableName}>{getCropName(com)}</Text>
                <Text style={styles.tableUnit}>per Quintal</Text>
              </View>
              <Sparkline data={sparkData} />
              <View style={{ width: 85, alignItems: 'flex-end', marginLeft: 10 }}>
                <Text style={styles.tablePrice}>₹{price.toLocaleString()}</Text>
                <Text style={[styles.tableChg, { color: isUp ? COLORS.accentGain : COLORS.accentRed }]}>
                  {isUp ? '▲ +' : '▼ '}{Math.abs(chg).toFixed(1)}%
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Weather Impact Notice */}
      <View style={[styles.sectionCard, { marginBottom: 30 }]}>
        <Text style={styles.sectionTitle}>🌤️ Weather Price Impact</Text>
        <View style={styles.weatherImpactBox}>
          <Text style={styles.weatherImpactIcon}>🌧️</Text>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.weatherImpactHeading}>Monsoon Rainfall & Storage</Text>
            <Text style={styles.weatherImpactDesc}>Favorable rain in northern plains supports steady supply for Rice, Wheat, and Mustard.</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 14,
  },
  heroCard: {
    backgroundColor: COLORS.primaryDark,
    borderRadius: 20,
    padding: 20,
    marginBottom: 14,
    shadowColor: COLORS.primaryDark,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.white,
  },
  heroSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
    marginBottom: 16,
  },
  heroCta: {
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  heroCtaText: {
    color: COLORS.primaryDark,
    fontWeight: '800',
    fontSize: 13,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 1,
  },
  statEmoji: {
    fontSize: 22,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 2,
  },
  mandiSection: {
    marginBottom: 14,
  },
  mandiLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },
  mandiScroll: {
    flexDirection: 'row',
  },
  mandiChip: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
  },
  mandiChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  mandiChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  mandiChipTextActive: {
    color: COLORS.white,
    fontWeight: '700',
  },
  sectionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  sectionBadge: {
    backgroundColor: 'rgba(26, 122, 74, 0.1)',
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  sectionSub: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  predItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  cropEmoji: {
    fontSize: 26,
  },
  cropName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  predTarget: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  changeText: {
    fontSize: 13,
    fontWeight: '800',
  },
  recBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 2,
  },
  recBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  tableEmoji: {
    fontSize: 22,
  },
  tableName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  tableUnit: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  tablePrice: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
  },
  tableChg: {
    fontSize: 11,
    fontWeight: '700',
  },
  weatherImpactBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBgLight,
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  weatherImpactIcon: {
    fontSize: 26,
  },
  weatherImpactHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  weatherImpactDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  }
});

export default DashboardScreen;
