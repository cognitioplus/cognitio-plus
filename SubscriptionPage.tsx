import React, { useState } from 'react';
import { useOnboarding } from '../contexts/UserContext';
import { useLanguage } from '../contexts/LanguageContext';
import { createXenditInvoice } from '../services/xendit';
import { IconSparkles } from '../constants';

const CheckmarkIcon = () => (
    <svg className="w-5 h-5 text-success flex-shrink-0 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

const PlanCard = ({ plan, onSelect, isCurrent }: { plan: any; onSelect: () => void; isCurrent: boolean }) => {
    const { t } = useLanguage();
    return (
        <div className={`border-2 rounded-xl p-6 transition-all duration-300 ${isCurrent ? 'border-primary shadow-2xl scale-105 bg-white' : 'border-gray-300 bg-background-light'}`}>
            <h3 className="text-2xl font-oswald font-bold text-primary">{plan.name}</h3>
            <p className="text-4xl font-oswald font-bold text-text-dark my-4">{plan.price}</p>
            <ul className="space-y-3 mb-6">
                {plan.features.map((feature: any) => (
                    <li key={feature} className="flex items-center text-text-light font-roboto">
                        <CheckmarkIcon /> {feature}
                    </li>
                ))}
            </ul>
            {isCurrent ? (
                <div className="w-full text-center py-3 bg-gray-200 text-text-dark font-roboto font-bold rounded-lg">{t('current_plan')}</div>
            ) : (
                 <button onClick={onSelect} className="w-full bg-primary text-white font-roboto font-bold py-3 px-10 rounded-lg hover:bg-primary-accent transition-transform transform hover:scale-105">
                    {t('upgrade_cta')}
                </button>
            )}
        </div>
    )
}

const PaymentStatus = ({ status, onDone }: { status: 'processing' | 'success'; onDone: () => void }) => {
    const { t } = useLanguage();
    return (
        <div className="text-center p-8 bg-white rounded-xl shadow-xl animate-fade-in">
            {status === 'processing' && (
                <>
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                    <h2 className="text-2xl font-oswald font-bold text-text-dark">{t('processing_payment')}</h2>
                </>
            )}
            {status === 'success' && (
                 <>
                    <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <IconSparkles className="w-12 h-12 text-success" />
                    </div>
                    <h2 className="text-3xl font-oswald font-bold text-text-dark">{t('payment_success')}</h2>
                    <button onClick={onDone} className="mt-6 bg-success text-white font-roboto font-bold py-2 px-6 rounded-lg hover:bg-emerald-600 transition">
                       {t('return_to_dashboard')}
                    </button>
                 </>
            )}
        </div>
    )
}


export const SubscriptionPage: React.FC = () => {
    const { userType, subscriptionTier, setSubscriptionTier, setActiveView } = useOnboarding();
    const { t } = useLanguage();
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle');

    const plans = {
        individual: {
            name: t('individual_plan_name'),
            price: t('individual_plan_price'),
            priceValue: 299,
            features: [
                t('individual_plan_feature_1'),
                t('individual_plan_feature_2'),
                t('individual_plan_feature_3'),
                t('individual_plan_feature_4')
            ]
        },
        mhp: {
            name: t('mhp_plan_name'),
            price: t('mhp_plan_price'),
            priceValue: 999,
            features: [
                t('mhp_plan_feature_1'),
                t('mhp_plan_feature_2'),
                t('mhp_plan_feature_3'),
                t('mhp_plan_feature_4')
            ]
        }
    };

    const currentPlanKey = userType === 'individual' || userType === 'mhp' ? userType : 'individual';
    const currentPlan = plans[currentPlanKey];
    
    const handleUpgrade = async () => {
        setPaymentStatus('processing');
        await createXenditInvoice({
            planName: currentPlan.name,
            price: currentPlan.priceValue,
            currency: 'PHP',
            userType: userType || 'unknown',
        });
        
        // Simulate payment success after a delay
        setTimeout(() => {
            setSubscriptionTier('premium');
            setPaymentStatus('success');
        }, 2000);
    };

    const handleDone = () => {
        setActiveView('dashboard');
        // Reset status for next time page is viewed
        setTimeout(() => setPaymentStatus('idle'), 500);
    };
    
    if (paymentStatus !== 'idle') {
        return (
            <div className="w-full max-w-md mx-auto">
                <PaymentStatus status={paymentStatus} onDone={handleDone} />
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto p-4 sm:p-8 animate-fade-in mt-16">
             <div className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-oswald font-bold text-text-dark">{t('subscription_title')}</h1>
                <p className="text-lg text-text-light mt-2 font-roboto max-w-2xl mx-auto">{t('subscription_desc')}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <PlanCard 
                    plan={currentPlan}
                    onSelect={handleUpgrade}
                    isCurrent={subscriptionTier === 'premium'}
                />

                <div className={`p-6 rounded-lg ${subscriptionTier === 'free' ? 'bg-primary/5' : ''}`}>
                    {subscriptionTier === 'free' ? (
                        <div>
                             <h4 className="font-bold text-text-dark font-roboto text-lg">Why Upgrade?</h4>
                             <p className="text-text-light mt-2">Upgrading to premium unlocks a suite of powerful tools designed to provide deeper insights and accelerate your journey towards mental resilience and well-being.</p>
                        </div>
                    ) : (
                         <div className="text-center">
                            <h4 className="font-bold text-text-dark font-roboto text-lg">Thank You for Being a Premium Member!</h4>
                            <p className="text-text-light mt-2">You have access to all of Cognitio+'s best features. We're committed to supporting your journey.</p>
                         </div>
                    )}
                </div>
            </div>
        </div>
    );
};