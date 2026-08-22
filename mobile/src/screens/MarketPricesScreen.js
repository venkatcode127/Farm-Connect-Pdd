import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { COLORS } from '../theme/colors';
import { COMMODITIES, MARKETS } from '../data/commodities';
import { useLanguage } from '../context/LanguageContext';
import Sparkline from '../components/Sparkline';
import client from '../api/client';

const MarketPricesScreen = () => {
  const { t, getCropName } = useLanguage();
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState('all');
  const [marketId, setMarketId] = useState('delhi');
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const states = useMemo(() => {
    return ['all', ...new Set(MARKETS.map(m => m.state))];
  }, []);

  // Fetch from the SAME backend endpoint as Dashboard & Prediction
  useEffect(() => {
    const fetchPrices = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await client.get('/market/overview', { params: { market: marketId } });
        setApiData(res.data);
      } catch (e) {
        setError('Could not connect to backend. Please ensure the server is running.');
        setApiData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPrices();
  }, [marketId]);

  const marketList = useMemo(() => {
    if (!apiData?.commodities) return [];
    const searchLower = search.toLowerCase();

    return apiData.commodities.filter(item => {
      const com = COMMODITIES.find(c => c.id === item.crop || c.id === item.id);
      const localizedCrop = com ? getCropName(com) : item.name;
      if (searchLower && !localizedCrop.toLowerCase().includes(searchLower) && !(item.crop || '').includes(searchLower)) return false;
      const comState = MARKETS.find(m => m.id === marketId)?.state;
      if (selectedState !== 'all' && comState !== selectedState) return false;
      return true;
    }).map(item => {
      const com = COMMODITIES.find(c => c.id === item.crop || c.id === item.id) || { emoji: '🌾', name: item.name, id: item.crop };
      return {
        key: `${item.crop || item.id}_${marketId}`,
        crop: com,
        cropName: getCropName(com),
        price: item.currentPrice,
        change: item.change24h,
        forecast: item.predicted15DayPrice,
        forecastChange: item.expectedChangePercent,
        spark: item.sparkline || []
      };
    });
  }, [apiData, search, selectedState, marketId, getCropName]);

  return (
    <View style={styles.container}>
      {/* Market Selector */}
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.marketScroll}>
          {MARKETS.slice(0, 10).map(m => {
            const active = m.id === marketId;
            return (
              <TouchableOpacity
                key={m.id}
                style={[styles.stateChip, active && styles.stateChipActive]}
                onPress={() => setMarketId(m.id)}
              >
                <Text style={[styles.stateChipText, active && styles.stateChipTextActive]} numberOfLines={1}>
                  {m.name.split(',')[0]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Search crops (e.g. Rice, Wheat...)"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Loading State */}
      {loading && (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading live prices from backend...</Text>
        </View>
      )}

      {/* Error State */}
      {!loading && error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      )}

      {/* Prices List — same data as Dashboard & Prediction */}
      {!loading && !error && (
        <FlatList
          data={marketList}
          keyExtractor={item => item.key}
          contentContainerStyle={{ padding: 14, paddingBottom: 30 }}
          renderItem={({ item }) => {
            const isUp = item.change >= 0;
            const forecastUp = item.forecastChange >= 0;
            return (
              <View style={styles.priceCard}>
                <View style={styles.cardLeft}>
                  <Text style={styles.cropEmoji}>{item.crop.emoji}</Text>
                  <View style={{ marginLeft: 10, flex: 1 }}>
                    <Text style={styles.cropName}>{item.cropName}</Text>
                    <Text style={styles.marketName}>📍 {MARKETS.find(m => m.id === marketId)?.name}</Text>
                    <Text style={[styles.forecastText, { color: forecastUp ? COLORS.accentGain : COLORS.accentRed }]}>
                      15D: ₹{item.forecast?.toLocaleString()} ({forecastUp ? '+' : ''}{item.forecastChange?.toFixed(1)}%)
                    </Text>
                  </View>
                </View>

                <View style={styles.cardCenter}>
                  <Sparkline data={item.spark} width={50} height={20} />
                </View>

                <View style={styles.cardRight}>
                  <Text style={styles.priceText}>₹{item.price?.toLocaleString()}</Text>
                  <Text style={[styles.changeText, { color: isUp ? COLORS.accentGain : COLORS.accentRed }]}>
                    {isUp ? '▲ +' : '▼ '}{Math.abs(item.change).toFixed(1)}%
                  </Text>
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={{ fontSize: 32 }}>🔍</Text>
              <Text style={styles.emptyText}>No commodity found matching your search</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  filterSection: {
    backgroundColor: COLORS.white,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  marketScroll: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: COLORS.cardBgLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
  },
  stateChip: {
    backgroundColor: COLORS.cardBgLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 6,
  },
  stateChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  stateChipText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  stateChipTextActive: {
    color: COLORS.white,
    fontWeight: '800',
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  errorBox: {
    margin: 16,
    padding: 16,
    backgroundColor: 'rgba(231,76,60,0.1)',
    borderRadius: 12,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 13,
    textAlign: 'center',
  },
  priceCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 1,
  },
  cardLeft: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cropEmoji: {
    fontSize: 24,
  },
  cropName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  marketName: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  forecastText: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  cardCenter: {
    flex: 1,
    alignItems: 'center',
  },
  cardRight: {
    flex: 1.2,
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  changeText: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  emptyBox: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 8,
  }
});

export default MarketPricesScreen;
