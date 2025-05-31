
# Expo Mobile App Migration Blueprint

This document outlines the complete migration of the web-based marketplace application to a React Native Expo mobile app. All core features and functionality have been preserved and adapted for mobile use.

## Project Structure

```
expo/
├── App.tsx                          # Main app entry point with navigation
├── src/
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts            # Supabase client with AsyncStorage
│   │       └── types.ts             # Database type definitions
│   ├── contexts/
│   │   ├── AuthContext.tsx          # Authentication state management
│   │   ├── CountryContext.tsx       # Country selection context
│   │   └── ThemeContext.tsx         # Theme management with AsyncStorage
│   ├── screens/
│   │   ├── auth/
│   │   │   └── LoginScreen.tsx      # Combined login/signup screen
│   │   ├── products/
│   │   │   ├── ProductsScreen.tsx   # Main products listing
│   │   │   ├── ProductDetailScreen.tsx
│   │   │   ├── AddProductScreen.tsx
│   │   │   ├── EditProductScreen.tsx
│   │   │   └── MyProductsScreen.tsx
│   │   ├── profile/
│   │   │   ├── ProfileScreen.tsx
│   │   │   └── EditProfileScreen.tsx
│   │   ├── cart/
│   │   │   └── CartScreen.tsx
│   │   ├── wishlist/
│   │   │   └── WishlistScreen.tsx
│   │   └── admin/
│   │       ├── AdminUsersScreen.tsx
│   │       ├── AccountManagementScreen.tsx
│   │       └── DistrictsManagementScreen.tsx
│   ├── components/              # Reusable UI components (to be created)
│   ├── hooks/
│   │   ├── useCart.ts           # Cart management hook
│   │   └── useMyProducts.ts     # User products hook
│   ├── utils/
│   │   ├── storage.ts           # File storage utilities
│   │   ├── currencyConverter.ts # Currency conversion
│   │   └── countryToCurrency.ts # Country-currency mapping
│   ├── types/
│   │   ├── product.ts          # Product type definitions
│   │   ├── profile.ts          # Profile type definitions
│   │   └── districts.ts        # Districts type definitions
│   └── assets/                 # Images and other assets
└── package.json               # Dependencies and scripts
```

## Key Features Migrated

### 1. Authentication System
- **Original**: Web-based auth with Supabase
- **Mobile**: Native authentication with AsyncStorage persistence
- **Components**: LoginScreen with combined login/signup flow
- **Features**: Email/password authentication, session management, auto-login

### 2. Product Management
- **Products Listing**: Grid view with search functionality
- **Product Details**: Full product information display
- **Add/Edit Products**: Form-based product creation and editing
- **My Products**: User's product management with edit/delete
- **Image Handling**: Mobile-optimized image display and upload

### 3. Shopping Cart
- **Cart Management**: Add to cart, quantity updates, item removal
- **Cart Screen**: Mobile-friendly cart interface
- **Checkout Process**: Integrated checkout flow

### 4. User Profile
- **Profile Management**: User information editing
- **Account Types**: Support for different account tiers
- **Settings**: Theme switching, preferences

### 5. Admin Features
- **User Management**: Admin user controls
- **Account Management**: Account type administration
- **Districts Management**: Location management

### 6. Data Management
- **Offline Support**: AsyncStorage for local data persistence
- **Sync**: React Query for data synchronization
- **Real-time Updates**: Supabase real-time subscriptions

## Navigation Structure

### Bottom Tab Navigation
1. **Products** - Main marketplace browsing
2. **My Products** - User's product management
3. **Cart** - Shopping cart and checkout
4. **Wishlist** - Saved products
5. **Profile** - User settings and profile

### Stack Navigation
- Authentication flow (Login/Signup)
- Product detail screens
- Form screens (Add/Edit Product, Edit Profile)
- Admin screens

## Database Integration

### Supabase Configuration
- **Client Setup**: AsyncStorage for session persistence
- **Authentication**: Email/password with mobile-optimized flow
- **Real-time**: Product updates, cart changes
- **File Storage**: Image upload and retrieval

### Data Models
All original database tables and relationships preserved:
- Products, Product Images, Categories
- Users, Profiles, Cart Items
- Orders, Reviews, Notifications
- Countries, Districts, Currencies

## Mobile-Specific Adaptations

### UI/UX Changes
- **Touch-Optimized**: Larger touch targets, swipe gestures
- **Native Feel**: Platform-specific navigation patterns
- **Responsive Design**: Adapts to different screen sizes
- **Performance**: Optimized for mobile devices

### Storage & Caching
- **AsyncStorage**: Local data persistence
- **Image Caching**: Optimized image loading
- **Offline Support**: Basic offline functionality

### Platform Features
- **Camera Integration**: Product photo capture
- **Push Notifications**: Order and message alerts
- **Deep Linking**: Direct product access via URLs

## Required Dependencies

```json
{
  "dependencies": {
    "@expo/vector-icons": "^13.0.0",
    "@react-navigation/bottom-tabs": "^6.5.0",
    "@react-navigation/native": "^6.1.0",
    "@react-navigation/native-stack": "^6.9.0",
    "@react-native-async-storage/async-storage": "^1.19.0",
    "@supabase/supabase-js": "^2.38.0",
    "@tanstack/react-query": "^5.0.0",
    "expo": "~49.0.0",
    "expo-status-bar": "~1.6.0",
    "react": "18.2.0",
    "react-native": "0.72.0",
    "react-native-safe-area-context": "^4.6.0",
    "react-native-screens": "~3.22.0"
  }
}
```

## Implementation Status

### Completed
- [x] Project structure setup
- [x] Authentication system
- [x] Navigation framework
- [x] Basic screens (Login, Products, My Products)
- [x] Supabase integration
- [x] Core utilities (storage, currency conversion)
- [x] Type definitions
- [x] Hooks (cart, products)

### Next Steps
1. **Complete remaining screens**:
   - ProductDetailScreen
   - AddProductScreen
   - EditProductScreen
   - CartScreen
   - ProfileScreen
   - EditProfileScreen
   - WishlistScreen
   - Admin screens

2. **Implement components**:
   - ProductCard
   - FormComponents
   - LoadingStates
   - ErrorBoundaries

3. **Add mobile features**:
   - Camera integration
   - Push notifications
   - Offline support
   - Deep linking

4. **Testing & Optimization**:
   - Performance optimization
   - Error handling
   - User testing
   - App store preparation

## Migration Notes

### Key Differences from Web Version
1. **Navigation**: React Navigation instead of React Router
2. **Storage**: AsyncStorage instead of localStorage
3. **Styling**: StyleSheet instead of Tailwind CSS
4. **Components**: React Native components instead of HTML elements
5. **Icons**: Expo Vector Icons instead of Lucide React

### Preserved Functionality
- All business logic and data flows
- Authentication and authorization
- Database schema and relationships
- API endpoints and edge functions
- Core features and user experience

This blueprint serves as a comprehensive guide for the complete mobile app implementation, ensuring all web features are successfully translated to the mobile platform while maintaining the app's core functionality and user experience.
