
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  images?: string[];
  productDetails?: {
    id: string;
    title: string;
    price: number;
    currency: string;
    location: string;
    inStock: boolean;
  }[];
}

interface ChatMessageProps {
  message: Message;
  onProductClick: (productId: string) => void;
}

export const ChatMessage = ({ message, onProductClick }: ChatMessageProps) => {
  const isUser = message.role === 'user';

  const renderProductDetails = () => {
    if (!message.images || message.images.length === 0) return null;

    return (
      <View style={styles.productContainer}>
        {message.images.map((imageUrl, index) => {
          const productDetail = message.productDetails?.[index] || null;
          return (
            <TouchableOpacity
              key={`${message.id}-image-${index}`}
              style={styles.productCard}
              onPress={() => {
                if (productDetail?.id) {
                  onProductClick(productDetail.id);
                }
              }}
            >
              <Image source={{ uri: imageUrl }} style={styles.productImage} />
              {productDetail && (
                <View style={styles.productInfo}>
                  <Text style={styles.productTitle} numberOfLines={2}>
                    {productDetail.title}
                  </Text>
                  <Text style={styles.productPrice}>
                    {productDetail.price} {productDetail.currency}
                  </Text>
                  <Text style={styles.productLocation}>
                    {productDetail.location}
                  </Text>
                  <Text style={[
                    styles.productStock, 
                    { color: productDetail.inStock ? '#22c55e' : '#ef4444' }
                  ]}>
                    {productDetail.inStock ? 'In Stock' : 'Out of Stock'}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <View style={[styles.messageContainer, isUser ? styles.userMessage : styles.assistantMessage]}>
      <View style={styles.messageHeader}>
        <View style={[styles.avatar, isUser ? styles.userAvatar : styles.assistantAvatar]}>
          <Ionicons 
            name={isUser ? "person" : "chatbubble-ellipses"} 
            size={16} 
            color="#fff" 
          />
        </View>
      </View>
      
      <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.assistantBubble]}>
        <Text style={[styles.messageText, isUser ? styles.userText : styles.assistantText]}>
          {message.content}
        </Text>
        {renderProductDetails()}
        <Text style={styles.timestamp}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: 8,
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  assistantMessage: {
    justifyContent: 'flex-start',
  },
  messageHeader: {
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  userAvatar: {
    backgroundColor: '#6366f1',
  },
  assistantAvatar: {
    backgroundColor: '#6b7280',
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 4,
  },
  userBubble: {
    backgroundColor: '#6366f1',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: '#f3f4f6',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userText: {
    color: '#fff',
  },
  assistantText: {
    color: '#374151',
  },
  timestamp: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'right',
  },
  productContainer: {
    marginTop: 8,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 4,
    padding: 8,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
  },
  productInfo: {
    flex: 1,
    marginLeft: 8,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: '#059669',
    marginTop: 2,
  },
  productLocation: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  productStock: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
});
