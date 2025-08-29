import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
// Fix: Import the 'en' translation object to correctly type the translation keys.
import { en } from '../locales/en';

interface BreathingExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type BreathingPhase = 'in' | 'hold' | 'out';

// Fix: Corrected the type for 'textKey' to be a key of the 'en' translation object.
const phases: Record<BreathingPhase, { duration: number; textKey: keyof typeof en }> = {
  'in': { duration: 4000, textKey: 'breathe_in' },
  'hold': { duration: 4000, textKey: 'breathe_hold' },
  'out': { duration: 6000, textKey: 'breathe_out' },
};

export const BreathingExerciseModal: React.FC<BreathingExerciseModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [phase, setPhase] = useState<BreathingPhase>('in');

  useEffect(() => {
    if (!isOpen) return;

    const sequence: BreathingPhase[] = ['in', 'hold', 'out'];
    let currentIndex = 0;

    const nextPhase = () => {
      currentIndex = (currentIndex + 1) % sequence.length;
      const nextPhaseName = sequence[currentIndex];
      setPhase(nextPhaseName);
    };
    
    const timer = setInterval(nextPhase, phases[phase].duration);

    return () => clearInterval(timer);
  }, [isOpen, phase]);

  if (!isOpen) return null;

  const animationClass = {
      'in': 'scale-125',
      'hold': 'scale-125',
      'out': 'scale-75'
  }[phase];

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md m-4 p-8 text-center flex flex-col items-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-text-light hover:text-text-dark transition-colors">&times;</button>
        <h2 className="text-3xl font-oswald font-bold text-text-dark mb-2">{t('breathing_title')}</h2>
        <p className="text-text-light mb-8">{t('breathing_desc')}</p>
        
        <div className="w-48 h-48 rounded-full bg-primary/10 flex items-center justify-center mb-8">
            <div 
                className={`w-32 h-32 rounded-full bg-primary/20 transition-transform duration-[3000ms] ease-in-out ${animationClass}`}
            >
            </div>
        </div>

        <p className="text-2xl font-roboto font-semibold text-primary-accent h-8">
            {t(phases[phase].textKey)}
        </p>

      </div>
    </div>
  );
};
