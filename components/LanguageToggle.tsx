import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'tl' : 'en');
  };

  return (
    <div className="absolute top-4 right-4 z-10">
      <button
        onClick={toggleLanguage}
        className="px-3 py-2 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-full text-lg font-semibold text-gray-700 hover:bg-gray-100 transition-colors shadow-sm"
        aria-label="Toggle Language"
      >
        {language === 'en' ? '🇵🇭' : '🇬🇧'}
      </button>
    </div>
  );
};
