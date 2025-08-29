import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import type { UserType, OnboardingContextType, Service, BadgeInfo, UserView, Habit, TribePostData } from '../types';

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [userType, setUserType] = useState<UserType | null>(null);
  const [onboardingData, setOnboardingData] = useState<Record<string, any>>({});
  const [recommendations, setRecommendations] = useState<Service[]>([]);
  const [badge, setBadge] = useState<BadgeInfo | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [hrv, setHrv] = useState<number | null>(null);
  const [hrvHistory, setHrvHistory] = useState<number[]>([]);
  const [engagementCount, setEngagementCount] = useState(1);
  const [subscriptionTier, setSubscriptionTier] = useState<'free' | 'premium'>('free');
  const [activeView, setActiveView] = useState<UserView>('dashboard');
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitSuggestion, setHabitSuggestion] = useState<string | null>(null);
  const [posts, setPosts] = useState<TribePostData[]>([]);


  // Effect to load state from localStorage on initial mount
  useEffect(() => {
    const storedState = localStorage.getItem('onboardingState');
    if (storedState) {
        try {
            const parsed = JSON.parse(storedState);
            if(parsed.isComplete) {
                setUserType(parsed.userType);
                setOnboardingData(parsed.onboardingData);
                setRecommendations(parsed.recommendations);
                setBadge(parsed.badge);
                setEngagementCount(parsed.engagementCount || 1);
                setHrv(parsed.hrv || null);
                setHrvHistory(parsed.hrvHistory || []);
                setSubscriptionTier(parsed.subscriptionTier || 'free');
                setHabits(parsed.habits || []);
                setHabitSuggestion(parsed.habitSuggestion || null);
                setPosts(parsed.posts || []);
                setIsComplete(true);
            }
        } catch (e) {
            console.error("Failed to parse stored state:", e);
            localStorage.removeItem('onboardingState');
        }
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  // Effect to save state to localStorage whenever it changes after onboarding is complete
  useEffect(() => {
    if (isComplete) {
      try {
        const stateToPersist = {
          userType,
          onboardingData,
          recommendations,
          badge,
          isComplete,
          engagementCount,
          hrv,
          hrvHistory,
          subscriptionTier,
          habits,
          habitSuggestion,
          posts,
        };
        localStorage.setItem('onboardingState', JSON.stringify(stateToPersist));
      } catch (e) {
        console.error("Failed to save state to localStorage:", e);
      }
    }
  }, [isComplete, userType, onboardingData, recommendations, badge, engagementCount, hrv, hrvHistory, subscriptionTier, habits, habitSuggestion, posts]);


  const updateOnboardingData = useCallback((data: Record<string, any>) => {
    setOnboardingData(prevData => ({ ...prevData, ...data }));
  }, []);

  const resetOnboarding = useCallback(() => {
    setUserType(null);
    setOnboardingData({});
    setRecommendations([]);
    setBadge(null);
    setIsComplete(false);
    setHrv(null);
    setHrvHistory([]);
    setEngagementCount(1);
    setSubscriptionTier('free');
    setActiveView('dashboard');
    setHabits([]);
    setHabitSuggestion(null);
    setPosts([]);
    // Clear localStorage on explicit logout/reset
    try {
        localStorage.removeItem('onboardingState');
    } catch (e) {
        console.error("Failed to remove state from localStorage:", e);
    }
  }, []);
  
  const value = { 
    userType, 
    setUserType, 
    onboardingData, 
    updateOnboardingData, 
    resetOnboarding,
    recommendations,
    setRecommendations,
    badge,
    setBadge,
    isComplete,
    setIsComplete,
    hrv,
    setHrv,
    hrvHistory,
    setHrvHistory,
    engagementCount,
    setEngagementCount,
    subscriptionTier,
    setSubscriptionTier,
    activeView,
    setActiveView,
    habits,
    setHabits,
    habitSuggestion,
    setHabitSuggestion,
    posts,
    setPosts,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = (): OnboardingContextType => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
