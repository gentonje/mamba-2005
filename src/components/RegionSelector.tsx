
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { MapPin } from "lucide-react";
import { District } from "@/types/districts";

interface RegionSelectorProps {
  selectedRegion: string;
  onRegionChange: (region: string) => void;
  selectedCountry: string;
  showAllOption?: boolean;
}

export const RegionSelector = ({
  selectedRegion,
  onRegionChange,
  selectedCountry = "all", // Default to "all"
  showAllOption = true,
}: RegionSelectorProps) => {
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(false);
  const previousCountry = useRef(selectedCountry);
  const isInitialized = useRef(false);
  
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        // Only show loading for specific countries, not for "all"
        if (selectedCountry && selectedCountry !== "all") {
          setLoading(true);
        }
        
        console.log("Fetching districts for country ID:", selectedCountry);
        
        // Only fetch districts if a specific country is selected
        if (selectedCountry && selectedCountry !== "all") {
          const { data, error } = await supabase
            .from("districts")
            .select("id, name, country_id")
            .eq("country_id", Number(selectedCountry))
            .order("name");

          if (error) {
            console.error("Error fetching districts:", error);
            toast.error("Failed to load districts");
            setDistricts([]);
            return;
          }

          console.log("Districts data:", data);
          setDistricts(data || []);
        } else {
          setDistricts([]);
        }
      } catch (error) {
        console.error("Failed to fetch districts:", error);
        toast.error("Failed to load districts");
        setDistricts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDistricts();
    
    // Only reset region selection when country actually changes and after initial load
    if (isInitialized.current && previousCountry.current !== selectedCountry) {
      onRegionChange("all");
    }
    
    previousCountry.current = selectedCountry;
    isInitialized.current = true;
  }, [selectedCountry, onRegionChange]);

  const renderTriggerContent = () => {
    if (selectedRegion === "all") {
      return (
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-2" />
          <span>All Districts</span>
        </div>
      );
    } else {
      return selectedRegion;
    }
  };

  const handleRegionChange = (value: string) => {
    console.log("Region changed to:", value);
    onRegionChange(value);
  };

  const isDisabled = !selectedCountry || selectedCountry === "all";
  const placeholderText = selectedCountry === "all" 
    ? "Select country first" 
    : loading 
      ? "Loading districts..." 
      : "Select district";

  return (
    <div className="w-full max-w-xs">
      <Select
        value={selectedRegion}
        onValueChange={handleRegionChange}
        disabled={isDisabled}
      >
        <SelectTrigger className="w-full h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <SelectValue>
            {isDisabled ? (
              placeholderText
            ) : (
              renderTriggerContent()
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          {showAllOption && (
            <SelectItem value="all">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                <span>All Districts</span>
              </div>
            </SelectItem>
          )}
          {districts.map((district) => (
            <SelectItem key={district.id} value={district.name}>
              {district.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
