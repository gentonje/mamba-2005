
import { Heart } from "lucide-react";
import { Button } from "../ui/button";
import { ImageLoader } from "../ImageLoader";
import { Product } from "@/types/product";
import { Session } from "@supabase/supabase-js";
import { memo, useCallback, useState } from "react";
import { AspectRatio } from "../ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";

interface ProductCardImageProps {
  product: Product;
  imageUrl: string;
  session: Session | null;
  isAdmin: boolean;
  isInWishlist?: boolean;
  toggleWishlist: () => void;
  isPending: boolean;
}

export const ProductCardImage = memo(({
  product,
  imageUrl,
  session,
  isAdmin,
  isInWishlist,
  toggleWishlist,
  isPending,
}: ProductCardImageProps) => {
  const [particles, setParticles] = useState<number[]>([]);

  const handleWishlistClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isInWishlist && !isPending) {
      setParticles([1, 2, 3, 4, 5]);
      setTimeout(() => {
        setParticles([]);
      }, 800);
    }
    
    toggleWishlist();
  }, [isInWishlist, isPending, toggleWishlist]);

  return (
    <div className="w-full relative overflow-hidden">
      <AspectRatio ratio={1/1} className="bg-gray-100 dark:bg-gray-800">
        <ImageLoader
          src={imageUrl}
          alt={product.title || ""}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          width={400}
          height={400}
          priority={false}
          glowEffect={true}
        />
      </AspectRatio>
      
      {!product.in_stock && (
        <Badge variant="destructive" className="absolute top-2 right-2 z-10 bg-red-500/90 text-white font-semibold">
          Out of Stock
        </Badge>
      )}
      
      {session && !isAdmin && (
        <div className="absolute top-2 left-2 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/70"
            onClick={handleWishlistClick}
            disabled={isPending}
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart 
              className={`w-4 h-4 transition-colors ${isInWishlist ? 'fill-amber-400 text-amber-400' : 'text-white'}`} 
            />
          </Button>
          
          {particles.map((id) => (
            <div 
              key={`particle-${id}`} 
              className={`heart-particle heart-particle-${id}`} 
            />
          ))}
        </div>
      )}
    </div>
  );
});

ProductCardImage.displayName = 'ProductCardImage';
