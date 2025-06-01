
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FilterOptions {
  category: string;
  priceRange: { min: number; max: number };
  sortBy: string;
  inStockOnly: boolean;
}

interface ProductSearchHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

export const ProductSearchHeader: React.FC<ProductSearchHeaderProps> = ({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  const categories = [
    'all', 'electronics', 'clothing', 'home', 'books', 'sports', 'toys', 'other'
  ];

  const sortOptions = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Most Popular', value: 'popular' },
  ];

  const applyFilters = () => {
    onFiltersChange(localFilters);
    setShowFilters(false);
  };

  const resetFilters = () => {
    const defaultFilters = {
      category: 'all',
      priceRange: { min: 0, max: 10000 },
      sortBy: 'newest',
      inStockOnly: false,
    };
    setLocalFilters(defaultFilters);
    onFiltersChange(defaultFilters);
    setShowFilters(false);
  };

  const hasActiveFilters = () => {
    return filters.category !== 'all' || 
           filters.inStockOnly || 
           filters.sortBy !== 'newest' ||
           filters.priceRange.min > 0 || 
           filters.priceRange.max < 10000;
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={onSearchChange}
          />
        </View>
        
        <TouchableOpacity
          style={[styles.filterButton, hasActiveFilters() && styles.filterButtonActive]}
          onPress={() => setShowFilters(true)}
        >
          <Ionicons 
            name="filter" 
            size={20} 
            color={hasActiveFilters() ? '#6366F1' : '#6B7280'} 
          />
          {hasActiveFilters() && <View style={styles.filterDot} />}
        </TouchableOpacity>
      </View>

      <Modal
        visible={showFilters}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Filters</Text>
            <TouchableOpacity onPress={resetFilters}>
              <Text style={styles.modalReset}>Reset</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Category Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Category</Text>
              <View style={styles.categoryGrid}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryChip,
                      localFilters.category === category && styles.categoryChipSelected
                    ]}
                    onPress={() => setLocalFilters({
                      ...localFilters,
                      category
                    })}
                  >
                    <Text style={[
                      styles.categoryChipText,
                      localFilters.category === category && styles.categoryChipTextSelected
                    ]}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Sort By Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Sort By</Text>
              {sortOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.sortOption}
                  onPress={() => setLocalFilters({
                    ...localFilters,
                    sortBy: option.value
                  })}
                >
                  <Text style={styles.sortOptionText}>{option.label}</Text>
                  <Ionicons
                    name={localFilters.sortBy === option.value ? 'radio-button-on' : 'radio-button-off'}
                    size={20}
                    color={localFilters.sortBy === option.value ? '#6366F1' : '#D1D5DB'}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Stock Filter */}
            <View style={styles.filterSection}>
              <TouchableOpacity
                style={styles.stockFilter}
                onPress={() => setLocalFilters({
                  ...localFilters,
                  inStockOnly: !localFilters.inStockOnly
                })}
              >
                <Text style={styles.filterTitle}>Show only in stock items</Text>
                <Ionicons
                  name={localFilters.inStockOnly ? 'checkbox' : 'checkbox-outline'}
                  size={24}
                  color={localFilters.inStockOnly ? '#6366F1' : '#D1D5DB'}
                />
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={applyFilters}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  filterButton: {
    position: 'relative',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  filterButtonActive: {
    backgroundColor: '#EEF2FF',
  },
  filterDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6366F1',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalCancel: {
    fontSize: 16,
    color: '#6B7280',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  modalReset: {
    fontSize: 16,
    color: '#6366F1',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  categoryChipSelected: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#6B7280',
  },
  categoryChipTextSelected: {
    color: '#6366F1',
    fontWeight: '600',
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  sortOptionText: {
    fontSize: 16,
    color: '#374151',
  },
  stockFilter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  applyButton: {
    backgroundColor: '#6366F1',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
