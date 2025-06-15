import React, { useEffect, useState } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from "@/lib/utils";
import { useProductExpiryNotifications } from '@/hooks/useProductValidity';

type MainLayoutProps = {
  children?: React.ReactNode;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  selectedCountry?: string;
  setSelectedCountry?: (country: string) => void;
};

// Define the type for our outlet context
type LayoutContextType = {
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
};

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  searchQuery = '',
  onSearchChange,
  selectedCountry = "all", // Always default to "all"
  setSelectedCountry = () => {}, // Provide default empty function
}) => {
  const { session } = useAuth();
  const isAuthenticated = !!session;
  const isMobile = useIsMobile();
  const [internalSelectedCountry, setInternalSelectedCountry] = useState<string>(selectedCountry);
  
  // Initialize product expiry notifications
  useProductExpiryNotifications();
  
  // Use the prop if provided, otherwise use internal state
  const effectiveSelectedCountry = selectedCountry || internalSelectedCountry;
  const effectiveSetSelectedCountry = setSelectedCountry || setInternalSelectedCountry;

  // Handle mobile full screen mode
  useEffect(() => {
    if (isMobile) {
      // Apply full screen mode
      document.documentElement.classList.add('mobile-full-screen');
      
      // Handle iOS devices which need special handling
      if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
        // Set initial height
        setFullScreenHeight();
        
        // Update height on orientation change and resize
        window.addEventListener('resize', setFullScreenHeight);
        window.addEventListener('orientationchange', setFullScreenHeight);
      }
      
      return () => {
        // Clean up
        document.documentElement.classList.remove('mobile-full-screen');
        window.removeEventListener('resize', setFullScreenHeight);
        window.removeEventListener('orientationchange', setFullScreenHeight);
      };
    }
  }, [isMobile]);

  // Helper function to set correct viewport height for iOS
  const setFullScreenHeight = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  // Create context value to pass to children
  const contextValue: LayoutContextType = { 
    selectedCountry: effectiveSelectedCountry, 
    setSelectedCountry: effectiveSetSelectedCountry 
  };

  // Clone children with country context
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { selectedCountry: effectiveSelectedCountry } as any);
    }
    return child;
  });

  return (
    <div className={cn(
      "min-h-screen w-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200",
      isMobile && "h-[100vh] h-[calc(var(--vh,1vh)*100)]" // Use dynamic height on mobile
    )}>
      <Navigation 
        searchQuery={searchQuery} 
        onSearchChange={onSearchChange}
      />
      <div className={cn(
        "w-full pt-16", 
        "pb-4", 
        "sm:pt-16 max-w-none",
        isMobile && "h-[calc(100%-64px)]" // Adjust content area for nav heights
      )}>
        <div className="max-w-7xl mx-auto px-1 sm:px-6 lg:px-8 h-full">
          {childrenWithProps || (
            <Outlet context={contextValue} />
          )}
        </div>
      </div>
    </div>
  );
};
