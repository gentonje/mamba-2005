
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './src/contexts/AuthContext';
import { CountryProvider } from './src/contexts/CountryContext';
import { ThemeProvider } from './src/contexts/ThemeContext';

// Import screens
import LoginScreen from './src/screens/auth/LoginScreen';
import ProductsScreen from './src/screens/products/ProductsScreen';
import ProductDetailScreen from './src/screens/products/ProductDetailScreen';
import AddProductScreen from './src/screens/products/AddProductScreen';
import EditProductScreen from './src/screens/products/EditProductScreen';
import MyProductsScreen from './src/screens/products/MyProductsScreen';
import ProfileScreen from './src/screens/profile/ProfileScreen';
import EditProfileScreen from './src/screens/profile/EditProfileScreen';
import CartScreen from './src/screens/cart/CartScreen';
import WishlistScreen from './src/screens/wishlist/WishlistScreen';
import AdminUsersScreen from './src/screens/admin/AdminUsersScreen';
import AccountManagementScreen from './src/screens/admin/AccountManagementScreen';
import DistrictsManagementScreen from './src/screens/admin/DistrictsManagementScreen';

// Import icons
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const queryClient = new QueryClient();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Products') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'MyProducts') {
            iconName = focused ? 'bag' : 'bag-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Wishlist') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Products" component={ProductsScreen} />
      <Tab.Screen name="MyProducts" component={MyProductsScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Wishlist" component={WishlistScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <CountryProvider>
              <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="Login" component={LoginScreen} />
                  <Stack.Screen name="Main" component={TabNavigator} />
                  <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
                  <Stack.Screen name="AddProduct" component={AddProductScreen} />
                  <Stack.Screen name="EditProduct" component={EditProductScreen} />
                  <Stack.Screen name="EditProfile" component={EditProfileScreen} />
                  <Stack.Screen name="AdminUsers" component={AdminUsersScreen} />
                  <Stack.Screen name="AccountManagement" component={AccountManagementScreen} />
                  <Stack.Screen name="DistrictsManagement" component={DistrictsManagementScreen} />
                </Stack.Navigator>
              </NavigationContainer>
              <StatusBar style="auto" />
            </CountryProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
