
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../integrations/supabase/client";
import { Alert } from "react-native";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  user_id: string;
  storage_path: string;
  available_quantity: number;
  in_stock: boolean;
  views?: number;
  product_images?: Array<{
    storage_path: string;
    is_main: boolean;
  }>;
}

export const useProductDetail = (product: Product, selectedCurrency: string = "SSP") => {
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [convertedPrice, setConvertedPrice] = useState<number>(product.price || 0);
  const [activeTab, setActiveTab] = useState("details");
  
  const queryClient = useQueryClient();

  // Set the selected image whenever the product changes
  useEffect(() => {
    // Reset the selected image when product changes
    const mainImagePath = product.product_images?.find(img => img.is_main)?.storage_path || 
      product.product_images?.[0]?.storage_path || '';
    setSelectedImage(mainImagePath);
  }, [product.id, product.product_images]);

  useEffect(() => {
    // For mobile, we'll use simple currency conversion
    const updatePrice = async () => {
      try {
        // Simple conversion logic - in real app you'd use an API
        let converted = product.price || 0;
        if (product.currency !== selectedCurrency) {
          // Basic conversion rates (you'd want to use real rates)
          const rates: { [key: string]: number } = {
            'SSP': 1,
            'USD': 0.0017,
            'EUR': 0.0015,
          };
          const fromRate = rates[product.currency || 'SSP'] || 1;
          const toRate = rates[selectedCurrency] || 1;
          converted = (product.price || 0) * (toRate / fromRate);
        }
        setConvertedPrice(converted);
      } catch (error) {
        console.error("Error converting price:", error);
        setConvertedPrice(product.price || 0);
      }
    };
    updatePrice();
  }, [product.price, product.currency, selectedCurrency]);

  // Get view count directly from product_views table to ensure up-to-date count
  const { data: viewCount, refetch: refetchViewCount } = useQuery({
    queryKey: ['product-views-count', product.id],
    queryFn: async () => {
      // Get distinct viewer count
      const { count, error } = await supabase
        .from('product_views')
        .select('*', { count: 'exact', head: false })
        .eq('product_id', product.id);
      
      if (error) {
        console.error('Error fetching view count:', error);
        return product.views || 0;
      }
      
      return count || 0;
    },
    enabled: !!product.id,
    initialData: product.views || 0,
  });

  const { data: similarProducts, isLoading: isLoadingSimilar } = useQuery({
    queryKey: ['similar-products', product.id, product.category],
    queryFn: async () => {
      if (!product.category) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select('*, product_images(*)')
        .eq('category', product.category)
        .eq('product_status', 'published')
        .eq('in_stock', true)
        .neq('id', product.id)
        .limit(4);
      
      if (error) throw error;
      return data as unknown as Product[];
    },
    enabled: !!product.category,
  });

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('You must be logged in to add items to cart');

      const { error } = await supabase
        .from('cart_items')
        .insert({
          user_id: user.id,
          product_id: product.id,
          quantity: 1,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cartItems'] });
      Alert.alert('Success', 'Added to cart successfully');
    },
    onError: (error) => {
      console.error('Error adding to cart:', error);
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'Failed to add to cart');
      }
    },
  });

  const handleAddToCart = () => {
    if (!product.in_stock) {
      Alert.alert('Error', 'This product is out of stock');
      return;
    }
    addToCartMutation.mutate();
  };

  // Track product view with improved date handling and view counting
  useEffect(() => {
    const trackProductView = async () => {
      try {
        if (!product.id) return;
        
        const { data: { user } } = await supabase.auth.getUser();
        const viewerIdValue = user?.id || null;
        
        // Use a fixed date for logged-in users to ensure one view is counted, ever.
        // For anonymous users, use the current date to count one view per day.
        const today = new Date();
        const view_date = viewerIdValue ? '1970-01-01' : today.toISOString().split('T')[0];
        
        console.log(`Tracking view for product ${product.id} by viewer ${viewerIdValue || 'anonymous'} on ${view_date}`);
        
        // Use upsert with proper view_date
        const { error } = await supabase
          .from('product_views')
          .upsert({
            product_id: product.id,
            viewer_id: viewerIdValue,
            viewed_at: new Date().toISOString(),
            view_date: view_date
          }, {
            onConflict: 'product_id,viewer_id,view_date',
            ignoreDuplicates: true
          });

        if (error) {
          console.error('Error tracking product view:', error);
        } else {
          console.log('Product view tracked successfully');
          // Update the products table view count
          await updateProductViewCount(product.id);
          // Refetch the view count
          refetchViewCount();
        }
      } catch (error) {
        console.warn('Error tracking product view:', error);
      }
    };

    // Update the view count in the products table directly
    const updateProductViewCount = async (productId: string) => {
      try {
        // Get the current count from product_views table
        const { count, error: countError } = await supabase
          .from('product_views')
          .select('*', { count: 'exact', head: false })
          .eq('product_id', productId);
          
        if (countError) {
          console.error('Error getting view count:', countError);
          return;
        }

        // Update the products table with the new count
        const { error: updateError } = await supabase
          .from('products')
          .update({ views: count })
          .eq('id', productId);
          
        if (updateError) {
          console.error('Error updating product view count:', updateError);
        } else {
          console.log(`Updated product ${productId} view count to ${count}`);
        }
      } catch (error) {
        console.error('Error in updateProductViewCount:', error);
      }
    };

    if (product.id) {
      trackProductView();
    }
  }, [product.id]);

  return {
    selectedImage,
    setSelectedImage,
    convertedPrice,
    activeTab,
    setActiveTab,
    similarProducts,
    isLoadingSimilar,
    viewCount,
    addToCartMutation,
    handleAddToCart
  };
};
