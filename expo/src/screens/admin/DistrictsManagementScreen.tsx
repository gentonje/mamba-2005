
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../integrations/supabase/client';

export default function DistrictsManagementScreen() {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newDistrictName, setNewDistrictName] = useState('');
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(null);

  const { data: districts = [], isLoading } = useQuery({
    queryKey: ['admin-districts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('districts')
        .select(`
          *,
          countries(name)
        `)
        .order('name');

      if (error) throw error;
      return data;
    },
  });

  const { data: countries = [] } = useQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .order('name');

      if (error) throw error;
      return data;
    },
  });

  const addDistrictMutation = useMutation({
    mutationFn: async () => {
      if (!newDistrictName || !selectedCountryId) {
        throw new Error('District name and country are required');
      }

      const { error } = await supabase
        .from('districts')
        .insert({
          name: newDistrictName,
          country_id: selectedCountryId,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-districts'] });
      setIsAddModalVisible(false);
      setNewDistrictName('');
      setSelectedCountryId(null);
      Alert.alert('Success', 'District added successfully');
    },
    onError: (error) => {
      Alert.alert('Error', 'Failed to add district');
      console.error('Error adding district:', error);
    },
  });

  const deleteDistrictMutation = useMutation({
    mutationFn: async (districtId: number) => {
      const { error } = await supabase
        .from('districts')
        .delete()
        .eq('id', districtId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-districts'] });
      Alert.alert('Success', 'District deleted successfully');
    },
    onError: (error) => {
      Alert.alert('Error', 'Failed to delete district');
      console.error('Error deleting district:', error);
    },
  });

  const handleDeleteDistrict = (districtId: number, districtName: string) => {
    Alert.alert(
      'Delete District',
      `Are you sure you want to delete "${districtName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteDistrictMutation.mutate(districtId)
        },
      ]
    );
  };

  const handleAddDistrict = () => {
    if (!newDistrictName.trim()) {
      Alert.alert('Error', 'Please enter a district name');
      return;
    }
    if (!selectedCountryId) {
      Alert.alert('Error', 'Please select a country');
      return;
    }
    addDistrictMutation.mutate();
  };

  const renderDistrict = ({ item }: { item: any }) => {
    return (
      <View style={styles.districtItem}>
        <View style={styles.districtInfo}>
          <Text style={styles.districtName}>{item.name}</Text>
          <Text style={styles.countryName}>{item.countries?.name}</Text>
        </View>
        
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteDistrict(item.id, item.name)}
        >
          <Ionicons name="trash" size={20} color="#EF4444" />
        </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Districts Management</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsAddModalVisible(true)}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#6366F1" />
        </View>
      ) : (
        <FlatList
          data={districts}
          renderItem={renderDistrict}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.districtsList}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Modal
        visible={isAddModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New District</Text>
            
            <TextInput
              style={styles.modalInput}
              value={newDistrictName}
              onChangeText={setNewDistrictName}
              placeholder="District name"
            />

            <Text style={styles.modalLabel}>Select Country:</Text>
            <FlatList
              data={countries}
              keyExtractor={(item) => item.id.toString()}
              style={styles.countriesList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.countryOption,
                    selectedCountryId === item.id && styles.selectedCountryOption
                  ]}
                  onPress={() => setSelectedCountryId(item.id)}
                >
                  <Text style={[
                    styles.countryOptionText,
                    selectedCountryId === item.id && styles.selectedCountryOptionText
                  ]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsAddModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addDistrictButton}
                onPress={handleAddDistrict}
                disabled={addDistrictMutation.isPending}
              >
                {addDistrictMutation.isPending ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.addDistrictButtonText}>Add</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    justifyContent: 'space-between',
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
    flex: 1,
  },
  addButton: {
    backgroundColor: '#6366F1',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  districtsList: {
    padding: 16,
  },
  districtItem: {
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
  districtInfo: {
    flex: 1,
  },
  districtName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  countryName: {
    fontSize: 14,
    color: '#6B7280',
  },
  deleteButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  countriesList: {
    maxHeight: 200,
    marginBottom: 16,
  },
  countryOption: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 4,
    backgroundColor: '#F3F4F6',
  },
  selectedCountryOption: {
    backgroundColor: '#6366F1',
  },
  countryOptionText: {
    fontSize: 16,
    color: '#374151',
  },
  selectedCountryOptionText: {
    color: 'white',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#374151',
  },
  addDistrictButton: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: '#6366F1',
    alignItems: 'center',
  },
  addDistrictButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
});
