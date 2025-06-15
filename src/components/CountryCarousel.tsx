
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";

interface Country {
  id: number;
  name: string;
  code: string;
}

interface CountryCarouselProps {
  selectedCountry: string;
  onCountryChange: (countryId: string) => void;
}

export const CountryCarousel = ({ selectedCountry, onCountryChange }: CountryCarouselProps) => {
  const { data: countries, isLoading } = useQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("countries")
        .select("id, name, code")
        .order("name");

      if (error) {
        console.error("Error fetching countries:", error);
        toast.error("Failed to load countries");
        return [];
      }
      return data as Country[];
    },
  });

  const allCountries = [{ id: 0, name: 'All Countries', code: 'ALL' }, ...(countries || [])];

  const handleCountryChange = (countryId: number) => {
    onCountryChange(countryId === 0 ? "all" : countryId.toString());
  };
  
  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-md">
      <div className="flex w-max space-x-2 p-2">
        {isLoading 
          ? Array.from({ length: 5 }).map((_, i) => (
              <Button key={i} variant="outline" className="rounded-full animate-pulse h-10 w-28 bg-muted" disabled></Button>
            ))
          : allCountries.map((country) => {
            const isSelected = selectedCountry === (country.id === 0 ? "all" : country.id.toString());
            return (
              <Button
                key={country.id}
                variant="outline"
                onClick={() => handleCountryChange(country.id)}
                className={cn(
                  "rounded-full transition-all duration-200 ease-in-out shadow-md hover:shadow-lg",
                  isSelected && "bg-blue-100 dark:bg-blue-900 border-blue-500 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500 shadow-glow-blue"
                )}
              >
                {country.id === 0 ? (
                  <Globe className="w-4 h-4 mr-2" />
                ) : (
                  <span className="mr-2">{String.fromCodePoint(...[...country.code.toUpperCase()].map(char => char.charCodeAt(0) + 127397))}</span>
                )}
                {country.name}
              </Button>
            )
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
