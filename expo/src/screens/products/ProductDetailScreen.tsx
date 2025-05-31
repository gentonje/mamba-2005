
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../integrations/supabase/client';
import { useAuth } from '../../contexts/AuthContext';
import { getStorageUrl } from '../../utils/storage';
import { convertCurrency } from '../../utils/currencyConverter';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { productId } = route.params as { productId: string };
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [convertedPrice, setConvertedPrice] = useState(0);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images(*),
          profiles(*)
        `)
        .eq('id', productId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('You must be logged in');

      const { error } = await supabase
        .from('cart_items')
        .insert({
          user_id: user.id,
          product_id: productId,
          quantity: 1,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      Alert.alert('Success', 'Added to cart successfully');
      queryClient.invalidateQueries({ queryKey: ['cartItems'] });
    },
    onError: (error) => {
      Alert.alert('Error', 'Failed to add to cart');
      console.error('Error adding to cart:', error);
    },
  });

  useEffect(() => {
    if (product?.price) {
      const updatePrice = async () => {
        try {
          const converted = await convertCurrency(
            product.price,
            product.currency || 'SSP',
            'SSP'
          );
          setConvertedPrice(converted);
        } catch (error) {
          setConvertedPrice(product.price);
        }
      };
      updatePrice();
    }
  }, [product?.price, product?.currency]);

  const handleAddToCart = () => {
    if (!product?.in_stock) {
      Alert.alert('Error', 'This product is out of stock');
      return;
    }
    addToCartMutation.mutate();
  };

  const renderImages = () => {
    const images = product?.product_images || [];
    if (images.length === 0) {
      return (
        <Image 
          source={{ uri: getStorageUrl(product?.storage_path || '') }}
          style={styles.mainImage}
        />
      );
    }

    return (
      <View style={styles.imageContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / width);
            setSelectedImageIndex(index);
          }}
        >
          {images.map((image, index) => (
            <Image
              key={index}
              source={{ uri: getStorageUrl(image.storage_path) }}
              style={styles.mainImage}
            />
          ))}
        </ScrollView>
        
        {images.length > 1 && (
          <View style={styles.imageIndicators}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === selectedImageIndex && styles.activeIndicator
                ]}
              />
            ))}
          </View>
        )}
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#6366F1" />
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.error}>
          <Text>Product not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
      </View>

      <ScrollView style={styles.content}>
        {renderImages()}

        <View style={styles.productInfo}>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.price}>
            {product.currency} {Math.round(convertedPrice).toLocaleString()}
          </Text>
          
          <View style={styles.metaInfo}>
            <Text style={styles.category}>{product.category}</Text>
            <Text style={styles.quantity}>
              Qty: {product.available_quantity}
            </Text>
          </View>

          <Text style={styles.description}>{product.description}</Text>

          {product.profiles && (
            <View style={styles.sellerInfo}>
              <Text style={styles.sellerLabel}>Sold by:</Text>
              <Text style={styles.sellerName}>
                {product.profiles.full_name || product.profiles.username}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.addToCartButton,
            !product.in_stock && styles.disabledButton
          ]}
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
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
  },
  mainImage: {
    width: width,
    height: 300,
    backgroundColor: '#F3F4F6',
  },
  imageIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: 'white',
  },
  productInfo: {
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 12,
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  category: {
    fontSize: 14,
    color: '#6B7280',
  },
  quantity: {
    fontSize: 14,
    color: '#6B7280',
  },
  description: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 16,
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 8,
  },
  sellerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  footer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  addToCartButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  addToCartText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
