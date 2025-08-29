import React from 'react';

export type UserType = 'individual' | 'mhp' | 'community' | 'organization';

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface BadgeInfo {
  name: string;
  description: string;
  icon: React.ReactNode;
}

export interface Habit {
  id: string;
  celebration: string;
  motivation: string;
  behavior: string;
  prompt: string;
  isActive: boolean;
  engagementCount: number;
  lastCompleted?: string;
}

export interface PostReply {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface TribePostData {
  id: string;
  authorName: string;
  content: string;
  isAnonymous: boolean;
  engagementScore: number;
  createdAt: string;
  replies: PostReply[];
  likedBy: string[];
}


export type UserView = 'dashboard' | 'subscription' | 'habits' | 'habit-designer' | 'growth-tribe';

export interface OnboardingContextType {
  userType: UserType | null;
  setUserType: (type: UserType | null) => void;
  onboardingData: Record<string, any>;
  updateOnboardingData: (data: Record<string, any>) => void;
  resetOnboarding: () => void;
  recommendations: Service[];
  setRecommendations: (recs: Service[]) => void;
  badge: BadgeInfo | null;
  setBadge: (badge: BadgeInfo | null) => void;
  isComplete: boolean;
  setIsComplete: (status: boolean) => void;
  hrv: number | null;
  setHrv: (hrv: number | null) => void;
  hrvHistory: number[];
  setHrvHistory: React.Dispatch<React.SetStateAction<number[]>>;
  engagementCount: number;
  setEngagementCount: (updater: React.SetStateAction<number>) => void;
  subscriptionTier: 'free' | 'premium';
  setSubscriptionTier: (tier: 'free' | 'premium') => void;
  activeView: UserView;
  setActiveView: (view: UserView) => void;
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  habitSuggestion: string | null;
  setHabitSuggestion: (suggestion: string | null) => void;
  posts: TribePostData[];
  setPosts: React.Dispatch<React.SetStateAction<TribePostData[]>>;
}

export interface OnboardingStep {
  title: string;
  component: React.ComponentType<any>;
}
