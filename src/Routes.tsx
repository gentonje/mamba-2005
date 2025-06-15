import React, { lazy, Suspense, useState, createContext, useContext } from 'react';
import { Routes as RouterRoutes, Route, Navigate, useOutletContext } from 'react-router-dom';
import { PrivateRoute } from '@/components/PrivateRoute';
import { AdminRoute } from '@/components/routes/AdminRoute';
import { SuperAdminRoute } from '@/components/routes/SuperAdminRoute';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingIndicator } from './components/ui/LoadingIndicator';
import { MainLayout } from '@/components/layouts/MainLayout';

// Define outlet context type
type OutletContextType = { selectedCountry: string };

// Hook to use the country context
export const useSelectedCountry = () => {
  return useOutletContext<OutletContextType>();
};

// Lazy load pages for better performance
const Index = lazy(() => import('./pages/Index'));
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const AddProduct = lazy(() => import('./pages/AddProduct'));
const EditProduct = lazy(() => import('./pages/EditProduct'));
const AdminUsers = lazy(() => import('./pages/AdminUsers'));
const AdminManagement = lazy(() => import('./pages/AdminManagement'));
const AdminDistricts = lazy(() => import('./pages/AdminDistricts'));
const AccountManagement = lazy(() => import('./pages/AccountManagement'));
const Cart = lazy(() => import('./pages/Cart'));
const EditProfile = lazy(() => import('./pages/EditProfile'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const MyProducts = lazy(() => import('./pages/MyProducts'));

// Loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center h-screen">
    <LoadingIndicator />
  </div>
);

export const Routes = () => {
  const { session, loading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  // Default to "all" countries instead of a specific country ID
  const [selectedCountry, setSelectedCountry] = useState("all");

  if (loading) {
    return <PageLoader />;
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <RouterRoutes>
        {/* Public Routes */}
        <Route 
          path="/" 
          element={session ? <Navigate to="/products" replace /> : <Navigate to="/login" replace />} 
        />

        {/* Login route - no layout */}
        <Route 
          path="/login" 
          element={session ? <Navigate to="/products" replace /> : <Login />} 
        />

        {/* Routes with Main Layout */}
        <Route 
          element={
            <MainLayout 
              searchQuery={searchQuery} 
              onSearchChange={setSearchQuery}
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
            />
          } 
        >
          <Route
            path="/home"
            element={<Home />}
          />

          {/* Protected Routes */}
          <Route 
            path="/products" 
            element={
              <PrivateRoute>
                <Index selectedCountry={selectedCountry} />
              </PrivateRoute>
            } 
          />
          
          <Route
            path="/my-products"
            element={
              <PrivateRoute>
                <MyProducts />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/add-product"
            element={
              <PrivateRoute>
                <AddProduct />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/edit-product/:id"
            element={
              <PrivateRoute>
                <EditProduct />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/wishlist"
            element={
              <PrivateRoute>
                <Wishlist />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/edit-profile"
            element={
              <PrivateRoute>
                <EditProfile />
              </PrivateRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/users"
            element={
              <PrivateRoute>
                <AdminRoute>
                  <AdminUsers />
                </AdminRoute>
              </PrivateRoute>
            }
          />

          {/* Super Admin Routes */}
          <Route
            path="/admin/manage"
            element={
              <PrivateRoute>
                <SuperAdminRoute>
                  <AdminManagement />
                </SuperAdminRoute>
              </PrivateRoute>
            }
          />
          
          <Route
            path="/admin/accounts"
            element={
              <PrivateRoute>
                <SuperAdminRoute>
                  <AccountManagement />
                </SuperAdminRoute>
              </PrivateRoute>
            }
          />
          
          <Route
            path="/admin/districts"
            element={
              <PrivateRoute>
                <SuperAdminRoute>
                  <AdminDistricts />
                </SuperAdminRoute>
              </PrivateRoute>
            }
          />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </RouterRoutes>
    </Suspense>
  );
};
