
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../integrations/supabase/client';
import { useAuth } from '../../contexts/AuthContext';

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string;
    avatar_url: string;
  };
}

export default function ProductReviewScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const { productId, productTitle } = route.params as { productId: string; productTitle: string };

  const [newReview, setNewReview] = useState('');
  const [selectedRating, setSelectedRating] = useState(5);

  // Fetch reviews for the product
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles (full_name, avatar_url)
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Review[];
    }
  });

  // Add review mutation
  const addReviewMutation = useMutation({
    mutationFn: async () => {
      if (!session?.user) throw new Error("Must be logged in to review");

      const { error } = await supabase
        .from('reviews')
        .insert({
          product_id: productId,
          rating: selectedRating,
          comment: newReview,
          user_id: session.user.id
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
      setNewReview('');
      setSelectedRating(5);
      Alert.alert('Success', 'Your review has been posted successfully');
    },
    onError: (error) => {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to add review');
    }
  });

  const handleSubmitReview = () => {
    if (!newReview.trim()) {
      Alert.alert('Error', 'Please write a review');
      return;
    }
    addReviewMutation.mutate();
  };

  const renderStars = (rating: number, onPress?: (rating: number) => void) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => onPress?.(star)}
            disabled={!onPress}
          >
            <Ionicons
              name={star <= rating ? 'star' : 'star-outline'}
              size={20}
              color={star <= rating ? '#FCD34D' : '#D1D5DB'}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reviews</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.productInfo}>
          <Text style={styles.productTitle} numberOfLines={2}>
            {productTitle}
          </Text>
          <View style={styles.ratingOverview}>
            {renderStars(Math.round(averageRating))}
            <Text style={styles.ratingText}>
              {averageRating.toFixed(1)} ({reviews.length} reviews)
            </Text>
          </View>
        </View>

        {session?.user && (
          <View style={styles.reviewForm}>
            <Text style={styles.sectionTitle}>Write a Review</Text>
            <View style={styles.ratingSelector}>
              <Text style={styles.ratingLabel}>Your Rating:</Text>
              {renderStars(selectedRating, setSelectedRating)}
            </View>
            <TextInput
              style={styles.reviewInput}
              placeholder="Write your review..."
              value={newReview}
              onChangeText={setNewReview}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <TouchableOpacity
              style={[styles.submitButton, !newReview.trim() && styles.submitButtonDisabled]}
              onPress={handleSubmitReview}
              disabled={!newReview.trim() || addReviewMutation.isPending}
            >
              <Text style={styles.submitButtonText}>
                {addReviewMutation.isPending ? 'Posting...' : 'Post Review'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.reviewsList}>
          <Text style={styles.sectionTitle}>All Reviews</Text>
          {reviews.map((review) => (
            <View key={review.id} style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <View>
                  <Text style={styles.reviewerName}>
                    {review.profiles.full_name || 'Anonymous'}
                  </Text>
                  <View style={styles.reviewMeta}>
                    {renderStars(review.rating)}
                    <Text style={styles.reviewDate}>
                      {formatDate(review.created_at)}
                    </Text>
                  </View>
                </View>
              </View>
              <Text style={styles.reviewComment}>{review.comment}</Text>
            </View>
          ))}
          
          {reviews.length === 0 && !isLoading && (
            <View style={styles.emptyState}>
              <Ionicons name="chatbubble-outline" size={48} color="#9CA3AF" />
              <Text style={styles.emptyText}>No reviews yet</Text>
              <Text style={styles.emptySubtext}>Be the first to review this product!</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  content: {
    flex: 1,
  },
  productInfo: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  ratingOverview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6B7280',
  },
  starsContainer: {
    flexDirection: 'row',
  },
  reviewForm: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  ratingSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingLabel: {
    fontSize: 14,
    color: '#374151',
    marginRight: 8,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: '#6366F1',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  reviewsList: {
    backgroundColor: 'white',
    padding: 16,
  },
  reviewItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingVertical: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  reviewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 8,
  },
  reviewComment: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
});
