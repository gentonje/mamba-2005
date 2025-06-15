
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProductCategory } from "@/types/product";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryFilter = ({
  selectedCategory = "all",
  onCategoryChange,
}: CategoryFilterProps) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("categories")
          .select("name")
          .order("name");

        if (error) {
          console.error("Error fetching categories:", error);
          return;
        }

        // Pre-defined categories if the table doesn't have data yet
        const productCategories = Object.values(ProductCategory);
        
        // Make sure we convert to string[] properly
        const fetchedCategories = data?.map(c => c.name as string) || productCategories;
        setCategories(["all", ...fetchedCategories]);

      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-md">
      <div className="flex w-max space-x-2 p-2">
        {loading 
          ? Array.from({ length: 8 }).map((_, i) => (
              <Button key={i} variant="outline" className="rounded-full animate-pulse h-10 w-24 bg-muted" disabled></Button>
            ))
          : categories.map((category) => (
              <Button
                key={category}
                variant="outline"
                onClick={() => onCategoryChange(category)}
                className={cn(
                  "rounded-full transition-all duration-200 ease-in-out shadow-md hover:shadow-lg",
                  selectedCategory === category
                  ? "bg-blue-100 dark:bg-blue-900 border-blue-500 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500 shadow-glow-blue"
                  : ""
                )}
              >
                {category === 'all' ? 'All Categories' : category}
              </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
