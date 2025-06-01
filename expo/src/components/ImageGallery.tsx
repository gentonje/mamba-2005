
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getStorageUrl } from '../utils/storage';

interface ImageGalleryProps {
  images: Array<{
    storage_path: string;
    is_main: boolean;
  }>;
  title?: string;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  title = 'Product Images',
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <View style={styles.placeholder}>
        <Ionicons name="image-outline" size={48} color="#D1D5DB" />
        <Text style={styles.placeholderText}>No images available</Text>
      </View>
    );
  }

  const mainImage = images[selectedImageIndex] || images[0];

  return (
    <>
      <View style={styles.container}>
        {/* Main Image */}
        <TouchableOpacity
          style={styles.mainImageContainer}
          onPress={() => setShowFullscreen(true)}
        >
          <Image
            source={{ uri: getStorageUrl(mainImage.storage_path) }}
            style={styles.mainImage}
            resizeMode="cover"
          />
          <View style={styles.zoomIcon}>
            <Ionicons name="expand-outline" size={20} color="white" />
          </View>
        </TouchableOpacity>

        {/* Thumbnail Gallery */}
        {images.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.thumbnailContainer}
            contentContainerStyle={styles.thumbnailContent}
          >
            {images.map((image, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.thumbnail,
                  selectedImageIndex === index && styles.thumbnailSelected
                ]}
                onPress={() => setSelectedImageIndex(index)}
              >
                <Image
                  source={{ uri: getStorageUrl(image.storage_path) }}
                  style={styles.thumbnailImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Fullscreen Modal */}
      <Modal
        visible={showFullscreen}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFullscreen(false)}
      >
        <View style={styles.fullscreenContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowFullscreen(false)}
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>

          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.fullscreenScroll}
            contentOffset={{ x: selectedImageIndex * screenWidth, y: 0 }}
            onMomentumScrollEnd={(event) => {
              const newIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
              setSelectedImageIndex(newIndex);
            }}
          >
            {images.map((image, index) => (
              <View key={index} style={styles.fullscreenImageContainer}>
                <Image
                  source={{ uri: getStorageUrl(image.storage_path) }}
                  style={styles.fullscreenImage}
                  resizeMode="contain"
                />
              </View>
            ))}
          </ScrollView>

          {/* Image Counter */}
          {images.length > 1 && (
            <View style={styles.imageCounter}>
              <Text style={styles.imageCounterText}>
                {selectedImageIndex + 1} / {images.length}
              </Text>
            </View>
          )}
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  placeholder: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 14,
    color: '#9CA3AF',
  },
  mainImageContainer: {
    position: 'relative',
    height: 250,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  zoomIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  thumbnailContainer: {
    marginTop: 8,
  },
  thumbnailContent: {
    paddingHorizontal: 12,
    gap: 8,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbnailSelected: {
    borderColor: '#6366F1',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  fullscreenScroll: {
    flex: 1,
  },
  fullscreenImageContainer: {
    width: screenWidth,
    height: screenHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: screenWidth,
    height: screenHeight * 0.8,
  },
  imageCounter: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  imageCounterText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
});
