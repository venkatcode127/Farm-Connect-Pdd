import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList, Linking, Alert, RefreshControl } from 'react-native';
import { COLORS } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import OrderDetailModal from '../components/OrderDetailModal';
import RatingModal from '../components/RatingModal';

const ORDER_TABS = ['all', 'active', 'completed', 'cancelled'];

const OrdersScreen = ({ navigation }) => {
  const { t, getCropName } = useLanguage();
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [currentTab, setCurrentTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [ratingData, setRatingData] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await client.get('/orders');
      setOrders(res.data || []);
    } catch (e) {
      // Demo fallback
      setOrders([
        {
          id: 'ord_101',
          listingName: 'Rice (Basmati)',
          listingEmoji: '🌾',
          listingPrice: 3900,
          qty: 25,
          totalPrice: 97500,
          seller: 'Ramesh Patel',
          sellerContact: '+91 9876543210',
          buyer: user ? user.name : 'You (Buyer)',
          status: 'placed',
          deliveryAddress: 'Main APMC Yard, Delhi',
          createdAt: new Date().toISOString()
        },
        {
          id: 'ord_102',
          listingName: 'Tomato',
          listingEmoji: '🍅',
          listingPrice: 2100,
          qty: 15,
          totalPrice: 31500,
          seller: 'Suresh Patil',
          sellerContact: '+91 9812345678',
          buyer: user ? user.name : 'You (Buyer)',
          status: 'delivered',
          deliveryAddress: 'Sector 18 Hub, Noida',
          createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
        }
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const handleCancelOrder = async (orderId) => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await client.put(`/orders/${orderId}`, { status: 'cancelled' });
              fetchOrders();
            } catch (e) {
              setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o));
            }
          }
        }
      ]
    );
  };

  const filteredOrders = orders.filter(o => {
    if (currentTab === 'active') return !['delivered', 'cancelled'].includes(o.status);
    if (currentTab === 'completed') return o.status === 'delivered';
    if (currentTab === 'cancelled') return o.status === 'cancelled';
    return true;
  });

  const totalDeliveredValue = orders.filter(o => o.status === 'delivered').reduce((s, o) => s + (o.totalPrice || 0), 0);

  return (
    <View style={styles.container}>
      {/* Header Tabs */}
      <View style={styles.tabBar}>
        {ORDER_TABS.map(tab => {
          const active = currentTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tabBtn, active && styles.tabBtnActive]}
              onPress={() => setCurrentTab(tab)}
            >
              <Text style={[styles.tabBtnText, active && styles.tabBtnTextActive]}>
                {tab === 'all' ? 'All' : tab === 'active' ? 'Active' : tab === 'completed' ? 'Delivered' : 'Cancelled'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Income Summary Strip */}
      <View style={styles.summaryBox}>
        <View>
          <Text style={styles.summaryLabel}>Total Settled Business Value</Text>
          <Text style={styles.summaryVal}>💰 ₹{totalDeliveredValue.toLocaleString()}</Text>
        </View>
        <Text style={styles.orderCountBadge}>{orders.length} Orders</Text>
      </View>

      {/* Orders List */}
      <FlatList
        data={filteredOrders}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={{ padding: 14, paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
        renderItem={({ item }) => {
          const isCancelled = item.status === 'cancelled';
          const isDelivered = item.status === 'delivered';
          const sellerPhone = item.sellerContact || item.contact;

          return (
            <View style={styles.orderCard}>
              <View style={styles.orderTop}>
                <View style={styles.orderTitleRow}>
                  <Text style={styles.orderEmoji}>{item.listingEmoji || '🌾'}</Text>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.orderCropName}>{getCropName(item.listingName)}</Text>
                    <Text style={styles.orderSub}>Seller: <Text style={{ fontWeight: '700' }}>{item.seller}</Text></Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: isDelivered ? 'rgba(26, 122, 74, 0.1)' : isCancelled ? 'rgba(231, 76, 60, 0.1)' : 'rgba(21, 101, 192, 0.1)' }]}>
                    <Text style={[styles.statusBadgeText, { color: isDelivered ? COLORS.accentGain : isCancelled ? COLORS.accentRed : COLORS.accentBlue }]}>
                      {item.status?.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.orderMetaRow}>
                <View>
                  <Text style={styles.metaLabel}>QUANTITY</Text>
                  <Text style={styles.metaVal}>{item.qty} Qt</Text>
                </View>
                <View>
                  <Text style={styles.metaLabel}>RATE</Text>
                  <Text style={styles.metaVal}>₹{(item.listingPrice || 0).toLocaleString()}/Qt</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.metaLabel}>TOTAL</Text>
                  <Text style={[styles.metaVal, { color: COLORS.accentGain, fontWeight: '800' }]}>₹{(item.totalPrice || 0).toLocaleString()}</Text>
                </View>
              </View>

              {/* Direct Farmer Contact Button */}
              {sellerPhone && (
                <TouchableOpacity
                  style={styles.directCallBtn}
                  onPress={() => Linking.openURL(`tel:${sellerPhone}`)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.directCallText}>📞 {t('orders.contactFarmer', 'Call Farmer Directly')} ({sellerPhone})</Text>
                </TouchableOpacity>
              )}

              {/* Actions */}
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.detailBtn} onPress={() => setSelectedOrder(item)}>
                  <Text style={styles.detailBtnText}>Details</Text>
                </TouchableOpacity>

                {isDelivered && (
                  <TouchableOpacity
                    style={styles.rateBtn}
                    onPress={() => setRatingData({ farmerName: item.seller, order: item })}
                  >
                    <Text style={styles.rateBtnText}>⭐ Rate</Text>
                  </TouchableOpacity>
                )}

                {!isCancelled && !isDelivered && (
                  <TouchableOpacity style={styles.cancelBtn} onPress={() => handleCancelOrder(item.id)}>
                    <Text style={styles.cancelBtnText}>{t('orders.cancelOrder', 'Cancel')}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={{ fontSize: 36 }}>📦</Text>
            <Text style={styles.emptyTitle}>{t('orders.noOrders', 'No orders placed yet')}</Text>
            <Text style={styles.emptySub}>Browse marketplace to purchase fresh crop harvest directly from farmers.</Text>
          </View>
        }
      />

      {/* Order Detail Modal */}
      <OrderDetailModal
        visible={Boolean(selectedOrder)}
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />

      {/* Rating Modal */}
      <RatingModal
        visible={Boolean(ratingData)}
        data={ratingData}
        onClose={() => setRatingData(null)}
        onSubmit={() => Alert.alert('Rating Submitted', 'Thank you for rating the farmer!')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabBtnActive: {
    backgroundColor: 'rgba(26, 122, 74, 0.1)',
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  tabBtnTextActive: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  summaryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    marginHorizontal: 14,
    marginTop: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  summaryVal: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.accentGain,
    marginTop: 2,
  },
  orderCountBadge: {
    backgroundColor: COLORS.cardBgLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  orderCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 1,
  },
  orderTop: {
    marginBottom: 10,
  },
  orderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderEmoji: {
    fontSize: 26,
  },
  orderCropName: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  orderSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  orderMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.cardBgLight,
    padding: 10,
    borderRadius: 10,
  },
  metaLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  metaVal: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 2,
  },
  directCallBtn: {
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#81C784',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  directCallText: {
    color: '#2E7D32',
    fontWeight: '800',
    fontSize: 12,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  detailBtn: {
    flex: 1,
    backgroundColor: COLORS.cardBgLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  detailBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
  },
  rateBtn: {
    flex: 1,
    backgroundColor: '#FFF8E1',
    borderWidth: 1,
    borderColor: '#FFE082',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  rateBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B78103',
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.danger,
  },
  emptyBox: {
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 10,
  },
  emptySub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  }
});

export default OrdersScreen;
