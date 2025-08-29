import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useOnboarding } from '../contexts/UserContext';
import { IconLock, IconSparkles } from '../constants';

export const PremiumFeatureLock: React.FC<{ title?: string }> = ({ title }) => {
    const { t } = useLanguage();
    const { setActiveView } = useOnboarding();

    return (
        <div className="text-center p-6 bg-background-light rounded-lg border-2 border-dashed flex flex-col items-center justify-center animate-fade-in">
            <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mb-4">
                <IconLock className="w-6 h-6 text-secondary" />
            </div>
            <h4 className="text-lg font-oswald font-bold text-text-dark">{title || t('feature_locked')}</h4>
            <p className="text-text-light mt-1 mb-4 max-w-sm text-sm">{t('unlock_now')}</p>
            <button
                onClick={() => setActiveView('subscription')}
                className="flex items-center px-5 py-2 bg-secondary text-text-dark font-roboto font-bold rounded-lg hover:brightness-110 transition-transform transform hover:scale-105"
            >
                <IconSparkles className="w-4 h-4 mr-2" />
                {t('header_upgrade')}
            </button>
        </div>
    );
}
