import React, { useEffect } from 'react';
import { useOnboarding } from '../contexts/UserContext';
import { useLanguage } from '../contexts/LanguageContext';
import { IconIndividual, IconMHP, IconCommunity, IconOrganization, IconBrainCircuit, IconBadge as BadgeIcon, IconSeedling } from '../constants';
import { getAIInsight, AIInsight } from '../services/ai-insights';
import { getBadgeForEngagement } from '../services/recommendation';
import { HRVCheckIn } from './HRVCheckIn';
import { InteractiveHRVChart } from './InteractiveHRVChart';
import { ServiceBooking } from './ServiceBooking';

const dashboardConfig = {
    individual: { icon: <IconIndividual className="w-16 h-16 text-primary"/>, title: "Individual Dashboard" },
    mhp: { icon: <IconMHP className="w-16 h-16 text-primary"/>, title: "MHP Dashboard" },
    community: { icon: <IconCommunity className="w-16 h-16 text-primary"/>, title: "Community Hub" },
    organization: { icon: <IconOrganization className="w-16 h-16 text-primary"/>, title: "Organization Portal" },
}

interface DashboardProps {
    setBreathingModalOpen: (isOpen: boolean) => void;
    setHrvModalOpen: (isOpen: boolean) => void;
}

interface IndividualDashboardProps {
     setBreathingModalOpen: (isOpen: boolean) => void;
    setHrvModalOpen: (isOpen: boolean) => void;
}

const IndividualDashboardContent: React.FC<IndividualDashboardProps> = ({ setBreathingModalOpen, setHrvModalOpen }) => {
    const { onboardingData, hrv, engagementCount, subscriptionTier, setActiveView, setHabitSuggestion } = useOnboarding();
    const { t } = useLanguage();
    
    const checkInsForNextBadge = 5; // Increased for more dynamic progress
    const progressPercentage = Math.min((engagementCount / checkInsForNextBadge) * 100, 100);
    
    const moodValue = parseInt((onboardingData.mood || '').split('_').pop() || '3', 10);
    const aiInsight: AIInsight = getAIInsight({ mood: moodValue, hrv: hrv, tier: subscriptionTier });

    const handleHabitSuggestionClick = () => {
        if (aiInsight.habitSuggestion) {
            setHabitSuggestion(aiInsight.habitSuggestion);
            setActiveView('habit-designer');
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col justify-between">
               <InteractiveHRVChart />
               <HRVCheckIn onMeasureClick={() => setHrvModalOpen(true)} />
            </div>

            <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <div className="flex items-center mb-2">
                        <IconBrainCircuit className="w-6 h-6 mr-3 text-primary-accent" />
                        <h3 className="text-xl font-oswald font-bold text-text-dark">{t('ai_insight_title')}</h3>
                        {subscriptionTier === 'premium' && <span className="ml-auto text-xs font-bold bg-secondary/50 text-text-dark px-2 py-0.5 rounded-full">{t('premium_feature')}</span>}
                    </div>
                    <p className="text-text-light italic">"{aiInsight.text}"</p>
                    {aiInsight.action === 'breathing' && (
                        <button onClick={() => setBreathingModalOpen(true)} className="mt-4 w-full bg-primary/10 text-primary font-bold py-2 px-4 rounded-lg hover:bg-primary/20 transition">
                            {t('breathing_exercise_cta')}
                        </button>
                    )}
                    {aiInsight.habitSuggestion && (
                         <button onClick={handleHabitSuggestionClick} className="mt-4 w-full bg-yellow-400/20 text-yellow-700 font-bold py-2 px-4 rounded-lg hover:bg-yellow-400/40 transition">
                             {t('habit_designer_ai_cta')}
                         </button>
                    )}
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <div className="flex items-center mb-2">
                        <BadgeIcon className="w-6 h-6 mr-3 text-secondary" />
                        <h3 className="text-xl font-oswald font-bold text-text-dark">{t('gamification_title')}</h3>
                    </div>
                    <p className="text-text-light mb-3">
                        <span className="font-bold text-primary">{Math.max(0, checkInsForNextBadge - engagementCount)}</span> {t('gamification_desc')}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-success h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                </div>

                 <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 cursor-pointer hover:shadow-xl hover:border-primary/50 transition" onClick={() => setActiveView('habits')}>
                    <div className="flex items-center mb-2">
                        <IconSeedling className="w-6 h-6 mr-3 text-green-500" />
                        <h3 className="text-xl font-oswald font-bold text-text-dark">{t('habit_designer_title')}</h3>
                    </div>
                    <p className="text-text-light">{t('habit_designer_dashboard_cta')}</p>
                </div>
            </div>
            
             <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <ServiceBooking />
            </div>
        </div>
    );
};

const CommunityDashboardContent = () => {
    const { t } = useLanguage();
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-xl font-oswald font-bold text-text-dark">{t('community_dashboard_circles_title')}</h3>
                <p className="text-text-light mt-2">{t('community_dashboard_circles_desc')}</p>
                <button className="mt-4 bg-primary text-white font-roboto font-bold py-2 px-4 rounded-lg hover:bg-primary-accent transition">
                    {t('community_dashboard_circles_cta')}
                </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-xl font-oswald font-bold text-text-dark">{t('community_dashboard_training_title')}</h3>
                <p className="text-text-light mt-2">{t('community_dashboard_training_desc')}</p>
                 <button className="mt-4 bg-gray-200 text-text-dark font-roboto font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition">
                    {t('community_dashboard_training_cta')}
                 </button>
            </div>
        </div>
    );
};

