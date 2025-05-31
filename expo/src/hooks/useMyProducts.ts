
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { Alert } from 'react-native';

export const useMyProducts = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(0);
  const queryClient = useQueryClient();
  const PRODUCTS_PER_PAGE = 10;

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['my-products', user?.id, currentPage],
    queryFn: async () => {
      if (!user) return [];

      const startRange = currentPage * PRODUCTS_PER_PAGE;
      const endRange = startRange + PRODUCTS_PER_PAGE - 1;

      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range(startRange, endRange);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: async (productId: string) => {
      // Delete product images first
      await supabase
        .from('product_images')
        .delete()
        .eq('product_id', productId);

      // Then delete the product
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-products'] });
      Alert.alert('Success', 'Product deleted successfully');
    },
    onError: (error) => {
      Alert.alert('Error', 'Failed to delete product');
      console.error('Delete error:', error);
    },
  });

  const handleDelete = async (productId: string) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteMutation.mutate(productId)
        },
      ]
    );
  };

  const isProfileComplete = !!(
    profile?.username && 
    profile?.full_name && 
    profile?.address
  );

  const totalPages = Math.ceil((products?.length || 0) / PRODUCTS_PER_PAGE);

  return {
    products,
    isLoading,
    currentPage,
    totalPages,
    setCurrentPage,
    handleDelete,
    isProfileComplete,
  };
};
