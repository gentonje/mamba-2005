
import React, { createContext, useContext, useState } from 'react';

interface CountryContextType {
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

export const CountryProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedCountry, setSelectedCountry] = useState('3'); // Default to South Sudan

  return (
    <CountryContext.Provider value={{
      selectedCountry,
      setSelectedCountry,
    }}>
      {children}
    </CountryContext.Provider>
  );
};

export const useSelectedCountry = () => {
  const context = useContext(CountryContext);
  if (context === undefined) {
    throw new Error('useSelectedCountry must be used within a CountryProvider');
  }
  return context;
};
