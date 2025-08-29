
import React from 'react';
import { useOnboarding } from '../contexts/UserContext';
import { useLanguage } from '../contexts/LanguageContext';
import { IconClipboardList } from '../constants';

export const ServiceBooking: React.FC = () => {
    const { recommendations } = useOnboarding();
    const { t } = useLanguage();

    return (
        <div>
             <div className="flex items-center mb-2">
                <IconClipboardList className="w-6 h-6 mr-3 text-success" />
                <h3 className="text-xl font-oswald font-bold text-text-dark">{t('booking_title')}</h3>
            </div>
            <p className="text-text-light mb-4">{t('booking_desc')}</p>
            
            {recommendations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recommendations.map(service => (
                        <div key={service.id} className="border rounded-lg p-4 flex flex-col items-start bg-background-light hover:shadow-md transition-shadow">
                            <img src={service.icon} alt={service.name} className="w-12 h-12 rounded-lg mb-3 object-cover"/>
                            <h4 className="font-bold font-roboto text-text-dark">{service.name}</h4>
                            <p className="text-sm text-text-light flex-grow mb-3">{service.description}</p>
                            <button className="w-full mt-auto bg-success text-white text-sm font-roboto font-bold py-2 px-3 rounded-lg hover:bg-emerald-600 transition">
                                {t('booking_cta_short')}
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8">
                    <p className="text-text-light">{t('no_recommendations')}</p>
                </div>
            )}

             <div className="mt-6 text-center">
                 <button className="bg-gray-200 text-text-dark font-roboto font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition">
                    {t('subsidy_cta')}
                </button>
             </div>
        </div>
    );
};
