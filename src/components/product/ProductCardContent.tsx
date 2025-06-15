import { Product } from "@/types/product";
import { CardContent, CardTitle } from "../ui/card";
import { SupportedCurrency, convertCurrency } from "@/utils/currencyConverter";
import { memo, useState, useEffect } from "react";
import { Badge } from "../ui/badge";

interface ProductCardContentProps {
  product: Product;
}

export const ProductCardContent = memo(({ product }: ProductCardContentProps) => {
  const [convertedPrice, setConvertedPrice] = useState<number | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<SupportedCurrency>('KES');

  useEffect(() => {
    const handleCurrencyChange = (event: Event) => {
        const customEvent = event as CustomEvent<SupportedCurrency>;
        setSelectedCurrency(customEvent.detail);
    };

    const currentCurrency = localStorage.getItem("selectedCurrency") as SupportedCurrency;
    if (currentCurrency) {
        setSelectedCurrency(currentCurrency);
    }

    window.addEventListener('currencyChange', handleCurrencyChange);
    return () => {
        window.removeEventListener('currencyChange', handleCurrencyChange);
    };
  }, []);
  useEffect(() => {
    const getConvertedPrice = async () => {
      if (product.price && product.currency) {
        setIsConverting(true);
        try {
          const price = await convertCurrency(
            product.price,
            product.currency as SupportedCurrency,
            selectedCurrency
          );
          setConvertedPrice(price);
        } catch (error) {
          console.error('Failed to convert currency', error);
          setConvertedPrice(product.price); // fallback to original price
        } finally {
          setIsConverting(false);
        }
      } else {
        setConvertedPrice(product.price);
      }
    };
    getConvertedPrice();
  }, [product.price, product.currency, selectedCurrency]);

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
        <div className="flex items-baseline gap-1">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {selectedCurrency}
            </span>
            <span className="text-lg font-bold text-red-600 dark:text-red-500 ml-1">
              {isConverting 
                ? '...' 
                : (convertedPrice !== null ? Math.round(convertedPrice).toLocaleString() : Math.round(product.price || 0).toLocaleString())
              }
            </span>
        </div>
      </div>
    </CardContent>
  );
});

ProductCardContent.displayName = 'ProductCardContent';
