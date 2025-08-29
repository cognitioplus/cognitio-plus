import React, { useState } from 'react';
import { OnboardingProvider, useOnboarding } from './contexts/UserContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { WelcomeStep } from './components/Onboarding/WelcomeStep';
import { UserTypeStep } from './components/Onboarding/UserTypeStep';
import { OnboardingJourney, IndividualSteps, MHPSteps, CommunitySteps, OrganizationSteps } from './components/Onboarding/OnboardingJourney';
import { Dashboard } from './components/Dashboard';
import { MHPDashboard } from './components/MHPDashboard';
import { LanguageToggle } from './components/LanguageToggle';
import { Header } from './components/Header';
import { BreathingExerciseModal } from './components/BreathingExerciseModal';
import { HRVMeasurement } from './components/HRVMeasurement';
import { SubscriptionPage } from './components/SubscriptionPage';
import { HabitMenu } from './components/HabitMenu';
import { HabitDesigner } from './components/HabitDesigner';
import { GrowthTribeForum } from './components/GrowthTribeForum';
import { saveOnboardingData } from './services/supabase';
import { getRecommendations, getBadgeForUser } from './services/recommendation';

// Custom tailwind keyframes and classes
const customStyles = `
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }

  @keyframes fade-in-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }

  @keyframes pulse-slow {
    0%, 100% { transform: scale(1); opacity: 0.5; }
    50% { transform: scale(1.1); opacity: 0.3; }
  }
  .animate-pulse-slow { animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; }

  @keyframes pulse-medium {
    0%, 100% { transform: scale(1); opacity: 0.7; }
    50% { transform: scale(1.05); opacity: 0.5; }
  }
  .animate-pulse-medium { animation: pulse-medium 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
  
  @keyframes breathing-progress-bar {
    from { width: 0%; }
    to { width: 100%; }
  }
  .animate-breathing-progress { animation: breathing-progress-bar 5.5s linear; }
`;

function OnboardingFlow() {
  const { userType, setUserType, onboardingData, setRecommendations, setBadge, setIsComplete } = useOnboarding();
  const [step, setStep] = useState(0); // 0: Welcome, 1: UserType, 2: Journey

  const handleWelcomeNext = () => setStep(1);
  const handleUserTypeNext = () => {
    if (userType) {
      setStep(2);
    }
  };
  const handleUserTypeBack = () => {
      setUserType(null);
      setStep(0);
  }
  
  const handleJourneyComplete = async () => {
    if (!userType) return;
    
    await saveOnboardingData({ userType, ...onboardingData });

    const finalRecommendations = getRecommendations(userType, onboardingData);
    const finalBadge = getBadgeForUser(userType);
    
    setRecommendations(finalRecommendations);
    setBadge(finalBadge);
    setIsComplete(true);
  };

  const renderContent = () => {
    switch (step) {
      case 0:
        return <WelcomeStep onNext={handleWelcomeNext} />;
      case 1:
        return <UserTypeStep onNext={handleUserTypeNext} onBack={handleUserTypeBack} />;
      case 2:
        if (userType === 'individual') return <OnboardingJourney steps={IndividualSteps} onComplete={handleJourneyComplete} />;
        if (userType === 'mhp') return <OnboardingJourney steps={MHPSteps} onComplete={handleJourneyComplete} />;
        if (userType === 'community') return <OnboardingJourney steps={CommunitySteps} onComplete={handleJourneyComplete} />;
        if (userType === 'organization') return <OnboardingJourney steps={OrganizationSteps} onComplete={handleJourneyComplete} />;
        setStep(1);
        return null;
      default:
        setStep(0);
        return null;
    }
  };
  
  return (
      <div className="w-full transition-all duration-500">
        {renderContent()}
      </div>
  );
}

function AppContent() {
  const { isComplete, userType, activeView } = useOnboarding();
  const [isBreathingModalOpen, setBreathingModalOpen] = useState(false);
  const [isHrvModalOpen, setHrvModalOpen] = useState(false);

  const renderMainContent = () => {
    if (!isComplete) {
      return <OnboardingFlow />;
    }

    switch (activeView) {
      case 'subscription':
        return <SubscriptionPage />;
      case 'habits':
        return <HabitMenu />;
      case 'habit-designer':
        return <HabitDesigner />;
      case 'growth-tribe':
        return <GrowthTribeForum />;
      case 'dashboard':
      default:
        if (userType === 'mhp') {
          return <MHPDashboard />;
        }
        return <Dashboard setBreathingModalOpen={setBreathingModalOpen} setHrvModalOpen={setHrvModalOpen} />;
    }
  };

  return (
    <main className="min-h-screen bg-background-light flex items-center justify-center p-4 sm:p-6 md:p-8 relative font-montserrat">
      <style>{customStyles}</style>
      {isComplete ? <Header /> : <LanguageToggle />}
      
      {renderMainContent()}

      <BreathingExerciseModal isOpen={isBreathingModalOpen} onClose={() => setBreathingModalOpen(false)} />
      <HRVMeasurement isOpen={isHrvModalOpen} onClose={() => setHrvModalOpen(false)} />

    </main>
  )
}


function App() {
  return (
    <OnboardingProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </OnboardingProvider>
  );
}

export default App;
