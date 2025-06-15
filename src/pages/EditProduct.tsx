import { useNavigate, useParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { EditProductForm } from "@/components/product/edit/EditProductForm";
import { EditProductHeader } from "@/components/product/edit/EditProductHeader";
import { productPageStyles as styles } from "@/styles/productStyles";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { LoadingIndicator } from "@/components/ui/LoadingIndicator";
import { toast } from "sonner";
import { useState } from "react";
import { updateProduct } from "@/services/productService";
import { getCurrencyForCountry } from "@/utils/countryToCurrency";

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!id) throw new Error("Product ID is required");

      const { data: product, error } = await supabase
        .from("products")
        .select(`
          *,
          product_images (
            id,
            storage_path,
            is_main,
            display_order,
            created_at
          )
        `)
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching product:", error);
        throw error;
      }

      if (!product) {
        throw new Error("Product not found");
      }

      console.log("Fetched product from database:", product);

      // Transform product data to include image URLs and ensure proper typing
      const productWithUrls = {
        ...product,
        product_images: product.product_images.map((image) => ({
          ...image,
          publicUrl: supabase.storage.from('images').getPublicUrl(image.storage_path).data.publicUrl
        })),
        county: product.county || null
      };

      // Ensure country_id and country are properly handled for the form
      const typedProduct = productWithUrls as unknown as Product;
      typedProduct.country_id = product.country_id || null;
      typedProduct.country = product.country_id ? String(product.country_id) : null;

      return typedProduct;
    },
    retry: 1
  });

  const handleSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);
      if (!id) throw new Error("Product ID is required");
      
      console.log("Submitting form with county:", formData.county);
      console.log("Submitting form with country:", formData.country);
      
      // Get the appropriate currency for the selected country (in case country changed)
      const currency = getCurrencyForCountry(formData.country);
      console.log(`Using currency ${currency} for country ID ${formData.country}`);
      
      // Ensure country_id is properly converted to number and include currency
      const updatedData = {
        ...formData,
        country_id: formData.country ? Number(formData.country) : null,
        currency: currency, // Update currency based on country
      };
      
      await updateProduct(id, updatedData);
      toast.success("Product updated successfully!");
      
      // Navigate directly instead of using setTimeout
      navigate("/my-products");
      
    } catch (error: any) {
      console.error("Error updating product:", error);
      toast.error(error.message || "Failed to update product");
      setIsSubmitting(false);
    }
  };

  if (error) {
    return (
      <div className={styles.container}>
        <Navigation />
        <div className={styles.mainContent}>
          <div className="text-center text-red-500 mx-1 my-1">
            {error instanceof Error ? error.message : "An error occurred"}
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || !product) {
    return (
      <div className={styles.container}>
        <Navigation />
        <div className={styles.mainContent}>
          <div className="flex items-center justify-center h-full">
            <LoadingIndicator />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Navigation />
      <div className={styles.mainContent}>
        <div className="mx-1 my-1 px-1 py-1">
          <EditProductHeader 
            title="Edit Product" 
            productId={id}
            productTitle={product.title}
          />
          <EditProductForm
            product={product}
            onSubmit={handleSubmit}
            isLoading={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
