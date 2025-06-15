import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { SupportedCurrency, convertCurrency } from "@/utils/currencyConverter";
import { toast } from "sonner";

export const useProductDetail = (product: Product, selectedCurrency: SupportedCurrency = "USD", fetchSimilar: boolean = false) => {
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [convertedPrice, setConvertedPrice] = useState<number>(product.price || 0);
  const [activeTab, setActiveTab] = useState("details");
  
  const queryClient = useQueryClient();

  useEffect(() => {
    // Reset the selected image when product changes
    const mainImagePath = product.product_images?.find(img => img.is_main)?.storage_path || 
      product.product_images?.[0]?.storage_path || '';
    setSelectedImage(mainImagePath);
  }, [product.id, product.product_images]);

  useEffect(() => {
    const updatePrice = async () => {
      try {
        const converted = await convertCurrency(
          product.price || 0,
          (product.currency || "SSP") as SupportedCurrency,
          selectedCurrency
        );
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
        .eq('category', product.category as any)  // Cast to any to avoid type error with enum
        .eq('product_status', 'published')
        .eq('in_stock', true)
        .neq('id', product.id)
        .limit(4);
      
      if (error) throw error;
      return data as unknown as Product[];
    },
    enabled: !!product.category && fetchSimilar,
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
      toast.success('Added to cart successfully');
    },
    onError: (error) => {
      console.error('Error adding to cart:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to add to cart');
      }
    },
  });

  const handleAddToCart = () => {
    if (!product.in_stock) {
      toast.error('This product is out of stock');
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
          // Refetch the view count to update the UI
          refetchViewCount();
        }
      } catch (error) {
        console.warn('Error tracking product view:', error);
      }
    };

    if (product.id) {
      trackProductView();
    }
  }, [product.id, refetchViewCount]);

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
