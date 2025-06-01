
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import ProductsScreen from '../screens/products/ProductsScreen';
import CartScreen from '../screens/cart/CartScreen';
import WishlistScreen from '../screens/wishlist/WishlistScreen';
import OrdersScreen from '../screens/orders/OrdersScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import MyProductsScreen from '../screens/products/MyProductsScreen';
import ChatScreen from '../screens/chat/ChatScreen';
import NotificationScreen from '../screens/notifications/NotificationScreen';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../hooks/useNotifications';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();

  const NotificationTabIcon = ({ focused, color, size }: any) => (
    <View>
      <Ionicons 
        name={focused ? 'notifications' : 'notifications-outline'} 
        size={size} 
        color={color} 
      />
      {unreadCount > 0 && (
        <View style={{
          position: 'absolute',
          right: -6,
          top: -3,
          backgroundColor: '#ef4444',
          borderRadius: 6,
          minWidth: 12,
          height: 12,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Text style={{
            color: 'white',
            fontSize: 10,
            fontWeight: 'bold',
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Products') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Wishlist') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Orders') {
            iconName = focused ? 'receipt' : 'receipt-outline';
          } else if (route.name === 'MyProducts') {
            iconName = focused ? 'storefront' : 'storefront-outline';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline';
          } else if (route.name === 'Notifications') {
            return <NotificationTabIcon focused={focused} color={color} size={size} />;
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6366F1',
        tabBarInactiveTintColor: '#6B7280',
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Products" 
        component={ProductsScreen}
        options={{ title: 'Products' }}
      />
      
      {user && (
        <>
          <Tab.Screen 
            name="Cart" 
            component={CartScreen}
            options={{ title: 'Cart' }}
          />
          <Tab.Screen 
            name="Wishlist" 
            component={WishlistScreen}
            options={{ title: 'Wishlist' }}
          />
          <Tab.Screen 
            name="Chat" 
            component={ChatScreen}
            options={{ title: 'Assistant' }}
          />
          <Tab.Screen 
            name="Notifications" 
            component={NotificationScreen}
            options={{ title: 'Notifications' }}
          />
          <Tab.Screen 
            name="Orders" 
            component={OrdersScreen}
            options={{ title: 'Orders' }}
          />
          <Tab.Screen 
            name="MyProducts" 
            component={MyProductsScreen}
            options={{ title: 'My Products' }}
          />
          <Tab.Screen 
            name="Profile" 
            component={ProfileScreen}
            options={{ title: 'Profile' }}
          />
        </>
      )}
    </Tab.Navigator>
  );
}
