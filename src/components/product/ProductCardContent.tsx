
import { Product } from "@/types/product";
import { CardContent, CardTitle } from "../ui/card";
import { SupportedCurrency } from "@/utils/currencyConverter";
import { memo, useEffect, useState } from "react";
import { convertCurrency } from "@/utils/currencyConverter";
import { Badge } from "../ui/badge";

interface ProductCardContentProps {
  product: Product;
  selectedCurrency: SupportedCurrency;
}

export const ProductCardContent = memo(({ 
  product,
  selectedCurrency
}: ProductCardContentProps) => {
  const [convertedPrice, setConvertedPrice] = useState<number>(product.price || 0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const updatePrice = async () => {
      setIsLoading(true);
      try {
        const converted = await convertCurrency(
          product.price || 0,
          (product.currency || "SSP") as SupportedCurrency,
          selectedCurrency
        );
        setConvertedPrice(converted);
      } catch (error) {
        console.error('Error converting price:', error);
        setConvertedPrice(product.price || 0);
      } finally {
        setIsLoading(false);
      }
    };
    
    updatePrice();
  }, [product.price, product.currency, selectedCurrency]);

  const showOriginalPrice = product.currency !== selectedCurrency && product.currency && product.price;

  return (
    <CardContent className="p-2 flex-grow flex flex-col justify-between">
      <div className="flex-grow">
        {product.shop_name && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 truncate font-sans">{product.shop_name}</p>
        )}
        <CardTitle className="text-sm font-semibold leading-snug text-gray-800 dark:text-gray-100 h-[40px] line-clamp-2 font-serif">
          {product.title}
        </CardTitle>
        <div className="flex items-center gap-1 mt-1 flex-wrap">
          {product.category && (
              <Badge variant="secondary" className="text-xs font-medium">{product.category}</Badge>
          )}
          {product.county && (
              <Badge variant="secondary" className="text-xs font-medium">{product.county}</Badge>
          )}
        </div>
      </div>
      
      <div className="mt-2">
        <div className="flex items-baseline gap-2">
            <span className={`text-lg font-bold text-red-600 dark:text-red-500 ${
                isLoading ? 'opacity-50' : ''
            }`}>
                {selectedCurrency} {Math.round(convertedPrice).toLocaleString()}
            </span>
            {showOriginalPrice && (
                <span className="text-sm text-gray-500 line-through">
                {product.currency} {Math.round(product.price || 0).toLocaleString()}
                </span>
            )}
        </div>
        
        {product.views !== undefined && product.views > 0 && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-sans">
            {Math.round(product.views)} Views
          </p>
        )}
      </div>
    </CardContent>
  );
});

ProductCardContent.displayName = 'ProductCardContent';
