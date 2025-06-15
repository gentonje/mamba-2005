
import { useEffect, useState, useRef, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CountiesFilterProps {
  selectedCounty: string;
  onCountyChange: (county: string) => void;
  selectedCountry?: string; // Country ID
  showAllOption?: boolean; // New prop to control "All Districts" option
}

export const CountiesFilter = ({
  selectedCounty,
  onCountyChange,
  selectedCountry = "1", // Default to Kenya (id: 1)
  showAllOption = true, // Default to showing "All Districts" option
}: CountiesFilterProps) => {
  const [districts, setDistricts] = useState<{id: number, name: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const previousCountry = useRef(selectedCountry);

  useEffect(() => {
    const fetchDistricts = async () => {
      setLoading(true);
      if (selectedCountry && selectedCountry !== "all") {
        const { data, error } = await supabase
          .from("districts")
          .select("id, name")
          .eq("country_id", Number(selectedCountry))
          .order("name");

        if (error) {
          console.error("Error fetching districts:", error);
          toast.error("Failed to load districts");
          setDistricts([]);
        } else {
          setDistricts(data || []);
        }
      } else {
        setDistricts([]);
      }
      setLoading(false);
    };

    fetchDistricts();
    
    if (previousCountry.current !== selectedCountry) {
      onCountyChange(showAllOption ? "all" : "");
      previousCountry.current = selectedCountry;
    }
  }, [selectedCountry, onCountyChange, showAllOption]);

  const allDistricts = useMemo(() => {
    if (selectedCountry === "all" || !districts.length) return [];
    return showAllOption ? [{id: 0, name: "all"}, ...districts] : districts;
  }, [districts, showAllOption, selectedCountry]);

  const handleDistrictChange = (value: string) => {
    onCountyChange(value);
  };

  if (selectedCountry === 'all') {
    return <div className="flex items-center justify-center h-10 px-4 text-sm text-muted-foreground bg-gray-100 dark:bg-gray-800 rounded-full">Select a country to view districts</div>;
  }

  if (loading) {
    return (
      <ScrollArea className="w-full whitespace-nowrap rounded-md">
        <div className="flex w-max space-x-2 p-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Button key={i} variant="outline" className="rounded-full animate-pulse h-10 w-24 bg-muted" disabled></Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    );
  }

  if (!loading && allDistricts.length === 0) {
     return <div className="flex items-center justify-center h-10 px-4 text-sm text-muted-foreground bg-gray-100 dark:bg-gray-800 rounded-full">No districts found for this country.</div>;
  }

  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-md">
      <div className="flex w-max space-x-2 p-2">
        {allDistricts.map((district) => (
          <Button
            key={district.id}
            variant={selectedCounty === district.name ? "default" : "outline"}
            onClick={() => handleDistrictChange(district.name)}
            className={cn(
              "rounded-full transition-all duration-200 ease-in-out shadow-md hover:shadow-lg",
              selectedCounty === district.name && "shadow-glow-violet ring-2 ring-primary"
            )}
          >
            {district.name === 'all' ? 'All Districts' : district.name}
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
