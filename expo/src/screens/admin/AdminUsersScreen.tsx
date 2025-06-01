
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../integrations/supabase/client';

export default function AdminUsersScreen() {
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const toggleUserStatusMutation = useMutation({
    mutationFn: async ({ userId, isActive }: { userId: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: !isActive })
        .eq('id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (error) => {
      Alert.alert('Error', 'Failed to update user status');
      console.error('Error updating user status:', error);
    },
  });

  const handleToggleUserStatus = (userId: string, isActive: boolean, fullName: string) => {
    Alert.alert(
      `${isActive ? 'Deactivate' : 'Activate'} User`,
      `Are you sure you want to ${isActive ? 'deactivate' : 'activate'} ${fullName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: isActive ? 'Deactivate' : 'Activate',
          onPress: () => toggleUserStatusMutation.mutate({ userId, isActive })
        },
      ]
    );
  };

  const renderUser = ({ item }: { item: any }) => {
    return (
      <View style={styles.userItem}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.full_name || 'No Name'}</Text>
          <Text style={styles.userEmail}>{item.username || 'No Username'}</Text>
          <Text style={styles.userType}>Type: {item.user_type || 'user'}</Text>
          <Text style={styles.accountType}>Account: {item.account_type}</Text>
        </View>
        
        <View style={styles.userActions}>
          <View style={[
            styles.statusBadge,
            { backgroundColor: item.is_active ? '#10B981' : '#EF4444' }
          ]}>
            <Text style={styles.statusText}>
              {item.is_active ? 'Active' : 'Inactive'}
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleToggleUserStatus(item.id, item.is_active, item.full_name)}
          >
            <Ionicons 
              name={item.is_active ? "ban" : "checkmark-circle"} 
              size={20} 
              color={item.is_active ? "#EF4444" : "#10B981"} 
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Users</Text>
      </View>

      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#6366F1" />
        </View>
      ) : (
        <FlatList
          data={users}
          renderItem={renderUser}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.usersList}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  usersList: {
    padding: 16,
  },
  userItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  userType: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  accountType: {
    fontSize: 12,
    color: '#9CA3AF',
    textTransform: 'capitalize',
  },
  userActions: {
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  actionButton: {
    padding: 8,
  },
});
