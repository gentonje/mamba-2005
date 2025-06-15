
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Country {
  id: number;
  name: string;
}

interface CountrySelectorProps {
  selectedCountry: string | null;
  onCountryChange: (countryId: string) => void;
  showAllOption?: boolean;
  disabled?: boolean;
}

export const CountrySelector = ({ selectedCountry, onCountryChange, showAllOption = true, disabled = false }: CountrySelectorProps) => {
  const { data: countries, isLoading } = useQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      const { data, error } = await supabase.from("countries").select("id, name").order("name");
      if (error) {
        toast.error("Failed to load countries");
        return [];
      }
      return data as Country[];
    },
  });

  return (
    <Select
      value={selectedCountry || ""}
      onValueChange={onCountryChange}
      disabled={isLoading || disabled}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select a country" />
      </SelectTrigger>
      <SelectContent>
        {showAllOption && <SelectItem value="all">All Countries</SelectItem>}
        {countries?.map((country) => (
          <SelectItem key={country.id} value={country.id.toString()}>
            {country.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
