
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Notification {
  id: string;
  title: string;
  content: string;
  read: boolean;
  created_at: string;
  notification_type?: string;
}

interface NotificationItemProps {
  notification: Notification;
  onPress: () => void;
}

export const NotificationItem = ({ notification, onPress }: NotificationItemProps) => {
  const getNotificationIcon = (type?: string) => {
    switch (type) {
      case 'order':
        return 'receipt-outline';
      case 'product':
        return 'cube-outline';
      case 'message':
        return 'chatbubble-outline';
      case 'system':
        return 'settings-outline';
      default:
        return 'notifications-outline';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, !notification.read && styles.unreadContainer]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Ionicons 
          name={getNotificationIcon(notification.notification_type) as any}
          size={24} 
          color={notification.read ? "#6b7280" : "#6366f1"} 
        />
        {!notification.read && <View style={styles.unreadDot} />}
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={[styles.title, !notification.read && styles.unreadTitle]}>
          {notification.title}
        </Text>
        <Text style={styles.content} numberOfLines={2}>
          {notification.content}
        </Text>
        <Text style={styles.timestamp}>
          {formatDate(notification.created_at)}
        </Text>
      </View>
      
      <View style={styles.arrowContainer}>
        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  unreadContainer: {
    backgroundColor: '#f8fafc',
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
  },
  iconContainer: {
    position: 'relative',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 2,
  },
  unreadDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  unreadTitle: {
    fontWeight: '600',
    color: '#111827',
  },
  content: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#9ca3af',
  },
  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 8,
  },
});
