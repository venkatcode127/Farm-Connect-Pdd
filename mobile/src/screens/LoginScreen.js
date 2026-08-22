import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { COLORS } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const LoginScreen = ({ navigation, onSwitchToRegister }) => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone || phone.length < 10) {
      Alert.alert('Validation Error', 'Please enter a valid 10-digit mobile number');
      return;
    }
    if (!password) {
      Alert.alert('Validation Error', 'Please enter your password');
      return;
    }

    setLoading(true);
    try {
      await login(phone, password);
    } catch (e) {
      Alert.alert('Login Failed', 'Please check your mobile number or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Text style={styles.appIcon}>🌾</Text>
        </View>

        <Text style={styles.title}>{t('login.welcome', 'Welcome Back 👋')}</Text>
        <Text style={styles.subtitle}>{t('login.subtitle', 'Login to access your mobile farming hub')}</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>{t('login.mobile', 'Mobile Number')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('login.enterMobile', 'Enter 10-digit mobile number')}
            keyboardType="phone-pad"
            maxLength={10}
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>{t('login.password', 'Password')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('login.enterPassword', 'Enter your password')}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading} activeOpacity={0.8}>
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.loginBtnText}>{t('login.loginBtn', '🚀 Login to FarmConnect')}</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>{t('login.newUser', "Don't have an account?")} </Text>
          <TouchableOpacity onPress={onSwitchToRegister}>
            <Text style={styles.registerLink}>{t('login.createAccount', 'Register Now')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: 'rgba(26, 122, 74, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  appIcon: {
    fontSize: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: COLORS.cardBgLight,
    color: COLORS.text,
  },
  loginBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  loginBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  registerLink: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '700',
  }
});

export default LoginScreen;
