import React from 'react';
import { useOnboarding } from '../contexts/UserContext';
import { useLanguage } from '../contexts/LanguageContext';
import type { UserView } from '../types';
import { IconSeedling } from '../constants';

const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const toggleLanguage = () => setLanguage(language === 'en' ? 'tl' : 'en');
  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-2 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-full text-lg font-semibold text-gray-700 hover:bg-gray-100 transition-colors shadow-sm"
      aria-label="Toggle Language"
    >
      {language === 'en' ? '🇵🇭' : '🇬🇧'}
    </button>
  );
};


export const Header: React.FC = () => {
    const { resetOnboarding, engagementCount, subscriptionTier, activeView, setActiveView } = useOnboarding();
    const { t } = useLanguage();
    const checkInsForNextBadge = 5;
    const progress = Math.min((engagementCount / checkInsForNextBadge) * 100, 100);

    const handleLogout = () => {
        resetOnboarding();
        window.location.reload(); 
    };
    
    const TABS: { id: UserView; label: keyof typeof import('../locales/en').en; icon?: React.ReactNode }[] = [
        { id: 'dashboard', label: 'header_dashboard' },
        { id: 'habits', label: 'header_habits' },
        { id: 'growth-tribe', label: 'header_growth_tribe', icon: <IconSeedling className="w-4 h-4 mr-1.5" /> },
        { id: 'subscription', label: subscriptionTier === 'free' ? 'header_upgrade' : 'header_subscription' },
    ];

    return (
        <header className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20">
            <div className="w-1/3">
                <div className="w-full max-w-xs">
                    <p className="text-xs font-semibold text-text-light mb-1">{t('header_progress')}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                         <div className="bg-success h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            </div>
            
            <div className="absolute left-1/2 top-4 -translate-x-1/2 flex items-center bg-white/80 backdrop-blur-sm p-1 rounded-full shadow-sm border border-gray-200/80">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveView(tab.id)}
                        className={`flex items-center px-4 py-1.5 rounded-full text-sm font-roboto font-semibold transition-colors ${
                            activeView === tab.id
                                ? 'bg-primary text-white shadow'
                                : 'text-text-light hover:text-text-dark'
                        } ${tab.id === 'subscription' && subscriptionTier === 'free' && activeView !== 'subscription' ? 'bg-secondary/80 text-text-dark animate-pulse' : ''}`}
                    >
                        {tab.icon}
                        {t(tab.label)}
                    </button>
                ))}
            </div>

            <div className="w-1/3 flex justify-end items-center space-x-4">
                <LanguageToggle />
                <button 
                    onClick={handleLogout} 
                    className="text-sm font-roboto font-semibold text-text-light hover:text-primary transition-colors"
                >
                    {t('header_logout')}
                </button>
            </div>
        </header>
    );
};
