
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useMessageHistory, Message, MessageBase } from './useMessageHistory';

export type { Message } from './useMessageHistory';

export const useShoppingAssistant = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { messages, addMessage, clearMessages: clearMessageHistory } = useMessageHistory();

  // Get user profile for personalization
  const [userProfile, setUserProfile] = useState<{
    full_name?: string | null;
    username?: string | null;
  } | null>(null);

  // Fetch user profile for personalization
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('full_name, username')
          .eq('id', user.id)
          .single();
          
        if (profileError) {
          console.error("Error fetching user profile:", profileError);
          return;
        }
        
        if (data) {
          setUserProfile(data);
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };
    
    fetchUserProfile();
  }, [user?.id]);

  // Initialize with a personalized welcome message if no messages exist
  useEffect(() => {
    if (messages.length === 0) {
      const userName = userProfile?.full_name || userProfile?.username || '';
      const greeting = userName ? `Hello ${userName}! ` : "Hello! ";
      
      addMessage({ 
        content: `${greeting}I'm your shopping assistant. How can I help you today? You can ask me about products, prices, or availability in different locations.`, 
        role: 'assistant' 
      });
    }
  }, [userProfile, addMessage, messages.length]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Sending message to assistant:", content);
      
      // Add user message
      addMessage({ content, role: 'user' });
      
      // Convert message history for context
      const messageHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })).slice(-5); // Only include last 5 messages for context
      
      // Add user info for personalization if available
      const userInfo = userProfile ? {
        userName: userProfile.full_name || userProfile.username || undefined,
        userId: user?.id
      } : undefined;
      
      // Call our edge function
      const { data, error: fnError } = await supabase.functions.invoke('chat-assistant', {
        body: { 
          query: content, 
          messageHistory,
          userInfo
        }
      });
      
      if (fnError) {
        console.error("Edge function error:", fnError);
        setError(`Failed to get a response: ${fnError.message || 'Unknown error'}`);
        Alert.alert("Error", "Failed to get a response from the assistant. Please try again.");
        return;
      }
      
      // Add assistant response
      if (data?.response) {
        let cleanResponse = data.response;
        
        // Check if response includes product details and images
        if (data.images && Array.isArray(data.images) && data.productDetails && Array.isArray(data.productDetails)) {
          addMessage({ 
            content: cleanResponse, 
            role: 'assistant',
            images: data.images,
            productDetails: data.productDetails
          });
        } else if (data.images && Array.isArray(data.images)) {
          addMessage({ 
            content: cleanResponse, 
            role: 'assistant',
            images: data.images 
          });
        } else {
          addMessage({ content: cleanResponse, role: 'assistant' });
        }
      } else if (data?.error) {
        setError(data.error);
        Alert.alert("Error", data.error);
      } else {
        setError("Received an empty response from the assistant.");
        Alert.alert("Error", "Received an empty response from the assistant.");
      }
    } catch (err) {
      console.error("Error in assistant hook:", err);
      setError(`An unexpected error occurred: ${err instanceof Error ? err.message : String(err)}`);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [messages, addMessage, userProfile, user?.id]);

  const clearMessages = useCallback(() => {
    clearMessageHistory();
    setError(null);
    
    // Add personalized welcome message back
    const userName = userProfile?.full_name || userProfile?.username || '';
    const greeting = userName ? `Hello ${userName}! ` : "Hello! ";
    
    addMessage({ 
      content: `${greeting}I'm your shopping assistant. How can I help you today? You can ask me about products, prices, or availability in different locations.`, 
      role: 'assistant' 
    });
  }, [addMessage, userProfile, clearMessageHistory]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages
  };
};
