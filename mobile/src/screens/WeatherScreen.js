import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '../theme/colors';
import { MARKETS } from '../data/commodities';
import { useLanguage } from '../context/LanguageContext';

const WEATHER_MOCK = {
  temp: 31,
  humidity: 62,
  wind: 14,
  rainfall: 12,
  condition: 'Partly Cloudy',
  icon: '⛅',
  forecast: [
    { day: 'Today', temp: '31° / 24°', icon: '⛅', rain: '20%' },
    { day: 'Tomorrow', temp: '33° / 25°', icon: '☀️', rain: '10%' },
    { day: 'Day 3', temp: '29° / 23°', icon: '🌧️', rain: '80%' },
    { day: 'Day 4', temp: '28° / 22°', icon: '⛈️', rain: '70%' },
    { day: 'Day 5', temp: '30° / 23°', icon: '🌤️', rain: '30%' },
    { day: 'Day 6', temp: '32° / 24°', icon: '☀️', rain: '0%' },
    { day: 'Day 7', temp: '33° / 25°', icon: '☀️', rain: '0%' }
  ],
  advisories: [
    '🌾 Spray Advisory: Ideal window for organic pesticide spraying within the next 24 hours before Day 3 showers.',
    '💧 Irrigation Tip: High humidity reduces soil evaporation; skip evening watering for Wheat & Mustard.',
    '🚜 Harvesting Alert: Complete Tomato plucking and transport before heavy Day 3 rain to avoid moisture rot.'
  ]
};

const WeatherScreen = () => {
  const { t } = useLanguage();
  const [selectedMarket, setSelectedMarket] = useState('delhi');
  const [weather, setWeather] = useState(WEATHER_MOCK);
  const [loading, setLoading] = useState(false);

  const fetchLiveWeather = async (marketId) => {
    setLoading(true);
    try {
      // Fetch open meteo or mock
      const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=28.61&longitude=77.20&current_weather=true&hourly=relative_humidity_2m');
      const data = await res.json();
      const curTemp = Math.round(data?.current_weather?.temperature || 31);
      const curWind = Math.round(data?.current_weather?.windspeed || 14);
      setWeather({
        ...WEATHER_MOCK,
        temp: curTemp,
        wind: curWind
      });
    } catch (e) {
      setWeather(WEATHER_MOCK);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveWeather(selectedMarket);
  }, [selectedMarket]);

  return (
    <ScrollView style={styles.container}>
      {/* Title */}
      <View style={styles.headerCard}>
        <Text style={styles.headerTitle}>🌤️ {t('weather.title', 'Agricultural Weather Intelligence')}</Text>
        <Text style={styles.headerSub}>Hyperlocal agronomic weather, rainfall alerts, and spraying tips</Text>
      </View>

      {/* Mandi Selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mandiScroll}>
        {MARKETS.map(m => {
          const active = m.id === selectedMarket;
          return (
            <TouchableOpacity
              key={m.id}
              style={[styles.mandiChip, active && styles.mandiChipActive]}
              onPress={() => setSelectedMarket(m.id)}
            >
              <Text style={[styles.mandiChipText, active && styles.mandiChipTextActive]}>{m.name.split(',')[0]}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Main Weather Card */}
      <View style={styles.mainWeatherCard}>
        <View style={styles.weatherTopRow}>
          <Text style={styles.weatherIcon}>{weather.icon}</Text>
          <View style={{ marginLeft: 16 }}>
            <Text style={styles.tempText}>{weather.temp}°C</Text>
            <Text style={styles.conditionText}>{weather.condition}</Text>
          </View>
        </View>

        <View style={styles.weatherGrid}>
          <View style={styles.gridBox}>
            <Text style={styles.gridIcon}>💧</Text>
            <Text style={styles.gridLabel}>{t('weather.humidity', 'Humidity')}</Text>
            <Text style={styles.gridVal}>{weather.humidity}%</Text>
          </View>
          <View style={styles.gridBox}>
            <Text style={styles.gridIcon}>💨</Text>
            <Text style={styles.gridLabel}>{t('weather.wind', 'Wind Speed')}</Text>
            <Text style={styles.gridVal}>{weather.wind} km/h</Text>
          </View>
          <View style={styles.gridBox}>
            <Text style={styles.gridIcon}>🌧️</Text>
            <Text style={styles.gridLabel}>Rainfall Risk</Text>
            <Text style={styles.gridVal}>{weather.rainfall} mm</Text>
          </View>
        </View>
      </View>

      {/* 7-Day Agronomic Forecast */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>📅 {t('weather.forecast', '7-Day Agronomic Forecast')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
          {weather.forecast.map((f, i) => (
            <View key={i} style={styles.forecastCard}>
              <Text style={styles.forecastDay}>{f.day}</Text>
              <Text style={styles.forecastIcon}>{f.icon}</Text>
              <Text style={styles.forecastTemp}>{f.temp}</Text>
              <Text style={styles.forecastRain}>🌧️ {f.rain}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Crop Advisories */}
      <View style={[styles.sectionCard, { marginBottom: 30 }]}>
        <Text style={styles.sectionTitle}>💡 Precision Crop Advisories</Text>
        {weather.advisories.map((tip, i) => (
          <View key={i} style={styles.advisoryItem}>
            <Text style={styles.advisoryText}>{tip}</Text>
          </View>
        ))}
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
  mandiScroll: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  mandiChip: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 6,
  },
  mandiChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  mandiChipText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  mandiChipTextActive: {
    color: COLORS.white,
    fontWeight: '800',
  },
  mainWeatherCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
  },
  weatherTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  weatherIcon: {
    fontSize: 48,
  },
  tempText: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.text,
  },
  conditionText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  weatherGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.cardBgLight,
    padding: 12,
    borderRadius: 14,
  },
  gridBox: {
    alignItems: 'center',
    flex: 1,
  },
  gridIcon: {
    fontSize: 18,
  },
  gridLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  gridVal: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  forecastCard: {
    backgroundColor: COLORS.cardBgLight,
    padding: 12,
    borderRadius: 14,
    alignItems: 'center',
    marginRight: 8,
    minWidth: 80,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  forecastDay: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  forecastIcon: {
    fontSize: 22,
    marginVertical: 6,
  },
  forecastTemp: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.text,
  },
  forecastRain: {
    fontSize: 10,
    color: COLORS.primary,
    marginTop: 4,
    fontWeight: '600',
  },
  advisoryItem: {
    backgroundColor: 'rgba(26, 122, 74, 0.06)',
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  advisoryText: {
    fontSize: 12,
    color: COLORS.text,
    lineHeight: 18,
  }
});

export default WeatherScreen;
