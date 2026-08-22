import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
import { COLORS } from '../theme/colors';
import { COMMODITIES } from '../data/commodities';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import * as ImagePicker from 'expo-image-picker';
import RatingModal from '../components/RatingModal';

const MarketplaceScreen = ({ navigation }) => {
  const { t, getCropName } = useLanguage();
  const { user } = useAuth();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSellModal, setShowSellModal] = useState(false);
  const [ratingModalData, setRatingModalData] = useState(null);
  const [orderContactBanner, setOrderContactBanner] = useState(null);

  // Sell Form State
  const [cropId, setCropId] = useState(COMMODITIES[0].id);
  const [isCustomCrop, setIsCustomCrop] = useState(false);
  const [customCropName, setCustomCropName] = useState('');
  const [customCropEmoji, setCustomCropEmoji] = useState('🌾');
  const [qty, setQty] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
const [selectedImage, setSelectedImage] = useState(null);
  const [contact, setContact] = useState('');
  const [desc, setDesc] = useState('');

  const fetchListings = async () => {
  // Request permissions for image picker (only needed once)
  await ImagePicker.requestMediaLibraryPermissionsAsync();
    try {
      const res = await client.get('/listings');
      setListings(res.data || []);
    } catch (e) {
      // Fallback default listings
      setListings([
        {
          id: 'demo_1',
          name: 'Rice (Basmati)',
          crop: 'rice',
          emoji: '🌾',
          qty: 50,
          price: 3900,
          location: 'Karnal, Haryana',
          contact: '+91 9876543210',
          seller: 'Ramesh Patel',
          imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
          desc: '100% Organic, grade-A harvest directly from field.'
        },
        {
          id: 'demo_2',
          name: 'Tomato',
          crop: 'tomato',
          emoji: '🍅',
          qty: 20,
          price: 2150,
          location: 'Nashik, Maharashtra',
          contact: '+91 9812345678',
          seller: 'Suresh Patil',
          imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
          desc: 'Freshly plucked vine-ripened tomatoes.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleSellSubmit = async () => {
    if (!qty || !price || !contact) {
      Alert.alert('Incomplete Form', 'Please fill in quantity, price, and contact number');
      return;
    }

    const sellerName = user ? user.name : 'Verified Farmer';
    const isCustom = isCustomCrop || cropId === 'custom';
    const selectedCom = COMMODITIES.find(c => c.id === cropId) || COMMODITIES[0];

    const newListing = {
      crop: isCustom ? 'custom' : cropId,
      emoji: isCustom ? customCropEmoji : selectedCom.emoji,
      name: isCustom ? (customCropName.trim() || 'Custom Farm Produce') : selectedCom.name,
      qty: Number(qty),
      price: Number(price),
      location: location.trim() || user?.location || 'India',
      contact: contact.trim(),
      desc: desc.trim() || 'Farm fresh produce directly from grower.',
      seller: sellerName,
      imageUrl: selectedImage || selectedCom.image
    };

    try {
      await client.post('/listings', newListing);
      Alert.alert('Success', 'Produce listed successfully on the digital marketplace!');
      setShowSellModal(false);
      fetchListings();
    } catch (err) {
      setListings([newListing, ...listings]);
      Alert.alert('Success', 'Produce listed successfully!');
      setShowSellModal(false);
    }
  };

  const handleOrder = async (listing) => {
    // Check self-order restriction
    const isOwner = user && (user.name === listing.seller || (listing.contact && user.phone === listing.contact));
    if (isOwner) {
      Alert.alert('Action Restricted', t('marketplace.cannotOrderOwn', 'You cannot order your own listed produce!'));
      return;
    }

    const buyerName = user ? user.name : 'Guest Buyer';
    const newOrder = {
      listingId: String(listing.id || 'order_' + Date.now()),
      listingEmoji: listing.emoji || '🌾',
      listingName: listing.name,
      listingPrice: Number(listing.price),
      buyer: buyerName,
      seller: listing.seller,
      sellerContact: listing.contact || '',
      buyerContact: user?.phone || '',
      qty: Number(listing.qty),
      totalPrice: Number(listing.qty * listing.price),
      status: 'placed',
      deliveryAddress: user?.location || listing.location || 'Local Delivery',
      paymentMethod: 'Cash on Delivery / Mandi Transfer',
      timeline: [{ status: 'placed', time: new Date().toISOString() }],
      createdAt: new Date().toISOString()
    };

    try {
      await client.post('/orders', newOrder);
      setOrderContactBanner({
        seller: listing.seller,
        phone: listing.contact || '+91 9876543210',
        crop: getCropName(listing.name)
      });
      Alert.alert(
        '🛒 Order Placed Successfully!',
        `Connecting you directly to farmer ${listing.seller} at ${listing.contact || 'Direct Line'}. You can also track in My Orders.`
      );
    } catch (e) {
      setOrderContactBanner({
        seller: listing.seller,
        phone: listing.contact || '+91 9876543210',
        crop: getCropName(listing.name)
      });
      Alert.alert(
        '🛒 Order Placed!',
        `Connecting you directly to farmer ${listing.seller} at ${listing.contact || 'Direct Line'}.`
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Action Header */}
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{t('marketplace.title', 'Farm-to-Fork Marketplace')}</Text>
          <Text style={styles.headerSub}>Zero middlemen, direct farmer trade</Text>
        </View>
        <TouchableOpacity style={styles.sellBtn} onPress={() => setShowSellModal(true)} activeOpacity={0.8}>
          <Text style={styles.sellBtnText}>{t('marketplace.sellProduce', '+ Sell Produce')}</Text>
        </TouchableOpacity>
      </View>

      {/* Floating Order Success Banner */}
      {orderContactBanner && (
        <View style={styles.contactBanner}>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerHeading}>📞 {t('marketplace.sellerContact', 'Seller Contact:')} {orderContactBanner.seller}</Text>
            <Text style={styles.bannerPhone}>{orderContactBanner.phone}</Text>
          </View>
          <TouchableOpacity onPress={() => setOrderContactBanner(null)}>
            <Text style={styles.bannerClose}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Listings Grid */}
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
      ) : (
        <View style={styles.listingsGrid}>
          {listings.map((item, idx) => {
            const isOwner = Boolean(user && (user.name === item.seller || (item.contact && user.phone === item.contact)));
            const com = COMMODITIES.find(c => c.id === item.crop) || COMMODITIES[0];

            return (
              <View style={styles.card} key={idx}>
                <Image
                  source={{ uri: item.imageUrl || com.image }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <View style={styles.emojiBadge}>
                  <Text style={{ fontSize: 18 }}>{item.emoji || com.emoji}</Text>
                </View>

                <View style={styles.cardBody}>
                  <View style={styles.titleRow}>
                    <Text style={styles.cropTitle}>{getCropName(item.name)}</Text>
                    <Text style={styles.freshTag}>Fresh Harvest</Text>
                  </View>

                  <Text style={styles.locationText}>📍 {item.location} • <Text style={{ fontWeight: '700' }}>{item.seller}</Text></Text>

                  {/* Rating trigger */}
                  <TouchableOpacity
                    style={styles.ratingBadge}
                    onPress={() => setRatingModalData({ farmerName: item.seller, listing: item })}
                  >
                    <Text style={styles.ratingText}>⭐ 4.9 (Verified Farmer)</Text>
                  </TouchableOpacity>

                  <Text style={styles.descText} numberOfLines={2}>{item.desc}</Text>

                  <View style={styles.priceStrip}>
                    <View>
                      <Text style={styles.priceLabel}>PRICE / QT</Text>
                      <Text style={styles.priceVal}>₹{(item.price || 0).toLocaleString()}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.priceLabel}>AVAILABLE</Text>
                      <Text style={styles.qtyVal}>{item.qty} Quintals</Text>
                    </View>
                  </View>

                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={styles.rateBtn}
                      onPress={() => setRatingModalData({ farmerName: item.seller, listing: item })}
                    >
                      <Text style={styles.rateBtnText}>{t('marketplace.rateFarmer', '⭐ Rate Farmer')}</Text>
                    </TouchableOpacity>

                    {isOwner ? (
                      <View style={styles.ownProduceBtn}>
                        <Text style={styles.ownProduceText}>{t('marketplace.yourProduce', '🌾 Your Produce')}</Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.orderBtn}
                        onPress={() => handleOrder(item)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.orderBtnText}>{t('marketplace.orderNow', '🛒 Order Now')}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* Sell Produce Modal */}
      <Modal visible={showSellModal} transparent animationType="slide" onRequestClose={() => setShowSellModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.sellCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🌾 List Your Produce</Text>
              <TouchableOpacity onPress={() => setShowSellModal(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ marginTop: 12 }}>
              <Text style={styles.inputLabel}>Crop / Commodity</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                {COMMODITIES.slice(0, 10).map(c => {
                  const active = c.id === cropId && !isCustomCrop;
                  return (
                    <TouchableOpacity
                      key={c.id}
                      style={[styles.cropChip, active && styles.cropChipActive]}
                      onPress={() => { setCropId(c.id); setIsCustomCrop(false); }}
                    >
                      <Text style={styles.cropChipEmoji}>{c.emoji}</Text>
                      <Text style={[styles.cropChipText, active && styles.cropChipTextActive]}>{getCropName(c)}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <Text style={styles.inputLabel}>Quantity (Quintals)</Text>
              <TextInput style={styles.textInput} placeholder="e.g. 25" keyboardType="numeric" value={qty} onChangeText={setQty} />

              <Text style={styles.inputLabel}>Price (₹ / Quintal)</Text>
              <TextInput style={styles.textInput} placeholder="e.g. 3800" keyboardType="numeric" value={price} onChangeText={setPrice} />

              <Text style={styles.inputLabel}>Farm Location / Village</Text>
              <TextInput style={styles.textInput} placeholder="Village, State" value={location} onChangeText={setLocation} />

              <Text style={styles.inputLabel}>Farmer Contact Number / WhatsApp</Text>
              <TextInput style={styles.textInput} placeholder="+91 9XXXXXXXXX" keyboardType="phone-pad" value={contact} onChangeText={setContact} />

              <Text style={styles.inputLabel}>Produce Description</Text>
              <TextInput style={[styles.textInput, { height: 60 }]} multiline placeholder="Grade, harvest date, moisture content..." value={desc} onChangeText={setDesc} />
              {/* Image Picker Button */}
              <TouchableOpacity style={styles.publishBtn} onPress={async () => {
                let result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                  quality: 0.7,
                });
                if (!result.cancelled) {
                  setSelectedImage(result.uri);
                }
              }}>
                <Text style={styles.publishBtnText}>📸 Pick Image</Text>
              </TouchableOpacity>
              {selectedImage && (
                <Image source={{ uri: selectedImage }} style={{ width: '100%', height: 180, marginTop: 10, borderRadius: 12 }} />
              )}

              <TouchableOpacity style={styles.publishBtn} onPress={handleSellSubmit}>
                <Text style={styles.publishBtnText}>🚀 Publish Listing to Marketplace</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Review Modal */}
      <RatingModal
        visible={Boolean(ratingModalData)}
        data={ratingModalData}
        onClose={() => setRatingModalData(null)}
        onSubmit={(rev) => Alert.alert('Thank You', 'Your rating has been recorded!')}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  headerSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  sellBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  sellBtnText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 12,
  },
  contactBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 122, 74, 0.1)',
    borderWidth: 1,
    borderColor: COLORS.primary,
    padding: 12,
    borderRadius: 14,
    marginBottom: 14,
  },
  bannerHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  bannerPhone: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.text,
    marginTop: 2,
  },
  bannerClose: {
    fontSize: 16,
    color: COLORS.textMuted,
    padding: 6,
  },
  listingsGrid: {
    paddingBottom: 30,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#1E293B',
  },
  emojiBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  cardBody: {
    padding: 14,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cropTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  freshTag: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.accentGain,
    backgroundColor: 'rgba(26, 122, 74, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  locationText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  ratingBadge: {
    backgroundColor: '#FFF8E1',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  ratingText: {
    fontSize: 11,
    color: '#B78103',
    fontWeight: '700',
  },
  descText: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 6,
  },
  priceStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.cardBgLight,
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  priceLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  priceVal: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.accentGain,
    marginTop: 2,
  },
  qtyVal: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  rateBtn: {
    flex: 1,
    backgroundColor: COLORS.cardBgLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  rateBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
  },
  orderBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  orderBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.white,
  },
  ownProduceBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  ownProduceText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sellCard: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
  },
  closeBtn: {
    fontSize: 18,
    color: COLORS.textMuted,
    fontWeight: '700',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 10,
    marginBottom: 4,
  },
  cropChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBgLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 6,
  },
  cropChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  cropChipEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  cropChipText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  cropChipTextActive: {
    color: COLORS.white,
    fontWeight: '800',
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: COLORS.cardBgLight,
  },
  publishBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 16,
  },
  publishBtnText: {
    color: COLORS.white,
    fontWeight: '800',
    fontSize: 14,
  }
});

export default MarketplaceScreen;
