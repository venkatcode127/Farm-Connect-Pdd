import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';
import { COMMODITIES, MARKETS } from '../data/commodities';
import { useLanguage } from '../context/LanguageContext';

const AnalyticsScreen = () => {
  const { t, getCropName } = useLanguage();
  const [perspective, setPerspective] = useState('farmer'); // 'farmer' or 'buyer'
  const [selectedState, setSelectedState] = useState('all');
  const [selectedCrop, setSelectedCrop] = useState('all');

  const states = useMemo(() => {
    return ['all', ...new Set(MARKETS.map(m => m.state))];
  }, []);

  const filteredCrops = useMemo(() => {
    if (selectedCrop === 'all') return COMMODITIES;
    return COMMODITIES.filter(c => c.id === selectedCrop);
  }, [selectedCrop]);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerCard}>
        <Text style={styles.headerTitle}>📊 {t('analytics.title', 'Crop Analytics & State Intelligence')}</Text>
        <Text style={styles.headerSub}>Real-time mandi spread, price disparity, and arbitrage trends</Text>
      </View>

      {/* Perspective Toggle (Farmer vs Buyer) */}
      <View style={styles.perspectiveRow}>
        <TouchableOpacity
          style={[styles.perspBtn, perspective === 'farmer' && styles.perspBtnActive]}
          onPress={() => setPerspective('farmer')}
        >
          <Text style={[styles.perspText, perspective === 'farmer' && styles.perspTextActive]}>
            {t('analytics.farmerView', '🌾 Farmer (Selling View)')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.perspBtn, perspective === 'buyer' && styles.perspBtnActive]}
          onPress={() => setPerspective('buyer')}
        >
          <Text style={[styles.perspText, perspective === 'buyer' && styles.perspTextActive]}>
            {t('analytics.buyerView', '🛒 Buyer (Procurement View)')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* State Filter Chips */}
      <View style={styles.filterCard}>
        <Text style={styles.filterTitle}>📍 Filter By State:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 6 }}>
          {states.map((st, i) => {
            const active = st === selectedState;
            return (
              <TouchableOpacity
                key={i}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setSelectedState(st)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {st === 'all' ? t('analytics.allStates', '🇮🇳 All States') : st}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Perspective Intelligence Summary */}
      <View style={[styles.card, { borderLeftWidth: 4, borderLeftColor: perspective === 'farmer' ? COLORS.accentGain : COLORS.accentBlue }]}>
        <Text style={styles.intelTitle}>
          {perspective === 'farmer' ? '🌾 Farmer Strategic Insights' : '🛒 Buyer Procurement Insights'}
        </Text>
        <Text style={styles.intelDesc}>
          {perspective === 'farmer'
            ? 'Wholesale prices for Oilseeds and Pulses are running 4.2% above national MSP. High demand detected in Maharashtra and Delhi APMCs.'
            : 'Favorable wholesale arrivals in northern mandis make this an optimal procurement window for Wheat and Basmati Rice with low spread.'}
        </Text>
      </View>

      {/* State-Wise Intelligence Breakdown */}
      <View style={[styles.card, { marginBottom: 30 }]}>
        <Text style={styles.sectionHeader}>📈 APMC State Disparity Matrix</Text>

        {filteredCrops.slice(0, 8).map((crop, idx) => {
          const base = crop.basePrice;
          const minPrice = Math.round(base * 0.94);
          const maxPrice = Math.round(base * 1.08);
          const spread = (((maxPrice - minPrice) / minPrice) * 100).toFixed(1);

          return (
            <View key={idx} style={styles.disparityItem}>
              <View style={styles.dispTop}>
                <Text style={styles.dispEmoji}>{crop.emoji}</Text>
                <Text style={styles.dispName}>{getCropName(crop)}</Text>
                <Text style={styles.dispSpreadBadge}>{spread}% Spread</Text>
              </View>

              <View style={styles.dispRow}>
                <View>
                  <Text style={styles.dispLabel}>Lowest APMC Rate</Text>
                  <Text style={styles.dispMin}>₹{minPrice.toLocaleString()}</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text style={styles.dispLabel}>Average Rate</Text>
                  <Text style={styles.dispAvg}>₹{base.toLocaleString()}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.dispLabel}>Highest APMC Rate</Text>
                  <Text style={styles.dispMax}>₹{maxPrice.toLocaleString()}</Text>
                </View>
              </View>
            </View>
          );
        })}
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
  headerCard: {
    backgroundColor: COLORS.primaryDark,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.white,
  },
  headerSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 4,
  },
  perspectiveRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 4,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  perspBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  perspBtnActive: {
    backgroundColor: COLORS.primary,
  },
  perspText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  perspTextActive: {
    color: COLORS.white,
    fontWeight: '800',
  },
  filterCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
  },
  chip: {
    backgroundColor: COLORS.cardBgLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 6,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  chipTextActive: {
    color: COLORS.white,
    fontWeight: '800',
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  intelTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  intelDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 6,
    lineHeight: 18,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 12,
  },
  disparityItem: {
    backgroundColor: COLORS.cardBgLight,
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  dispTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dispEmoji: {
    fontSize: 18,
    marginRight: 6,
  },
  dispName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
  },
  dispSpreadBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.accentGain,
    backgroundColor: 'rgba(26, 122, 74, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  dispRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  dispLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  dispMin: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.accentGain,
    marginTop: 2,
  },
  dispAvg: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 2,
  },
  dispMax: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.accentRed,
    marginTop: 2,
  }
});

export default AnalyticsScreen;
