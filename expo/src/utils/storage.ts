
export const getStorageUrl = (path: string | null | undefined): string => {
  if (!path) {
    return 'https://via.placeholder.com/400x300?text=No+Image';
  }

  // If it's already a full URL, return it
  if (path.startsWith('http')) {
    return path;
  }

  // For placeholder or demo images
  if (path === 'placeholder.svg' || path.includes('placeholder')) {
    return 'https://via.placeholder.com/400x300?text=Product+Image';
  }

  // Construct Supabase storage URL
  const supabaseUrl = 'https://izolcgjxobgendljwoan.supabase.co';
  return `${supabaseUrl}/storage/v1/object/public/images/${path}`;
};

export const uploadImage = async (uri: string, fileName: string) => {
  // This is a placeholder for image upload functionality
  // In a real implementation, you would upload to Supabase storage
  console.log('Uploading image:', uri, fileName);
  return `uploaded/${fileName}`;
};
