
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../integrations/supabase/client';
import { useAuth } from '../../contexts/AuthContext';
import { ImageGallery } from '../../components/ImageGallery';
import { ProductRating } from '../../components/ProductRating';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  available_quantity: number;
  in_stock: boolean;
  user_id: string;
  average_rating?: number;
  review_count?: number;
  product_images?: Array<{
    storage_path: string;
    is_main: boolean;
  }>;
  profiles?: {
    username: string;
    full_name: string;
  };
}

export default function ProductDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const { productId } = route.params as { productId: string };

  const [quantity, setQuantity] = useState(1);

  // Fetch product details
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images(*),
          profiles(username, full_name)
        `)
        .eq('id', productId)
        .single();

      if (error) throw error;
      return data as Product;
    }
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async () => {
      if (!session?.user) throw new Error('You must be logged in to add items to cart');

      const { error } = await supabase
        .from('cart_items')
        .insert({
          user_id: session.user.id,
          product_id: productId,
          quantity,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cartItems'] });
      Alert.alert('Success', 'Added to cart successfully');
    },
    onError: (error) => {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to add to cart');
    },
  });

  // Add to wishlist mutation
  const addToWishlistMutation = useMutation({
    mutationFn: async () => {
      if (!session?.user) throw new Error('You must be logged in');

      const { error } = await supabase
        .from('wishlist_items')
        .insert({
          user_id: session.user.id,
          product_id: productId,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      Alert.alert('Success', 'Added to wishlist');
    },
    onError: (error) => {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to add to wishlist');
    },
  });

  const handleAddToCart = () => {
    if (!product?.in_stock) {
      Alert.alert('Error', 'This product is out of stock');
      return;
    }
    addToCartMutation.mutate();
  };

  const handleViewReviews = () => {
    if (product) {
      navigation.navigate('ProductReview' as never, {
        productId: product.id,
        productTitle: product.title,
      } as never);
    }
  };

  if (isLoading || !product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => addToWishlistMutation.mutate()}
          >
            <Ionicons name="heart-outline" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <ImageGallery images={product.product_images || []} title={product.title} />

        <View style={styles.productInfo}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>{product.title}</Text>
            <Text style={styles.price}>
              {product.currency} {Math.round(product.price).toLocaleString()}
            </Text>
          </View>

          {product.average_rating && product.average_rating > 0 && (
            <TouchableOpacity style={styles.ratingSection} onPress={handleViewReviews}>
              <ProductRating
                rating={product.average_rating}
                reviewCount={product.review_count || 0}
                size="medium"
              />
              <Ionicons name="chevron-forward" size={16} color="#6B7280" />
            </TouchableOpacity>
          )}

          <View style={styles.statusSection}>
            <View style={[
              styles.stockBadge,
              { backgroundColor: product.in_stock ? '#D1FAE5' : '#FEE2E2' }
            ]}>
              <Text style={[
                styles.stockText,
                { color: product.in_stock ? '#059669' : '#DC2626' }
              ]}>
                {product.in_stock ? 'In Stock' : 'Out of Stock'}
              </Text>
            </View>
            <Text style={styles.quantity}>Quantity: {product.available_quantity}</Text>
          </View>

          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          <View style={styles.sellerSection}>
            <Text style={styles.sectionTitle}>Seller</Text>
            <Text style={styles.sellerName}>
              {product.profiles?.full_name || product.profiles?.username || 'Unknown Seller'}
            </Text>
          </View>

          <TouchableOpacity style={styles.reviewsButton} onPress={handleViewReviews}>
            <Text style={styles.reviewsButtonText}>View All Reviews</Text>
            <Ionicons name="chevron-forward" size={16} color="#6366F1" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.quantitySelector}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Ionicons name="remove" size={20} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => setQuantity(Math.min(product.available_quantity, quantity + 1))}
          >
            <Ionicons name="add" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.addToCartButton, !product.in_stock && styles.addToCartButtonDisabled]}
          onPress={handleAddToCart}
          disabled={!product.in_stock || addToCartMutation.isPending}
        >
          <Text style={styles.addToCartText}>
            {addToCartMutation.isPending ? 'Adding...' : 'Add to Cart'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  productInfo: {
    backgroundColor: 'white',
    padding: 16,
  },
  titleSection: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#059669',
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: 8,
  },
  statusSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stockBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 12,
  },
  stockText: {
    fontSize: 14,
    fontWeight: '600',
  },
  quantity: {
    fontSize: 14,
    color: '#6B7280',
  },
  descriptionSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  sellerSection: {
    marginBottom: 16,
  },
  sellerName: {
    fontSize: 16,
    color: '#6366F1',
    fontWeight: '500',
  },
  reviewsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  reviewsButtonText: {
    fontSize: 16,
    color: '#6366F1',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 16,
    color: '#111827',
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: '#6366F1',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  addToCartButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  addToCartText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
