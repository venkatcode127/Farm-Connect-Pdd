import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Platform } from 'react-native';
import { COLORS } from './src/theme/colors';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { LanguageProvider, useLanguage } from './src/context/LanguageContext';

import Header from './src/components/Header';
import LanguageModal from './src/components/LanguageModal';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import PredictionScreen from './src/screens/PredictionScreen';
import MarketPricesScreen from './src/screens/MarketPricesScreen';
import MarketplaceScreen from './src/screens/MarketplaceScreen';
import OrdersScreen from './src/screens/OrdersScreen';
import WeatherScreen from './src/screens/WeatherScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';

const MainApp = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCropForPrediction, setSelectedCropForPrediction] = useState('rice');
  const [langModalVisible, setLangModalVisible] = useState(false);

  // If user is not logged in, show mobile login/register screens
  if (!user) {
    return (
      <SafeAreaView style={styles.authSafeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        {authMode === 'login' ? (
          <LoginScreen onSwitchToRegister={() => setAuthMode('register')} />
        ) : (
          <RegisterScreen onSwitchToLogin={() => setAuthMode('login')} />
        )}
      </SafeAreaView>
    );
  }

  const navigateToPredictionWithCrop = (cropId) => {
    setSelectedCropForPrediction(cropId);
    setActiveTab('prediction');
  };

  const getActiveTabTitle = () => {
    switch (activeTab) {
      case 'dashboard': return t('nav.dashboard', 'Dashboard');
      case 'prediction': return t('nav.aiPrediction', 'AI Prediction');
      case 'prices': return t('nav.marketPrices', 'Market Prices');
      case 'marketplace': return t('nav.marketplace', 'Marketplace');
      case 'orders': return t('nav.myOrders', 'My Orders');
      case 'weather': return t('nav.weather', 'Weather');
      case 'analytics': return t('nav.analytics', 'Analytics');
      default: return 'FarmConnect';
    }
  };

  return (
    <View style={styles.rootContainer}>
      {/* Top Header with Language Selector Modal */}
      <Header
        activeTabTitle={getActiveTabTitle()}
        onOpenLanguage={() => setLangModalVisible(true)}
      />

      {/* Screen Views */}
      <View style={styles.screenContainer}>
        {activeTab === 'dashboard' && <DashboardScreen onSelectCrop={navigateToPredictionWithCrop} />}
        {activeTab === 'prediction' && <PredictionScreen route={{ params: { crop: selectedCropForPrediction } }} />}
        {activeTab === 'prices' && <MarketPricesScreen />}
        {activeTab === 'marketplace' && <MarketplaceScreen />}
        {activeTab === 'orders' && <OrdersScreen />}
        {activeTab === 'weather' && <WeatherScreen />}
        {activeTab === 'analytics' && <AnalyticsScreen />}
      </View>

      {/* Mobile Bottom Tab Navigation Bar */}
      <SafeAreaView style={styles.bottomNavSafeArea}>
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'dashboard' && styles.tabItemActive]}
            onPress={() => setActiveTab('dashboard')}
          >
            <Text style={styles.tabIcon}>🏠</Text>
            <Text style={[styles.tabLabel, activeTab === 'dashboard' && styles.tabLabelActive]} numberOfLines={1}>
              {t('nav.dashboard', 'Home')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'prediction' && styles.tabItemActive]}
            onPress={() => setActiveTab('prediction')}
          >
            <Text style={styles.tabIcon}>🔮</Text>
            <Text style={[styles.tabLabel, activeTab === 'prediction' && styles.tabLabelActive]} numberOfLines={1}>
              {t('nav.aiPrediction', 'AI Forecast')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'marketplace' && styles.tabItemActive]}
            onPress={() => setActiveTab('marketplace')}
          >
            <Text style={styles.tabIcon}>🛍️</Text>
            <Text style={[styles.tabLabel, activeTab === 'marketplace' && styles.tabLabelActive]} numberOfLines={1}>
              {t('nav.marketplace', 'Market')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'orders' && styles.tabItemActive]}
            onPress={() => setActiveTab('orders')}
          >
            <Text style={styles.tabIcon}>📦</Text>
            <Text style={[styles.tabLabel, activeTab === 'orders' && styles.tabLabelActive]} numberOfLines={1}>
              {t('nav.myOrders', 'Orders')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'weather' && styles.tabItemActive]}
            onPress={() => setActiveTab('weather')}
          >
            <Text style={styles.tabIcon}>🌤️</Text>
            <Text style={[styles.tabLabel, activeTab === 'weather' && styles.tabLabelActive]} numberOfLines={1}>
              {t('nav.weather', 'Weather')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'analytics' && styles.tabItemActive]}
            onPress={() => setActiveTab('analytics')}
          >
            <Text style={styles.tabIcon}>📊</Text>
            <Text style={[styles.tabLabel, activeTab === 'analytics' && styles.tabLabelActive]} numberOfLines={1}>
              {t('nav.analytics', 'Analytics')}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Language Switcher Modal */}
      <LanguageModal
        visible={langModalVisible}
        onClose={() => setLangModalVisible(false)}
      />
    </View>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <MainApp />
      </LanguageProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  authSafeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  screenContainer: {
    flex: 1,
  },
  bottomNavSafeArea: {
    backgroundColor: COLORS.white,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingVertical: 6,
    paddingHorizontal: 4,
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 6,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
    borderRadius: 8,
  },
  tabItemActive: {
    backgroundColor: 'rgba(26, 122, 74, 0.08)',
  },
  tabIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  tabLabelActive: {
    color: COLORS.primary,
    fontWeight: '800',
  }
});
