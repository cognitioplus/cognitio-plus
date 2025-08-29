import React from 'react';
import type { UserType } from '../../types';
import { useOnboarding } from '../../contexts/UserContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { RadioCard } from '../RadioCard';
import { IconIndividual, IconMHP, IconCommunity, IconOrganization, IconChevronRight, IconChevronLeft } from '../../constants';

interface UserTypeStepProps {
  onNext: () => void;
  onBack: () => void;
}

export const UserTypeStep: React.FC<UserTypeStepProps> = ({ onNext, onBack }) => {
  const { userType, setUserType } = useOnboarding();
  const { t } = useLanguage();

  const options = [
    {
      value: 'individual' as UserType,
      icon: <IconIndividual className="w-6 h-6" />,
      title: t('user_type_individual_title'),
      description: t('user_type_individual_desc'),
    },
    {
      value: 'mhp' as UserType,
      icon: <IconMHP className="w-6 h-6" />,
      title: t('user_type_mhp_title'),
      description: t('user_type_mhp_desc'),
    },
    {
      value: 'community' as UserType,
      icon: <IconCommunity className="w-6 h-6" />,
      title: t('user_type_community_title'),
      description: t('user_type_community_desc'),
    },
    {
      value: 'organization' as UserType,
      icon: <IconOrganization className="w-6 h-6" />,
      title: t('user_type_organization_title'),
      description: t('user_type_organization_desc'),
    },
  ];

  return (
    <div className="w-full max-w-lg mx-auto animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-oswald font-bold text-text-dark">{t('who_are_you')}</h2>
        <p className="text-text-light mt-2 font-roboto">{t('choose_one_to_personalize')}</p>
      </div>
      
      <div className="space-y-4">
        {options.map((option) => (
          <RadioCard
            key={option.value}
            id={option.value}
            name="userType"
            value={option.value}
            icon={option.icon}
            title={option.title}
            description={option.description}
            checked={userType === option.value}
            onChange={(e) => setUserType(e.target.value as UserType)}
          />
        ))}
      </div>

      <div className="flex justify-between mt-8">
         <button 
          onClick={onBack}
          className="flex items-center px-4 py-2 bg-gray-200 text-text-dark font-roboto font-semibold rounded-lg hover:bg-gray-300 transition"
        >
          <IconChevronLeft className="w-5 h-5 mr-1" />
          {t('back')}
        </button>
        <button 
          onClick={onNext}
          disabled={!userType}
          className="flex items-center px-6 py-3 bg-primary text-white font-roboto font-bold rounded-lg hover:bg-primary-accent transition disabled:bg-neutral disabled:cursor-not-allowed"
        >
          {t('next')}
          <IconChevronRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );
};
