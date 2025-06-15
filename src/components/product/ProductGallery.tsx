
import { getStorageUrl } from "@/utils/storage";
import { useState, useEffect } from "react";
import { ImageLoader } from "../ImageLoader";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

interface ProductGalleryProps {
  images: { storage_path: string; is_main: boolean }[];
  selectedImage: string;
  onImageSelect: (path: string) => void;
  title: string;
}

export const ProductGallery = ({ images, selectedImage, onImageSelect, title }: ProductGalleryProps) => {
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) {
      return;
    }

    const selectedIndex = images.findIndex(img => img.storage_path === selectedImage);
    if (selectedIndex !== -1 && selectedIndex !== api.selectedScrollSnap()) {
      api.scrollTo(selectedIndex);
    }

    const onSelect = () => {
      const currentImage = images[api.selectedScrollSnap()];
      if (currentImage && currentImage.storage_path !== selectedImage) {
        onImageSelect(currentImage.storage_path);
      }
    };

    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api, images, selectedImage, onImageSelect]);

  if (!images || images.length === 0) {
    return (
      <div className="p-1 md:p-2">
        <div className="aspect-square md:aspect-[4/3] relative overflow-hidden bg-gray-100 dark:bg-gray-800 border-0 rounded-lg">
          <ImageLoader
            src="/placeholder.svg"
            alt={title || "Product placeholder"}
            className="w-full h-full object-contain"
            width={800}
            height={600}
            priority={true}
            glowEffect={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-1 md:p-2">
      <Carousel setApi={setApi} className="w-full relative group">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={image.storage_path}>
              <Card className="border-0 rounded-lg overflow-hidden shadow-none bg-transparent">
                <CardContent className="flex aspect-square items-center justify-center p-0 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <ImageLoader
                    src={getStorageUrl(image.storage_path)}
                    alt={`${title} image ${index + 1}`}
                    className="w-full h-full object-contain"
                    width={800}
                    height={800}
                    priority={index === 0}
                    fallbackSrc="/placeholder.svg"
                    glowEffect={true}
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        {images.length > 1 && (
          <>
            <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </>
        )}
      </Carousel>

      {images.length > 1 && (
        <div className="flex gap-2 justify-center overflow-x-auto py-2 mt-2 scrollbar-hide">
          {images.map((image, index) => (
            <div
              key={image.storage_path}
              className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 overflow-hidden cursor-pointer transition-all rounded-lg ${
                selectedImage === image.storage_path
                  ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                  : 'ring-1 ring-gray-300 dark:ring-gray-700 hover:ring-primary'
              }`}
              onClick={() => api?.scrollTo(index)}
            >
              <ImageLoader
                src={getStorageUrl(image.storage_path)}
                alt={`${title} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                width={80}
                height={80}
                fallbackSrc="/placeholder.svg"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
