
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getStorageUrl } from '../utils/storage';
import { ProductRating } from './ProductRating';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    description: string;
    price: number;
    currency: string;
    storage_path: string;
    category: string;
    available_quantity: number;
    in_stock: boolean;
    average_rating?: number;
    review_count?: number;
    product_images?: Array<{
      storage_path: string;
      is_main: boolean;
    }>;
  };
  onPress: () => void;
  onAddToWishlist?: () => void;
  isInWishlist?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onAddToWishlist,
  isInWishlist = false,
}) => {
  const getProductImageUrl = () => {
    const mainImage = product.product_images?.find(img => img.is_main);
    return getStorageUrl(mainImage?.storage_path || product.storage_path);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: getProductImageUrl() }}
          style={styles.image}
          defaultSource={require('../assets/placeholder.png')}
        />
        
        {onAddToWishlist && (
          <TouchableOpacity
            style={styles.wishlistButton}
            onPress={onAddToWishlist}
          >
            <Ionicons 
              name={isInWishlist ? "heart" : "heart-outline"} 
              size={20} 
              color={isInWishlist ? "#EF4444" : "#6B7280"} 
            />
          </TouchableOpacity>
        )}

        <View style={styles.stockBadge}>
          <Text style={[
            styles.stockText,
            { color: product.in_stock ? '#059669' : '#DC2626' }
          ]}>
            {product.in_stock ? 'In Stock' : 'Out of Stock'}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>
        
        <Text style={styles.description} numberOfLines={2}>
          {product.description}
        </Text>

        {/* Rating Component */}
        {product.average_rating && product.average_rating > 0 && (
          <View style={styles.ratingContainer}>
            <ProductRating
              rating={product.average_rating}
              reviewCount={product.review_count || 0}
              size="small"
            />
          </View>
        )}

        <View style={styles.footer}>
          <View>
            <Text style={styles.price}>
              {product.currency} {Math.round(product.price).toLocaleString()}
            </Text>
            <Text style={styles.quantity}>
              Qty: {product.available_quantity}
            </Text>
          </View>
          
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{product.category}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  wishlistButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
  },
  stockBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stockText: {
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  ratingContainer: {
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 2,
  },
  quantity: {
    fontSize: 12,
    color: '#6B7280',
  },
  categoryBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    color: '#6B7280',
  },
});
