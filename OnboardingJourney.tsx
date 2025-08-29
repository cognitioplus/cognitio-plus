
import React, { useState } from 'react';
import { ProgressBar } from '../ProgressBar';
import { IconChevronLeft, IconChevronRight } from '../../constants';
import { useOnboarding } from '../../contexts/UserContext';
import { useLanguage } from '../../contexts/LanguageContext';
import type { OnboardingStep } from '../../types';
import { Input } from '../Form/Input';
import { Select } from '../Form/Select';
import { LGUForm } from '../Form/LGUForm';

interface OnboardingJourneyProps {
  steps: OnboardingStep[];
  onComplete: () => void;
}

export const OnboardingJourney: React.FC<OnboardingJourneyProps> = ({ steps, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { resetOnboarding } = useOnboarding();
  const { t } = useLanguage();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      resetOnboarding();
    }
  };

  const isLastStep = currentStep === steps.length - 1;
  const StepComponent = steps[currentStep].component;

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in-up">
      <ProgressBar current={currentStep} total={steps.length} />
      
      <div className="text-center mb-8">
        <h2 className="text-3xl font-oswald font-bold text-text-dark">{t(steps[currentStep].title as any)}</h2>
      </div>

      <div className="min-h-[300px] bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <StepComponent />
      </div>

      <div className="flex justify-between mt-8">
        <button 
          onClick={handleBack}
          className="flex items-center px-4 py-2 bg-gray-200 text-text-dark font-roboto font-semibold rounded-lg hover:bg-gray-300 transition"
        >
          <IconChevronLeft className="w-5 h-5 mr-1" />
          {t('back')}
        </button>
        <button 
          onClick={handleNext}
          className="flex items-center px-6 py-3 bg-primary text-white font-roboto font-bold rounded-lg hover:bg-primary-accent transition"
        >
          {isLastStep ? t('finish') : t('next')}
          <IconChevronRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );
};

// Generic Step Component Creators
const createRadioStep = (options: string[], dataKey: string): React.FC => {
    const RadioStepComponent: React.FC = () => {
        const { onboardingData, updateOnboardingData } = useOnboarding();
        const { t } = useLanguage();
        const selection = onboardingData[dataKey] || '';
        return (
            <div className="space-y-3">
                {options.map(option => (
                    <label key={option} className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${selection === option ? 'border-primary bg-primary/5 shadow-sm' : 'border-gray-200 bg-white hover:border-primary/50'}`}>
                        <input type="radio" name={dataKey} value={option} checked={selection === option} onChange={e => updateOnboardingData({ [dataKey]: e.target.value })} className="w-5 h-5 text-primary focus:ring-primary border-gray-300 mr-4" />
                        <span className="text-text-dark font-roboto">{t(option as any)}</span>
                    </label>
                ))}
            </div>
        );
    };
    RadioStepComponent.displayName = `RadioStep(${dataKey})`;
    return RadioStepComponent;
};

const createCheckboxStep = (options: string[], dataKey: string): React.FC => {
    const CheckboxStepComponent: React.FC = () => {
        const { onboardingData, updateOnboardingData } = useOnboarding();
        const { t } = useLanguage();
        const selections = onboardingData[dataKey] || [];
        
        const handleChange = (option: string) => {
            const newSelections = selections.includes(option)
                ? selections.filter((item: string) => item !== option)
                : [...selections, option];
            updateOnboardingData({ [dataKey]: newSelections });
        };

        return (
            <div className="space-y-3">
                {options.map(option => (
                    <label key={option} className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${selections.includes(option) ? 'border-primary bg-primary/5 shadow-sm' : 'border-gray-200 bg-white hover:border-primary/50'}`}>
                        <input type="checkbox" name={option} value={option} checked={selections.includes(option)} onChange={() => handleChange(option)} className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded mr-4" />
                        <span className="text-text-dark font-roboto">{t(option as any)}</span>
                    </label>
                ))}
            </div>
        );
    };
    CheckboxStepComponent.displayName = `CheckboxStep(${dataKey})`;
    return CheckboxStepComponent;
};

