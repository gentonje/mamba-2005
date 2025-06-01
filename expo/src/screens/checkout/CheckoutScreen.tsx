
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../integrations/supabase/client';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export default function CheckoutScreen({ navigation }: any) {
  const { cartItems, cartTotal, isLoading: cartLoading } = useCart();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    fetchUserProfile();
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setUserProfile(data);
      setShippingAddress(data.address || '');
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const paymentMethods = [
    { id: 'cash', name: 'Cash on Delivery', icon: 'cash-outline' },
    { id: 'mobile', name: 'Mobile Payment', icon: 'phone-portrait-outline' },
    { id: 'bank', name: 'Bank Transfer', icon: 'card-outline' },
  ];

  const handleCheckout = async () => {
    if (!cartItems.length) {
      Alert.alert('Error', 'Your cart is empty');
      return;
    }

    if (!shippingAddress.trim()) {
      Alert.alert('Error', 'Please provide a shipping address');
      return;
    }

    setIsProcessing(true);

    try {
      // Create orders for each cart item
      const orderPromises = cartItems.map(async (item) => {
        const { error } = await supabase
          .from('orders')
          .insert({
            product_id: item.product_id,
            quantity: item.quantity,
            total_amount: item.products.price * item.quantity,
            payment_method: paymentMethod,
            shipping_address: shippingAddress,
            buyer_id: user?.id,
            seller_id: item.products.user_id,
            order_status: 'pending',
          });

        if (error) throw error;
      });

      await Promise.all(orderPromises);

      // Clear cart after successful order
      const { error: clearError } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user?.id);

      if (clearError) throw clearError;

      Alert.alert(
        'Order Placed!',
        'Your order has been placed successfully. You will receive updates on your order status.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Orders'),
          },
        ]
      );
    } catch (error) {
      console.error('Checkout error:', error);
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartLoading) {
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
        <Text style={styles.headerTitle}>Checkout</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {cartItems.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <Text style={styles.itemName}>{item.products.title}</Text>
              <Text style={styles.itemDetails}>
                Qty: {item.quantity} × {item.products.price} {item.products.currency}
              </Text>
              <Text style={styles.itemTotal}>
                {(item.quantity * item.products.price).toFixed(2)} {item.products.currency}
              </Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalAmount}>
              {cartTotal.toFixed(2)} SSP
            </Text>
          </View>
        </View>

        {/* Shipping Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Address</Text>
          <View style={styles.addressContainer}>
            <Text style={styles.addressText}>
              {shippingAddress || 'No address provided'}
            </Text>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentOption,
                paymentMethod === method.id && styles.selectedPaymentOption,
              ]}
              onPress={() => setPaymentMethod(method.id)}
            >
              <Ionicons 
                name={method.icon as any} 
                size={24} 
                color={paymentMethod === method.id ? '#6366f1' : '#6b7280'} 
              />
              <Text style={[
                styles.paymentOptionText,
                paymentMethod === method.id && styles.selectedPaymentOptionText,
              ]}>
                {method.name}
              </Text>
              <View style={[
                styles.radioButton,
                paymentMethod === method.id && styles.selectedRadioButton,
              ]}>
                {paymentMethod === method.id && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Checkout Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.checkoutButton, isProcessing && styles.disabledButton]}
          onPress={handleCheckout}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <LoadingSpinner color="#fff" />
          ) : (
            <>
              <Text style={styles.checkoutButtonText}>Place Order</Text>
              <Text style={styles.checkoutButtonAmount}>
                {cartTotal.toFixed(2)} SSP
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
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
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: '#374151',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  itemDetails: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    minWidth: 80,
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: '500',
    color: '#059669',
    minWidth: 80,
    textAlign: 'right',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    marginTop: 8,
    borderTopWidth: 2,
    borderTopColor: '#e5e7eb',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
  },
  addressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#6366f1',
    borderRadius: 6,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginVertical: 4,
  },
  selectedPaymentOption: {
    borderColor: '#6366f1',
    backgroundColor: '#f8fafc',
  },
  paymentOptionText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#374151',
  },
  selectedPaymentOptionText: {
    color: '#6366f1',
    fontWeight: '500',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadioButton: {
    borderColor: '#6366f1',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6366f1',
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  checkoutButton: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  checkoutButtonAmount: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
