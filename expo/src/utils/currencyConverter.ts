
import { supabase } from '../integrations/supabase/client';

export type SupportedCurrency = string;

interface CurrencyRate {
  code: string;
  rate: number;
}

let ratesCache: Record<string, number> | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 300000; // 5 minutes

export const refreshCurrencyRates = async (): Promise<void> => {
  lastFetchTime = 0;
  ratesCache = null;
  await getCurrencyRates();
};

const getCurrencyRates = async (): Promise<Record<string, number>> => {
  const currentTime = Date.now();
  
  if (ratesCache && (currentTime - lastFetchTime) < CACHE_DURATION) {
    return ratesCache;
  }

  try {
    const { data, error } = await supabase
      .from('currencies')
      .select('code, rate')
      .eq('status', 'active');

    if (error) {
      console.error('Error fetching currency rates:', error);
      return ratesCache || { USD: 0.0016, SSP: 1 };
    }

    const rates = data.reduce((acc: Record<string, number>, curr: CurrencyRate) => ({
      ...acc,
      [curr.code]: curr.rate
    }), {});

    ratesCache = rates;
    lastFetchTime = currentTime;
    return rates;
  } catch (error) {
    console.error('Error in getCurrencyRates:', error);
    return ratesCache || { USD: 0.0016, SSP: 1 };
  }
};

export const convertCurrency = async (
  amount: number,
  fromCurrency: SupportedCurrency,
  toCurrency: SupportedCurrency
): Promise<number> => {
  try {
    if (fromCurrency === toCurrency) {
      return Math.round(amount);
    }
    
    const rates = await getCurrencyRates();
    
    if (!rates[fromCurrency] || !rates[toCurrency]) {
      console.error('Invalid currency code', { fromCurrency, toCurrency, rates });
      return Math.round(amount);
    }

    const result = Math.round(amount * rates[toCurrency] / rates[fromCurrency]);
    return result;
  } catch (error) {
    console.error('Error converting currency:', error);
    return Math.round(amount);
  }
};

// Initialize rates cache
getCurrencyRates().catch(console.error);