// Custom Form Steps
const MHPIdentityStep: React.FC = () => {
    const { onboardingData, updateOnboardingData } = useOnboarding();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateOnboardingData({ [e.target.name]: e.target.value });
    };
    return (
        <div className="space-y-4">
            <Input label="License Number (optional)" name="licenseNumber" value={onboardingData.licenseNumber || ''} onChange={handleChange} placeholder="e.g., 123456" />
            <Input label="Affiliation" name="affiliation" value={onboardingData.affiliation || ''} onChange={handleChange} placeholder="e.g., Private Practice, St. Luke's Medical Center" />
        </div>
    );
};

const OrganizationProfileStep: React.FC = () => {
    const { onboardingData, updateOnboardingData } = useOnboarding();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        updateOnboardingData({ [e.target.name]: e.target.value });
    };
    return (
        <div className="space-y-4">
            <Select label="Organization Size" name="orgSize" value={onboardingData.orgSize || ''} onChange={handleChange}>
                <option value="">Select size</option>
                <option value="1-50">1-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="200+">200+ employees</option>
            </Select>
            <Input label="Industry" name="industry" value={onboardingData.industry || ''} onChange={handleChange} placeholder="e.g., Education, Healthcare, BPO" />
        </div>
    );
};


// Onboarding Paths
export const IndividualSteps: OnboardingStep[] = [
  { title: "individual_goal_title", component: createRadioStep(['individual_goal_stress', 'individual_goal_sleep', 'individual_goal_emotions', 'individual_goal_burnout', 'individual_goal_talk'], 'goal') },
  { title: "individual_context_title", component: createCheckboxStep(['individual_context_student', 'individual_context_remote', 'individual_context_indigenous', 'individual_context_disability', 'individual_context_financial', 'individual_context_none'], 'vulnerability') },
  { title: "individual_counseling_title", component: createRadioStep(['individual_counseling_video', 'individual_counseling_chat', 'individual_counseling_person', 'individual_counseling_unsure'], 'counselingPreference')},
  { title: "individual_checkin_title", component: createRadioStep(['individual_checkin_5', 'individual_checkin_4', 'individual_checkin_3', 'individual_checkin_2', 'individual_checkin_1'], 'mood') },
];

export const MHPSteps: OnboardingStep[] = [
  { title: "mhp_role_title", component: createRadioStep(['mhp_role_psychologist', 'mhp_role_psychiatrist', 'mhp_role_counselor', 'mhp_role_social_worker', 'mhp_role_pwd_specialist'], 'role') },
  { title: "mhp_identity_title", component: MHPIdentityStep },
  { title: "mhp_services_title", component: createCheckboxStep(['mhp_service_cbt', 'mhp_service_dbt', 'mhp_service_trauma', 'mhp_service_addiction', 'mhp_service_family', 'mhp_service_psychiatric'], 'services') },
  { title: "mhp_community_title", component: createRadioStep(['mhp_community_yes', 'mhp_community_no'], 'communityService') },
];

export const CommunitySteps: OnboardingStep[] = [
  { title: "community_type_title", component: createRadioStep(['community_type_lgu', 'community_type_school', 'community_type_indigenous', 'community_type_cso'], 'communityType') },
  { title: "community_profile_title", component: LGUForm },
  { title: "community_needs_title", component: createCheckboxStep(['community_needs_youth', 'community_needs_substance', 'community_needs_carers', 'community_needs_disaster', 'community_needs_resilience'], 'communityNeeds') },
  { title: "community_funding_title", component: createRadioStep(['community_funding_yes', 'community_funding_no'], 'funding') },
];

export const OrganizationSteps: OnboardingStep[] = [
  { title: "org_profile_title", component: OrganizationProfileStep },
  { title: "org_goals_title", component: createRadioStep(['org_goals_burnout', 'org_goals_train_managers', 'org_goals_emergency', 'org_goals_policy', 'org_goals_wellbeing'], 'orgGoal') },
  { title: "org_compliance_title", component: createRadioStep(['org_compliance_full', 'org_compliance_partial', 'org_compliance_non', 'org_compliance_unsure'], 'compliance') },
];