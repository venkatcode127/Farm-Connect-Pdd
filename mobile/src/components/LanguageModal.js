import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { COLORS } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';

const LanguageModal = ({ visible, onClose }) => {
  const { language, setLanguage, languages, t } = useLanguage();

  const handleSelect = (langCode) => {
    setLanguage(langCode);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <View style={styles.headerRow}>
            <Text style={styles.modalTitle}>🌐 {t('common.selectLanguage', 'Select Language')}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.subtext}>Choose your regional language for full app localization</Text>

          <FlatList
            data={languages}
            keyExtractor={item => item.code}
            style={{ maxHeight: 380, marginTop: 12 }}
            renderItem={({ item }) => {
              const isSelected = item.code === language;
              return (
                <TouchableOpacity
                  style={[styles.langItem, isSelected && styles.langItemSelected]}
                  onPress={() => handleSelect(item.code)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.flagText}>{item.flag}</Text>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[styles.nativeText, isSelected && styles.textSelected]}>{item.nativeName}</Text>
                    <Text style={styles.englishText}>{item.name}</Text>
                  </View>
                  {isSelected && <Text style={styles.checkMark}>✓</Text>}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  closeBtn: {
    padding: 4,
  },
  closeText: {
    fontSize: 18,
    color: COLORS.textMuted,
    fontWeight: '700',
  },
  subtext: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  langItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginVertical: 4,
    backgroundColor: COLORS.cardBgLight,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  langItemSelected: {
    backgroundColor: 'rgba(26, 122, 74, 0.08)',
    borderColor: COLORS.primary,
  },
  flagText: {
    fontSize: 22,
  },
  nativeText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  englishText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  textSelected: {
    color: COLORS.primary,
  },
  checkMark: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
  }
});

export default LanguageModal;
