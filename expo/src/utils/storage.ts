
import { supabase } from '../integrations/supabase/client';

export const getStorageUrl = (path: string): string => {
  try {
    if (!path || path.trim() === '') {
      return 'https://via.placeholder.com/300x300?text=No+Image';
    }
    
    const cleanPath = path.trim();
    const { data } = supabase.storage.from('images').getPublicUrl(cleanPath);
    
    if (!data || !data.publicUrl) {
      return 'https://via.placeholder.com/300x300?text=No+Image';
    }
    
    return data.publicUrl;
  } catch (error) {
    console.error('Error getting storage URL:', error);
    return 'https://via.placeholder.com/300x300?text=No+Image';
  }
};

export const validateImageUrl = async (url: string): Promise<boolean> => {
  if (!url || url.includes('placeholder')) {
    return false;
  }
  
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Error validating image URL:', error);
    return false;
  }
};
