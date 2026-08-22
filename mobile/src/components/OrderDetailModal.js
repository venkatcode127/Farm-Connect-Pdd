import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Linking, ScrollView } from 'react-native';
import { COLORS } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';

const OrderDetailModal = ({ visible, order, onClose }) => {
  const { getCropName, t } = useLanguage();

  if (!order) return null;

  const phone = order.sellerContact || order.contact;

  const handleCall = () => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>📦 Order #{order.id}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={{ marginTop: 14 }}>
            <View style={styles.productRow}>
              <Text style={styles.productEmoji}>{order.listingEmoji || '🌾'}</Text>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.productName}>{getCropName(order.listingName)}</Text>
                <Text style={styles.productSub}>Farmer: <Text style={{ fontWeight: '700' }}>{order.seller}</Text></Text>
                <Text style={styles.productSub}>Buyer: <Text style={{ fontWeight: '700' }}>{order.buyer}</Text></Text>
              </View>
            </View>

            {/* Direct Farmer Contact Banner */}
            {phone && (
              <View style={styles.contactBanner}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.contactLabel}>📞 Farmer Direct Line:</Text>
                  <Text style={styles.contactPhone}>{phone}</Text>
                </View>
                <TouchableOpacity style={styles.callBtn} onPress={handleCall} activeOpacity={0.8}>
                  <Text style={styles.callBtnText}>Call Now</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.grid}>
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>Quantity</Text>
                <Text style={styles.gridValue}>{order.qty} Quintals</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>Rate / Quintal</Text>
                <Text style={styles.gridValue}>₹{(order.listingPrice || 0).toLocaleString()}</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>Total Amount</Text>
                <Text style={[styles.gridValue, { color: COLORS.accentGain, fontWeight: '800' }]}>₹{(order.totalPrice || 0).toLocaleString()}</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>Status</Text>
                <Text style={[styles.gridValue, { color: order.status === 'delivered' ? COLORS.success : order.status === 'cancelled' ? COLORS.danger : COLORS.info }]}>
                  {order.status?.toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoBoxLabel}>📍 Delivery Destination</Text>
              <Text style={styles.infoBoxValue}>{order.deliveryAddress || 'Standard Delivery Point'}</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoBoxLabel}>💳 Payment Method</Text>
              <Text style={styles.infoBoxValue}>{order.paymentMethod || 'Direct Mandi Transfer / COD'}</Text>
            </View>

            <TouchableOpacity style={styles.dismissBtn} onPress={onClose}>
              <Text style={styles.dismissText}>Close</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  closeBtn: {
    fontSize: 18,
    color: COLORS.textMuted,
    fontWeight: '700',
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBgLight,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  productEmoji: {
    fontSize: 32,
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  productSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  contactBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 122, 74, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(26, 122, 74, 0.25)',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  contactLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primary,
  },
  contactPhone: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 2,
  },
  callBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  callBtnText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 14,
  },
  gridItem: {
    flexBasis: '48%',
    backgroundColor: COLORS.cardBgLight,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  gridLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  gridValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 2,
  },
  infoBox: {
    marginTop: 10,
    padding: 12,
    backgroundColor: COLORS.cardBgLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  infoBoxLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  infoBoxValue: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '600',
    marginTop: 2,
  },
  dismissBtn: {
    backgroundColor: COLORS.border,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 10,
  },
  dismissText: {
    color: COLORS.text,
    fontWeight: '700',
    fontSize: 14,
  }
});

export default OrderDetailModal;