const OrganizationDashboardContent = () => {
    const { t } = useLanguage();
    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
           <h3 className="text-xl font-oswald font-bold text-text-dark">{t('org_dashboard_trends_title')}</h3>
           <p className="text-text-light mt-2 mb-4">{t('org_dashboard_trends_desc')}</p>
           <div className="h-64 bg-background-light rounded-lg flex items-center justify-center border">
               <p className="text-text-light">{t('org_dashboard_trends_placeholder')}</p>
           </div>
        </div>
    );
};


const GenericDashboardContent = () => {
    const { onboardingData, userType } = useOnboarding();
    const { t } = useLanguage();
    return (
         <div className="bg-background-light p-6 rounded-lg border border-gray-200">
            <h3 className="font-bold text-text-dark mb-4">{t('onboarding_summary')}</h3>
            <pre className="text-sm text-text-light whitespace-pre-wrap break-words bg-white p-3 rounded-md border">
                {JSON.stringify({ userType, ...onboardingData }, null, 2)}
            </pre>
        </div>
    );
};

export const Dashboard: React.FC<DashboardProps> = ({ setBreathingModalOpen, setHrvModalOpen }) => {
    const { userType, badge, setBadge, engagementCount } = useOnboarding();
    const { t } = useLanguage();
    
    useEffect(() => {
        const newBadge = getBadgeForEngagement(engagementCount);
        // Only set badge if there's a new one and it's different from the current one
        if (newBadge && (!badge || newBadge.name !== badge.name)) {
            setBadge(newBadge);
        }
    }, [engagementCount, badge, setBadge]);

    if (!userType) {
        return null;
    }

    const config = dashboardConfig[userType];

    const renderDashboardContent = () => {
        switch (userType) {
            case 'individual': return <IndividualDashboardContent setBreathingModalOpen={setBreathingModalOpen} setHrvModalOpen={setHrvModalOpen} />;
            case 'community': return <CommunityDashboardContent />;
            case 'organization': return <OrganizationDashboardContent />;
            case 'mhp': return <GenericDashboardContent />;
            default: return null;
        }
    }

    return (
        <div className="w-full max-w-6xl mx-auto p-4 sm:p-8 animate-fade-in mt-16">
            <div className="bg-white/50 rounded-xl shadow-2xl overflow-hidden border border-gray-200/50">
                <div className="p-8 text-center border-b border-gray-200 bg-background-light">
                    <div className="inline-block mb-4 p-4 bg-primary/10 rounded-full">{config.icon}</div>
                    <h1 className="text-4xl font-oswald font-bold text-text-dark">{config.title}</h1>
                    <p className="text-lg text-text-light mt-2 font-roboto">{t('dashboard_welcome')}</p>
                </div>

                 {badge && (
                    <div className="m-6 bg-gradient-to-r from-primary to-primary-accent text-white p-5 rounded-lg flex items-center space-x-4 shadow-lg animate-fade-in-up">
                        <div className="text-secondary">{badge.icon}</div>
                        <div>
                            <h3 className="font-bold font-roboto text-lg">{t('badge_unlocked')} {badge.name}</h3>
                            <p className="text-sm opacity-90">{badge.description}</p>
                        </div>
                    </div>
                )}

                <div className="p-6">
                    {renderDashboardContent()}
                </div>

                <div className="p-6 bg-background-light border-t border-gray-200 text-center">
                    <p className="text-sm text-text-light">You are in control of your journey.</p>
                </div>
            </div>
        </div>
    );
}
