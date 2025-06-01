
interface CurrencyRates {
  [key: string]: number;
}

// Mock currency rates - in a real app, these would come from an API
const CURRENCY_RATES: CurrencyRates = {
  SSP: 1,      // South Sudanese Pound (base)
  USD: 0.0015, // US Dollar
  EUR: 0.0014, // Euro
  GBP: 0.0012, // British Pound
};

export const convertCurrency = async (
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<number> => {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  try {
    // Convert to base currency (SSP) first, then to target currency
    const baseAmount = amount / (CURRENCY_RATES[fromCurrency] || 1);
    const convertedAmount = baseAmount * (CURRENCY_RATES[toCurrency] || 1);
    
    return Math.round(convertedAmount * 100) / 100; // Round to 2 decimal places
  } catch (error) {
    console.error('Currency conversion error:', error);
    return amount; // Return original amount on error
  }
};

export const formatCurrency = (amount: number, currency: string): string => {
  return `${currency} ${amount.toLocaleString()}`;
};

export const getSupportedCurrencies = (): string[] => {
  return Object.keys(CURRENCY_RATES);
};
