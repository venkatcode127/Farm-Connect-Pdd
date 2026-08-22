import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { COLORS } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const Header = ({ onOpenLanguage, activeTabTitle }) => {
  const { language, languages } = useLanguage();
  const { user } = useAuth();
  
  const currentLang = languages.find(l => l.code === language) || languages[0];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
      <View style={styles.container}>
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>🌱</Text>
          </View>
          <View>
            <Text style={styles.brandTitle}>Farm<Text style={styles.brandAccent}>Connect</Text> AI</Text>
            <Text style={styles.tagline}>{activeTabTitle || 'Smart Farming'}</Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.langBtn} onPress={onOpenLanguage} activeOpacity={0.8}>
            <Text style={styles.langFlag}>{currentLang.flag}</Text>
            <Text style={styles.langName}>{currentLang.nativeName}</Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.primaryDark,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    backgroundColor: COLORS.primaryDark,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 20,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 0.2,
  },
  brandAccent: {
    color: COLORS.primaryLight,
  },
  tagline: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    gap: 6,
  },
  langFlag: {
    fontSize: 14,
  },
  langName: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
  dropdownArrow: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 8,
  }
});

export default Header;
