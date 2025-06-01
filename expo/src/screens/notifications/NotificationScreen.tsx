
import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNotifications } from '../../hooks/useNotifications';
import { NotificationItem } from '../../components/notifications/NotificationItem';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';

export default function NotificationScreen({ navigation }: any) {
  const { 
    notifications, 
    unreadCount, 
    isLoading, 
    refetch, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications();

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleMarkAllAsRead = useCallback(() => {
    if (unreadCount > 0) {
      markAllAsRead();
    }
  }, [unreadCount, markAllAsRead]);

  const renderNotification = ({ item }: { item: any }) => (
    <NotificationItem
      notification={item}
      onPress={() => markAsRead(item.id)}
    />
  );

  if (isLoading && notifications.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <LoadingSpinner />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={handleMarkAllAsRead} style={styles.markAllButton}>
            <Text style={styles.markAllButtonText}>Mark All Read</Text>
          </TouchableOpacity>
        )}
      </View>

      {unreadCount > 0 && (
        <View style={styles.unreadBanner}>
          <Text style={styles.unreadText}>
            You have {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
          </Text>
        </View>
      )}

      {notifications.length === 0 ? (
        <EmptyState
          icon="notifications-outline"
          title="No notifications"
          subtitle="You'll see notifications about your orders, products, and activities here."
        />
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          style={styles.notificationsList}
          contentContainerStyle={styles.notificationsContainer}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: '#374151',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  markAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#6366f1',
    borderRadius: 6,
  },
  markAllButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  unreadBanner: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f59e0b',
  },
  unreadText: {
    color: '#92400e',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  notificationsList: {
    flex: 1,
  },
  notificationsContainer: {
    padding: 16,
  },
});
