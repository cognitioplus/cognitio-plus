import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { IMAGES } from '../../constants';

interface WelcomeStepProps {
  onNext: () => void;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext }) => {
  const { t } = useLanguage();
  return (
    <div className="text-center animate-fade-in w-full max-w-2xl">
      <img src={IMAGES.BANNER} alt="Cognitio+ Banner" className="rounded-xl shadow-lg mb-8 w-full object-cover" />

       <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
        <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse-slow"></div>
        <img src={IMAGES.LOGO} alt="Cognitio+ Logo" className="relative w-20 h-20 rounded-full" />
      </div>

      <h1 className="text-4xl md:text-5xl font-oswald font-bold text-text-dark mb-4">{t('welcome_title')}</h1>
      <p className="text-lg text-text-light mb-6 font-roboto">{t('welcome_subtitle')}</p>
      <p className="max-w-xl mx-auto text-md text-text-light/80 mb-8 italic">{t('mission_statement')}</p>
      
      <button 
        onClick={onNext}
        className="bg-primary text-white font-roboto font-bold py-3 px-10 rounded-lg hover:bg-primary-accent transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary/50"
      >
        {t('get_started')}
      </button>
    </div>
  );
};
