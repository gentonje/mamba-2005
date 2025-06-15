
import { Product } from "@/types/product";
import { CardContent, CardTitle } from "../ui/card";
import { SupportedCurrency, convertCurrency } from "@/utils/currencyConverter";
import { memo, useState } from "react";
import { Badge } from "../ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProductCardContentProps {
  product: Product;
}

interface CurrencyData {
  code: string;
  name: string;
  symbol: string | null;
}

export const ProductCardContent = memo(({ product }: ProductCardContentProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [convertedPrices, setConvertedPrices] = useState<Record<string, number>>({});
  const [isConverting, setIsConverting] = useState(false);

  const fallbackCurrencies: CurrencyData[] = [
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "KES", name: "Kenyan Shilling", symbol: "KSh" },
    { code: "SSP", name: "South Sudanese Pound", symbol: "SSP" },
    { code: "RWF", name: "Rwandan Franc", symbol: "RF" },
  ];

  const { data: currencies, isLoading: isLoadingCurrencies } = useQuery({
    queryKey: ['currencies'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('currencies')
          .select('code, name, symbol')
          .eq('status', 'active')
          .order('code');
        if (error) throw error;
        return (!data || data.length === 0) ? fallbackCurrencies : data as CurrencyData[];
      } catch (err) {
        console.error('Failed to fetch currencies:', err);
        return fallbackCurrencies;
      }
    },
    staleTime: 300000, // 5 minutes cache
  });

  const handlePopoverOpenChange = async (open: boolean) => {
    setIsPopoverOpen(open);
    if (open && product.price && product.currency && currencies && Object.keys(convertedPrices).length === 0) {
      setIsConverting(true);
      const conversions: Record<string, number> = {};
      const promises = currencies
        .filter(c => c.code !== product.currency)
        .map(async (currency) => {
          try {
            if (product.price && product.currency) {
              const converted = await convertCurrency(
                product.price,
                product.currency as SupportedCurrency,
                currency.code as SupportedCurrency
              );
              conversions[currency.code] = converted;
            }
          } catch (error) {
            console.error(`Failed to convert price to ${currency.code}`, error);
          }
        });
      
      await Promise.all(promises);
      setConvertedPrices(conversions);
      setIsConverting(false);
    }
  };

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
            <span className="text-base font-medium text-gray-500 dark:text-gray-400">
                {product.currency}
            </span>
            <Popover open={isPopoverOpen} onOpenChange={handlePopoverOpenChange}>
              <PopoverTrigger asChild>
                <button className="p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2">
                {isConverting || isLoadingCurrencies ? (
                  <div className="flex justify-center items-center h-10">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2 pb-1 border-b">Equivalent in</p>
                    {currencies?.filter(c => c.code !== product.currency).map(currency => (
                      <div key={currency.code} className="flex justify-between items-center text-sm px-2 py-1 rounded-md">
                        <span className="font-medium text-gray-800 dark:text-gray-200">{currency.code}</span>
                        <span className="text-gray-600 dark:text-gray-300">
                          {convertedPrices[currency.code]
                            ? Math.round(convertedPrices[currency.code]).toLocaleString()
                            : '...'}
                        </span>
                      </div>
                    ))}
                    {(!currencies || currencies.filter(c => c.code !== product.currency).length === 0) && !isConverting && (
                      <p className="text-xs text-center text-gray-500 dark:text-gray-400 p-2">No other currencies to show.</p>
                    )}
                  </div>
                )}
              </PopoverContent>
            </Popover>
            <span className="text-lg font-bold text-red-600 dark:text-red-500 ml-1">
              {Math.round(product.price || 0).toLocaleString()}
            </span>
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
