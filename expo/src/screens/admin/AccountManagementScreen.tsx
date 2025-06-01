
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

const accountTypes = ['basic', 'starter', 'premium', 'enterprise'];

export default function AccountManagementScreen() {
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['account-management-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, username, account_type')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const updateAccountTypeMutation = useMutation({
    mutationFn: async ({ userId, accountType }: { userId: string; accountType: string }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ account_type: accountType })
        .eq('id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account-management-users'] });
      Alert.alert('Success', 'Account type updated successfully');
    },
    onError: (error) => {
      Alert.alert('Error', 'Failed to update account type');
      console.error('Error updating account type:', error);
    },
  });

  const handleAccountTypeChange = (userId: string, currentType: string, fullName: string) => {
    Alert.alert(
      'Change Account Type',
      `Select new account type for ${fullName}:`,
      accountTypes.map(type => ({
        text: `${type.charAt(0).toUpperCase() + type.slice(1)}${type === currentType ? ' (Current)' : ''}`,
        onPress: type !== currentType ? () => updateAccountTypeMutation.mutate({ userId, accountType: type }) : undefined,
        style: type === currentType ? 'cancel' : 'default',
      })).concat([{ text: 'Cancel', style: 'cancel' }])
    );
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'basic': return '#6B7280';
      case 'starter': return '#059669';
      case 'premium': return '#DC2626';
      case 'enterprise': return '#7C3AED';
      default: return '#6B7280';
    }
  };

  const renderUser = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity 
        style={styles.userItem}
        onPress={() => handleAccountTypeChange(item.id, item.account_type, item.full_name)}
      >
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.full_name || 'No Name'}</Text>
          <Text style={styles.userEmail}>{item.username || 'No Username'}</Text>
        </View>
        
        <View style={styles.accountTypeContainer}>
          <View style={[
            styles.accountTypeBadge,
            { backgroundColor: getAccountTypeColor(item.account_type) }
          ]}>
            <Text style={styles.accountTypeText}>
              {item.account_type?.charAt(0).toUpperCase() + item.account_type?.slice(1)}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#6B7280" />
        </View>
      </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Account Management</Text>
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
  },
  accountTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountTypeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  accountTypeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});
