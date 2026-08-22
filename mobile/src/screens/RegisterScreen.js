import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { COLORS } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const RegisterScreen = ({ navigation, onSwitchToLogin }) => {
  const { register } = useAuth();
  const { t } = useLanguage();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('farmer'); // 'farmer', 'buyer', 'trader'
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter your full name');
      return;
    }
    if (!phone || phone.length < 10) {
      Alert.alert('Validation Error', 'Please enter a valid 10-digit mobile number');
      return;
    }
    if (!password || password.length < 4) {
      Alert.alert('Validation Error', 'Password must be at least 4 characters');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: name.trim(),
        phone: phone.trim(),
        password,
        role,
        location: location.trim() || 'India'
      });
    } catch (e) {
      Alert.alert('Registration Failed', 'Could not complete registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Text style={styles.appIcon}>🌱</Text>
        </View>

        <Text style={styles.title}>{t('register.title', 'Create Account 🌱')}</Text>
        <Text style={styles.subtitle}>Join thousands of verified smart farmers & buyers</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>{t('register.fullName', 'Full Name')}</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Ramesh Patel"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>{t('login.mobile', 'Mobile Number')}</Text>
          <TextInput
            style={styles.input}
            placeholder="10-digit phone number"
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
            placeholder="Minimum 4 characters"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>{t('register.role', 'Select Your Role')}</Text>
          <View style={styles.roleRow}>
            <TouchableOpacity
              style={[styles.roleBtn, role === 'farmer' && styles.roleBtnActive]}
              onPress={() => setRole('farmer')}
            >
              <Text style={styles.roleEmoji}>🧑‍🌾</Text>
              <Text style={[styles.roleText, role === 'farmer' && styles.roleTextActive]}>{t('register.farmer', 'Farmer')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleBtn, role === 'buyer' && styles.roleBtnActive]}
              onPress={() => setRole('buyer')}
            >
              <Text style={styles.roleEmoji}>🛒</Text>
              <Text style={[styles.roleText, role === 'buyer' && styles.roleTextActive]}>{t('register.buyer', 'Buyer')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleBtn, role === 'trader' && styles.roleBtnActive]}
              onPress={() => setRole('trader')}
            >
              <Text style={styles.roleEmoji}>🏢</Text>
              <Text style={[styles.roleText, role === 'trader' && styles.roleTextActive]}>Trader</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>{t('register.location', 'Location (Village, State)')}</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Nashik, Maharashtra"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        <TouchableOpacity style={styles.registerBtn} onPress={handleRegister} disabled={loading} activeOpacity={0.8}>
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.registerBtnText}>{t('register.registerBtn', '✅ Register & Continue')}</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>{t('register.alreadyRegistered', 'Already registered?')} </Text>
          <TouchableOpacity onPress={onSwitchToLogin}>
            <Text style={styles.loginLink}>{t('register.loginHere', 'Login here')}</Text>
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
    marginTop: 4,
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 14,
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
  roleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  roleBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.cardBgLight,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  roleBtnActive: {
    backgroundColor: 'rgba(26, 122, 74, 0.1)',
    borderColor: COLORS.primary,
  },
  roleEmoji: {
    fontSize: 20,
    marginBottom: 2,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  roleTextActive: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  registerBtn: {
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
  registerBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
  },
  footerText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  loginLink: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '700',
  }
});

export default RegisterScreen;
