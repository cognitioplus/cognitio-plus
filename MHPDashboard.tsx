import React, { useState } from 'react';
import { useOnboarding } from '../contexts/UserContext';
import { useLanguage } from '../contexts/LanguageContext';
import { IconUserCircle, IconCalendar, IconSparkles, IconLock, IconEdit, IconPlus } from '../constants';
import { PremiumFeatureLock } from './PremiumFeatureLock';

type Tab = 'profile' | 'schedule' | 'specializations' | 'clients';

export const MHPDashboard: React.FC = () => {
    const { onboardingData, subscriptionTier } = useOnboarding();
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<Tab>('profile');

    const tabs = [
        { id: 'profile', label: 'Profile', icon: <IconUserCircle className="w-5 h-5 mr-2" /> },
        { id: 'schedule', label: 'Schedule', icon: <IconCalendar className="w-5 h-5 mr-2" /> },
        { id: 'specializations', label: 'Specializations', icon: <IconSparkles className="w-5 h-5 mr-2" /> },
        { id: 'clients', label: 'Client Notes', icon: <IconLock className="w-5 h-5 mr-2" /> },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div className="animate-fade-in">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-oswald font-bold text-text-dark">Professional Profile</h3>
                            <button className="flex items-center text-sm bg-gray-200 hover:bg-gray-300 text-text-dark font-roboto font-semibold py-2 px-4 rounded-lg transition-colors">
                                <IconEdit className="w-4 h-4 mr-2" /> Edit Profile
                            </button>
                        </div>
                        <div className="space-y-4 text-text-dark bg-background-light p-6 rounded-lg border">
                            <p><strong>Role:</strong> {onboardingData.role ? t(onboardingData.role as any) : 'N/A'}</p>
                            <p><strong>License Number:</strong> {onboardingData.licenseNumber || 'Not Provided'}</p>
                            <p><strong>Affiliation:</strong> {onboardingData.affiliation || 'Not Provided'}</p>
                            <p><strong>Serving Communities:</strong> {onboardingData.communityService ? t(onboardingData.communityService as any) : 'N/A'}</p>
                        </div>
                    </div>
                );
            case 'schedule':
                return (
                     <div className="animate-fade-in">
                        <div className="flex justify-between items-center mb-6">
                             <h3 className="text-2xl font-oswald font-bold text-text-dark">Availability</h3>
                            <button className="flex items-center text-sm bg-primary hover:bg-primary-accent text-white font-roboto font-semibold py-2 px-4 rounded-lg transition-colors">
                                <IconPlus className="w-4 h-4 mr-2" /> Add Availability
                            </button>
                        </div>
                        <div className="bg-background-light p-8 rounded-lg text-center border">
                            <h4 className="text-lg font-roboto font-semibold text-text-dark">Your Calendar</h4>
                            <p className="text-text-light mt-2">Your calendar is currently empty. Add your available clinic hours and appointments to get started.</p>
                        </div>
                    </div>
                );
            case 'specializations':
                return (
                    <div className="animate-fade-in">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-oswald font-bold text-text-dark">Services & Specializations</h3>
                             <button className="flex items-center text-sm bg-gray-200 hover:bg-gray-300 text-text-dark font-roboto font-semibold py-2 px-4 rounded-lg transition-colors">
                                <IconEdit className="w-4 h-4 mr-2" /> Manage Services
                            </button>
                        </div>
                        <div className="bg-background-light p-6 rounded-lg border">
                             <ul className="space-y-3 text-text-dark">
                                {(onboardingData.services || []).length > 0 ? (onboardingData.services || []).map((service: string) => (
                                    <li key={service} className="flex items-center">
                                        <IconSparkles className="w-5 h-5 mr-3 text-primary"/>
                                        <span className="font-roboto">{t(service as any)}</span>
                                    </li>
                                )) : <p className="text-text-light">No services listed.</p>}
                            </ul>
                        </div>
                    </div>
                );
            case 'clients':
                if (subscriptionTier === 'free') {
                    return <PremiumFeatureLock />;
                }
                return (
                     <div className="animate-fade-in">
                        <h3 className="text-2xl font-oswald font-bold text-text-dark mb-4">Patient Records</h3>
                        <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-4 rounded-r-lg mb-6" role="alert">
                           <div className="flex">
                                <IconLock className="w-6 h-6 mr-3 flex-shrink-0" />
                                <div>
                                    <p className="font-bold font-roboto">Secure & Confidential</p>
                                    <p className="text-sm">All patient data is end-to-end encrypted. You are responsible for maintaining patient confidentiality in accordance with the Data Privacy Act of 2012 (RA 10173).</p>
                                </div>
                            </div>
                        </div>
                         <div className="mt-4 text-center text-text-light bg-background-light p-8 rounded-lg border">
                            <h4 className="text-lg font-roboto font-semibold text-text-dark">Client Management</h4>
                            <p className="text-text-light mt-2">You have no active clients. When you accept a referral, their records will appear here.</p>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    }

    return (
        <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden border">
                 <div className="p-6 sm:p-8 text-left bg-background-light border-b border-gray-200">
                    <h1 className="text-3xl sm:text-4xl font-oswald font-bold text-text-dark">MHP Dashboard</h1>
                    <p className="text-base sm:text-lg text-text-light mt-2 font-roboto">Manage your professional presence and client interactions.</p>
                </div>

                <div className="flex flex-col md:flex-row">
                    <nav className="w-full md:w-1/4 p-6 bg-background-light border-b md:border-b-0 md:border-r border-gray-200">
                        <ul className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2 overflow-x-auto md:overflow-x-visible">
                           {tabs.map(tab => (
                               <li key={tab.id}>
                                   <button 
                                        onClick={() => setActiveTab(tab.id as Tab)}
                                        className={`w-full flex items-center px-4 py-3 text-left font-roboto font-semibold rounded-lg transition whitespace-nowrap ${activeTab === tab.id ? 'bg-primary/10 text-primary' : 'text-text-dark hover:bg-gray-200 hover:text-text-dark'}`}>
                                        {tab.icon}
                                        {tab.label}
                                   </button>
                               </li>
                           ))}
                        </ul>
                    </nav>
                    <main className="w-full md:w-3/4 p-6 sm:p-8 min-h-[400px]">
                        {renderContent()}
                    </main>
                </div>
            </div>
        </div>
    );
};
