import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../integrations/supabase/client';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { ProductCard } from '../../components/ProductCard';
import { ProductSearchHeader } from '../../components/ProductSearchHeader';
import { Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  storage_path: string;
  category: string;
  available_quantity: number;
  user_id: string;
  in_stock: boolean;
  average_rating?: number;
  review_count?: number;
  product_images?: Array<{
    storage_path: string;
    is_main: boolean;
  }>;
}

interface FilterOptions {
  category: string;
  priceRange: { min: number; max: number };
  sortBy: string;
  inStockOnly: boolean;
}

export default function ProductsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'all',
    priceRange: { min: 0, max: 10000 },
    sortBy: 'newest',
    inStockOnly: false,
  });
  
  const { session } = useAuth();
  const navigation = useNavigation();

  const { data: products = [], isLoading, refetch } = useQuery({
    queryKey: ['products', searchQuery, filters],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select(`
          *,
          product_images(*)
        `)
        .eq('product_status', 'published');

      // Apply filters
      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      if (filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }

      if (filters.inStockOnly) {
        query = query.eq('in_stock', true);
      }

      query = query
        .gte('price', filters.priceRange.min)
        .lte('price', filters.priceRange.max);

      // Apply sorting
      switch (filters.sortBy) {
        case 'price_asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price_desc':
          query = query.order('price', { ascending: false });
          break;
        case 'popular':
          query = query.order('views', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Product[];
    },
  });

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail' as never, { productId: product.id } as never);
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      onPress={() => handleProductPress(item)}
    />
  );

  if (!session) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.authPrompt}>
          <Ionicons name="lock-closed-outline" size={64} color="#6B7280" />
          <Text style={styles.authText}>Please sign in to view products</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ProductSearchHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        onFiltersChange={setFilters}
      />

      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#6366F1" />
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.productsList}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refetch} />
          }
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  authPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authText: {
    fontSize: 18,
    color: '#6B7280',
    marginTop: 16,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productsList: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
});
