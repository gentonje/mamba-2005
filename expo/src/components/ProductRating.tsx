
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ProductRatingProps {
  rating: number;
  reviewCount?: number;
  size?: 'small' | 'medium' | 'large';
  showCount?: boolean;
}

export const ProductRating: React.FC<ProductRatingProps> = ({
  rating,
  reviewCount = 0,
  size = 'medium',
  showCount = true,
}) => {
  const getStarSize = () => {
    switch (size) {
      case 'small': return 12;
      case 'large': return 20;
      default: return 16;
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small': return 11;
      case 'large': return 16;
      default: return 13;
    }
  };

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons
          key={i}
          name="star"
          size={getStarSize()}
          color="#FCD34D"
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Ionicons
          key="half"
          name="star-half"
          size={getStarSize()}
          color="#FCD34D"
        />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons
          key={`empty-${i}`}
          name="star-outline"
          size={getStarSize()}
          color="#D1D5DB"
        />
      );
    }

    return stars;
  };

  return (
    <View style={styles.container}>
      <View style={styles.starsContainer}>
        {renderStars()}
      </View>
      {showCount && (
        <Text style={[styles.ratingText, { fontSize: getTextSize() }]}>
          {rating.toFixed(1)} ({reviewCount})
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 6,
  },
  ratingText: {
    color: '#6B7280',
    fontWeight: '500',
  },
});
