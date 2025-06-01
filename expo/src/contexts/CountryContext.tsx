
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../integrations/supabase/client';

interface Country {
  id: number;
  name: string;
  code: string;
}

interface District {
  id: number;
  name: string;
  country_id: number;
}

interface CountryContextType {
  countries: Country[];
  districts: District[];
  selectedCountry: Country | null;
  setSelectedCountry: (country: Country | null) => void;
  getDistrictsByCountry: (countryId: number) => District[];
  loading: boolean;
}

const CountryContext = createContext<CountryContextType>({
  countries: [],
  districts: [],
  selectedCountry: null,
  setSelectedCountry: () => {},
  getDistrictsByCountry: () => [],
  loading: true,
});

export const useCountry = () => {
  const context = useContext(CountryContext);
  if (!context) {
    throw new Error('useCountry must be used within a CountryProvider');
  }
  return context;
};

export const CountryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCountriesAndDistricts();
  }, []);

  const fetchCountriesAndDistricts = async () => {
    try {
      // Fetch countries
      const { data: countriesData, error: countriesError } = await supabase
        .from('countries')
        .select('*')
        .order('name');

      if (countriesError) throw countriesError;

      // Fetch districts
      const { data: districtsData, error: districtsError } = await supabase
        .from('districts')
        .select('*')
        .order('name');

      if (districtsError) throw districtsError;

      setCountries(countriesData || []);
      setDistricts(districtsData || []);
    } catch (error) {
      console.error('Error fetching countries and districts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDistrictsByCountry = (countryId: number): District[] => {
    return districts.filter(district => district.country_id === countryId);
  };

  return (
    <CountryContext.Provider value={{
      countries,
      districts,
      selectedCountry,
      setSelectedCountry,
      getDistrictsByCountry,
      loading,
    }}>
      {children}
    </CountryContext.Provider>
  );
};
