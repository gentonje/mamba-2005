import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import ProductList from "@/components/ProductList";
import { ProductFilters } from "@/components/ProductFilters";
import ProductDetail from "@/components/ProductDetail";
import { CategoryFilter } from "@/components/CategoryFilter";
import { RegionSelector } from "@/components/RegionSelector";
import { CountryCarousel } from "@/components/CountryCarousel";
import { Product } from "@/types/product";
import { SupportedCurrency } from "@/utils/currencyConverter";
import { useSelectedCountry } from "@/Routes";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { useCurrencyFix } from "@/hooks/useCurrencyFix";
import { useProducts } from "@/hooks/useProducts";
import { supabase } from "@/integrations/supabase/client";
import { ProductDetailSkeleton } from "@/components/product/detail/ProductDetailSkeleton";
import { CurrencySelector } from "@/components/CurrencySelector";

interface IndexProps {
  selectedCountry?: string;
}

const Index = ({ 
  selectedCountry: propSelectedCountry = "all", // Default to "all"
}: IndexProps) => {
  // Initialize currency fix
  const { isFixing } = useCurrencyFix();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductLoading, setIsProductLoading] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [localSelectedCountry, setLocalSelectedCountry] = useState(propSelectedCountry);
  const [selectedCurrency, setSelectedCurrency] = useState<SupportedCurrency>(
    (localStorage.getItem("selectedCurrency") as SupportedCurrency) || "KES"
  );
  const location = useLocation();
  
  // Get country from context if available
  const countryContext = useSelectedCountry();
  // Use context value if available, otherwise use prop or "all" as default
  const effectiveCountry = countryContext?.selectedCountry || localSelectedCountry || "all";

  useEffect(() => {
    if (propSelectedCountry !== "all" && propSelectedCountry !== localSelectedCountry) {
      setLocalSelectedCountry(propSelectedCountry);
    }
    
    if (countryContext?.selectedCountry && countryContext.selectedCountry !== localSelectedCountry) {
      setLocalSelectedCountry(countryContext.selectedCountry);
    }
  }, [propSelectedCountry, countryContext?.selectedCountry, localSelectedCountry]);

  const handleCurrencyChange = (currency: SupportedCurrency) => {
    setSelectedCurrency(currency);
    localStorage.setItem('selectedCurrency', currency);
    window.dispatchEvent(new CustomEvent('currencyChange', { detail: currency }));
  };

  useEffect(() => {
    const handleCurrencyChange = (event: Event) => {
      const customEvent = event as CustomEvent<SupportedCurrency>;
      if (customEvent.detail !== selectedCurrency) {
        setSelectedCurrency(customEvent.detail);
      }
    };
    window.addEventListener('currencyChange', handleCurrencyChange);
    return () => {
      window.removeEventListener('currencyChange', handleCurrencyChange);
    };
  }, [selectedCurrency]);

  // Use our hook to fetch products with infinite scrolling
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useProducts({
    searchQuery,
    selectedCategory,
    selectedRegion,
    selectedCountry: effectiveCountry,
    sortOrder,
    showOnlyPublished: true,
    limit: 20 // Set a limit of 20 items per page
  });

  const products = data?.pages.flat() || [];

  // Effect to handle loading a product from navigation state
  useEffect(() => {
    // Check if we have a selectedProductId in the location state
    const locationState = location.state as { selectedProductId?: string } | null;
    
    if (locationState?.selectedProductId && locationState.selectedProductId !== selectedProduct?.id) {
      const loadProductDetails = async () => {
        setIsProductLoading(true);
        try {
          const { data, error } = await supabase
            .from('products')
            .select('*, product_images(*), profiles(*)')
            .eq('id', locationState.selectedProductId)
            .single();
            
          if (error) {
            console.error('Error loading product from notification:', error);
          } else if (data) {
            setSelectedProduct(data as unknown as Product);
          }
        } catch (err) {
          console.error('Error fetching product details:', err);
        } finally {
          setIsProductLoading(false);
        }
      };
      
      loadProductDetails();
      
      // Clear the location state to prevent reloading on future navigations
      window.history.replaceState({}, document.title);
    }
  }, [location.state, selectedProduct?.id]);

  const loadMoreProducts = useCallback((node?: Element | null) => {
    if (node && hasNextPage && !isFetchingNextPage) {
      console.log("Loading more products...");
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleSearchChange = (search: string) => {
    setSearchQuery(search);
  };

  const handleRegionChange = (region: string) => {
    console.log("Region changed to:", region);
    setSelectedRegion(region);
  };
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };
  
  const handleCountryChange = (country: string) => {
    console.log("Country changed in Index to:", country);
    if(countryContext?.setSelectedCountry) {
        countryContext.setSelectedCountry(country);
    }
    // Reset region when country changes
    setSelectedRegion("all");
  };

  const getProductImageUrl = (product: Product) => {
    if (
      !product.product_images ||
      product.product_images.length === 0 ||
      !product.product_images[0].storage_path
    ) {
      return "/placeholder.svg";
    }

    return supabase.storage
      .from("images")
      .getPublicUrl(product.product_images[0].storage_path).data.publicUrl;
  };

  if (isProductLoading) {
    return <ProductDetailSkeleton />;
  }

  if (selectedProduct) {
    return (
      <div className="w-full mx-0 px-0 py-0">
        <ProductDetail
          product={selectedProduct}
          onBack={() => setSelectedProduct(null)}
          getProductImageUrl={getProductImageUrl}
          selectedCurrency={selectedCurrency}
          setSelectedProduct={setSelectedProduct}
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div>
        <BreadcrumbNav
          items={[
            { href: "/", label: "Home" },
            { label: "Products", isCurrent: true }
          ]}
        />
        
        <div className="flex flex-col gap-2 mb-4">
          <CountryCarousel
            selectedCountry={effectiveCountry}
            onCountryChange={handleCountryChange}
          />
          <div className="flex flex-row items-center gap-2 w-full">
            <div className="flex-grow">
              <RegionSelector 
                selectedRegion={selectedRegion}
                onRegionChange={handleRegionChange}
                selectedCountry={effectiveCountry}
              />
            </div>
            <CurrencySelector
              value={selectedCurrency}
              onValueChange={handleCurrencyChange}
            />
          </div>
          
          <CategoryFilter 
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
          
          <ProductFilters onSearchChange={handleSearchChange} className="w-full sm:max-w-xs sm:self-end" />
        </div>
      </div>
      
      <div className="mt-1">
        <ProductList
          products={products}
          getProductImageUrl={getProductImageUrl}
          onProductClick={setSelectedProduct}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          observerRef={loadMoreProducts}
        />
      </div>
    </div>
  );
};

export default Index;
