import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useOnboarding } from '../contexts/UserContext';
import { IconHeartPulse } from '../constants';
import { PremiumFeatureLock } from './PremiumFeatureLock';

export const InteractiveHRVChart: React.FC = () => {
    const { t } = useLanguage();
    const { hrv, subscriptionTier } = useOnboarding();

    const getHRVStatus = (score: number | null): { text: string; color: string; bgColor: string } => {
        if (score === null) return { text: "N/A", color: "text-gray-500", bgColor: "bg-gray-200" };
        if (score > 70) return { text: t('hrv_status_low'), color: "text-success", bgColor: "bg-success/10" };
        if (score > 50) return { text: t('hrv_status_balanced'), color: "text-warning", bgColor: "bg-warning/10" };
        return { text: t('hrv_status_high'), color: "text-danger", bgColor: "bg-danger/10" };
    };

    const status = getHRVStatus(hrv);

    return (
        <div className="mb-4">
             <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                    <IconHeartPulse className="w-6 h-6 mr-3 text-danger" />
                    <h3 className="text-xl font-oswald font-bold text-text-dark">{t('hrv_chart_title')}</h3>
                </div>
                <div className={`px-3 py-1 rounded-full ${status.bgColor}`}>
                    <span className={`font-roboto font-bold text-sm ${status.color}`}>{status.text}</span>
                </div>
            </div>
            <p className="text-text-light mb-4 text-sm">{t('hrv_chart_desc')}</p>
            <div className="h-40 bg-background-light rounded-lg p-4 border flex items-end justify-center" aria-label="HRV Status Display">
                 {hrv !== null ? (
                    <div className="text-center">
                        <p className="text-text-light text-sm font-roboto">{t('hrv_last_score')}</p>
                        <p className={`text-6xl font-oswald font-bold ${status.color}`}>{hrv} <span className="text-3xl">ms</span></p>
                    </div>
                ) : (
                    <p className="text-text-light">Perform a check-in to see your score.</p>
                )}
            </div>
            {subscriptionTier === 'free' && (
                <div className="mt-4">
                    <PremiumFeatureLock title={t('premium_hrv_history')} />
                </div>
            )}
            {subscriptionTier === 'premium' && (
                 <div className="mt-4 p-4 bg-background-light rounded-lg border text-center animate-fade-in">
                    <p className="font-bold text-text-dark">7-Day HRV Trend</p>
                    <div className="h-24 flex items-center justify-center">
                        <p className="text-text-light text-sm">(Premium chart placeholder)</p>
                    </div>
                </div>
            )}
        </div>
    );
};
