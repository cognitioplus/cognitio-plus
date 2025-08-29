
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useOnboarding } from '../contexts/UserContext';

interface HRVCheckInProps {
    onMeasureClick: () => void;
}

export const HRVCheckIn: React.FC<HRVCheckInProps> = ({ onMeasureClick }) => {
    const { t } = useLanguage();
    const { hrv } = useOnboarding();
    
    return (
        <div className="mt-auto pt-4 text-center">
            <button
                onClick={onMeasureClick}
                className="w-full bg-primary text-white font-roboto font-bold py-3 px-4 rounded-lg hover:bg-primary-accent transition-transform transform hover:scale-105"
            >
                {hrv === null ? t('hrv_checkin_cta') : `${t('hrv_checkin_cta')} Again`}
            </button>
        </div>
    );
};
