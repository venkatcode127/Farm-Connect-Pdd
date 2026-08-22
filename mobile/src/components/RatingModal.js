import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';

const DEFAULT_TAGS = [
  '🌱 Fresh & Quality',
  '⚡ Fast Delivery',
  '🤝 Fair Price',
  '📦 Good Packaging',
  '🌾 100% Organic',
  '📞 Responsive'
];

const RatingModal = ({ visible, data, onClose, onSubmit }) => {
  const { t } = useLanguage();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  if (!data) return null;

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSave = () => {
    onSubmit({ rating, comment, tags: selectedTags, targetUser: data.farmerName || data.seller });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>⭐ {t('marketplace.rateFarmer', 'Rate Farmer')}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.subtext}>Rating for: <Text style={{ fontWeight: '700', color: COLORS.text }}>{data.farmerName || data.seller}</Text></Text>

          <ScrollView style={{ marginTop: 16 }}>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map(star => (
                <TouchableOpacity key={star} onPress={() => setRating(star)} activeOpacity={0.7}>
                  <Text style={[styles.starText, { color: star <= rating ? COLORS.accentGold : '#CBD5E1' }]}>★</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.ratingScore}>{rating} / 5 Stars</Text>

            <Text style={styles.sectionLabel}>Select Feedback Tags:</Text>
            <View style={styles.tagsContainer}>
              {DEFAULT_TAGS.map((tag, i) => {
                const active = selectedTags.includes(tag);
                return (
                  <TouchableOpacity
                    key={i}
                    style={[styles.tagBadge, active && styles.tagBadgeActive]}
                    onPress={() => toggleTag(tag)}
                  >
                    <Text style={[styles.tagText, active && styles.tagTextActive]}>{tag}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.sectionLabel}>Comments (Optional):</Text>
            <TextInput
              style={styles.input}
              placeholder="Write your experience with this farmer / produce..."
              multiline
              numberOfLines={3}
              value={comment}
              onChangeText={setComment}
            />

            <TouchableOpacity style={styles.submitBtn} onPress={handleSave} activeOpacity={0.8}>
              <Text style={styles.submitText}>Submit Review</Text>
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
  subtext: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 12,
  },
  starText: {
    fontSize: 36,
  },
  ratingScore: {
    textAlign: 'center',
    fontWeight: '700',
    color: COLORS.accentGain,
    fontSize: 14,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 10,
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  tagBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.cardBgLight,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tagBadgeActive: {
    backgroundColor: 'rgba(26, 122, 74, 0.1)',
    borderColor: COLORS.primary,
  },
  tagText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  tagTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    backgroundColor: COLORS.cardBgLight,
    textAlignVertical: 'top',
    minHeight: 70,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  submitText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  }
});

export default RatingModal;
