import React, { useState, useEffect, useRef } from 'react';
import { useOnboarding } from '../contexts/UserContext';
import { useLanguage } from '../contexts/LanguageContext';
import { IconHeartPulse } from '../constants';
import { BreathingFlower } from './BreathingFlower';

interface HRVMeasurementProps {
  isOpen: boolean;
  onClose: () => void;
}

type Status = 'idle' | 'recording' | 'finished' | 'mindfulness' | 'mindfulness_complete';
type BreathPhase = 'inhale' | 'exhale';

const TOTAL_DURATION = 60; // 60 seconds
const MINDFULNESS_DURATION = 180; // 3 minutes
const BREATH_CYCLE_DURATION = 5500; // 5.5 seconds per phase

const HRVTrendChart = ({ history, currentHrv }: { history: number[]; currentHrv: number }) => {
    const { t } = useLanguage();
    const data = history.length > 0 ? [...history.slice(0, -1), currentHrv] : [currentHrv];
    
    // Only show if there's at least one previous measurement to compare
    if (history.length < 1) return null; 

    const maxVal = Math.max(...data, 100);

    return (
        <div className="mt-6 p-4 bg-background-light rounded-lg border animate-fade-in">
            <h4 className="text-md font-oswald font-bold text-text-dark text-center mb-1">{t('hrv_trend_title')}</h4>
            <div className="flex justify-around items-end h-24 pt-4">
                {data.map((val, index) => (
                    <div key={index} className="flex flex-col items-center w-1/6" title={`HRV: ${val}ms`}>
                        <div 
                            className={`w-4/5 rounded-t-sm transition-all duration-500 ${index === data.length - 1 ? 'bg-primary' : 'bg-neutral'}`}
                            style={{ height: `${(val / maxVal) * 100}%` }}
                        ></div>
                        <p className={`text-xs font-bold mt-1 ${index === data.length - 1 ? 'text-primary' : 'text-text-light'}`}>{val}</p>
                    </div>
                ))}
            </div>
            <p className="text-xs text-text-light text-center mt-2">{t('hrv_trend_desc')}</p>
        </div>
    );
};


export const HRVMeasurement: React.FC<HRVMeasurementProps> = ({ isOpen, onClose }) => {
    const { setHrv, hrvHistory, setHrvHistory, setEngagementCount } = useOnboarding();
    const { t, language } = useLanguage();

    const [status, setStatus] = useState<Status>('idle');
    const [breathPhase, setBreathPhase] = useState<BreathPhase>('inhale');
    const [countdown, setCountdown] = useState(TOTAL_DURATION);
    const [mindfulnessCountdown, setMindfulnessCountdown] = useState(MINDFULNESS_DURATION);
    const [result, setResult] = useState<number | null>(null);

    const playAudio = (src: string) => {
        new Audio(src).play().catch(e => console.error(`Failed to play ${src}`, e));
    };

    useEffect(() => {
        if (!isOpen) {
            setStatus('idle');
            setCountdown(TOTAL_DURATION);
            setMindfulnessCountdown(MINDFULNESS_DURATION);
            setResult(null);
            return;
        }

        // Fix: Use ReturnType<typeof setTimeout> and ReturnType<typeof setInterval> for timer IDs.
        // This makes the types portable between Node.js and browser environments, resolving
        // the "no exported member 'Timeout'" error in a browser context.
        let measurementTimer: ReturnType<typeof setTimeout>;
        let countdownInterval: ReturnType<typeof setInterval>;
        let phaseInterval: ReturnType<typeof setInterval>;

        if (status === 'recording') {
            measurementTimer = setTimeout(() => {
                const newHrv = Math.floor(Math.random() * 61) + 40;
                setResult(newHrv);
                setHrv(newHrv);
                setEngagementCount(prev => prev + 1);
                setHrvHistory(prev => {
                    const updated = [...prev, newHrv];
                    return updated.length > 5 ? updated.slice(-5) : updated;
                });
                setStatus('finished');
                if (language === 'tl') playAudio('/sounds/tl/complete.mp3');
            }, TOTAL_DURATION * 1000);

            countdownInterval = setInterval(() => setCountdown(prev => (prev > 0 ? prev - 1 : 0)), 1000);
        }

        if (status === 'recording' || status === 'mindfulness') {
            phaseInterval = setInterval(() => {
                setBreathPhase(prev => {
                    const nextPhase = prev === 'inhale' ? 'exhale' : 'inhale';
                    const soundFile = language === 'tl' ? `/sounds/tl/${nextPhase}.mp3` : '/sounds/soft-chime.mp3';
                    playAudio(soundFile);
                    return nextPhase;
                });
            }, BREATH_CYCLE_DURATION);
        }

        if (status === 'mindfulness') {
             measurementTimer = setTimeout(() => setStatus('mindfulness_complete'), MINDFULNESS_DURATION * 1000);
             countdownInterval = setInterval(() => setMindfulnessCountdown(prev => (prev > 0 ? prev - 1 : 0)), 1000);
        }

        return () => {
            clearTimeout(measurementTimer);
            clearInterval(countdownInterval);
            clearInterval(phaseInterval);
        };
    }, [isOpen, status, setHrv, setHrvHistory, setEngagementCount, language]);
    
    const startRecording = () => {
        setCountdown(TOTAL_DURATION);
        setResult(null);
        setBreathPhase('inhale');
        setStatus('recording');
        if (language === 'tl') playAudio('/sounds/tl/start.mp3');
        playAudio(language === 'tl' ? '/sounds/tl/inhale.mp3' : '/sounds/soft-chime.mp3');
    };
    
    const startMindfulness = () => {
        setMindfulnessCountdown(MINDFULNESS_DURATION);
        setBreathPhase('inhale');
        setStatus('mindfulness');
        playAudio(language === 'tl' ? '/sounds/tl/inhale.mp3' : '/sounds/soft-chime.mp3');
    };

    const getResultInterpretation = (hrv: number | null) => {
        if (hrv === null) return "";
        if (hrv > 60) return t('hrv_measurement_result_desc_good');
        if (hrv > 40) return t('hrv_measurement_result_desc_moderate');
        return t('hrv_measurement_result_desc_high');
    };
    
    if (!isOpen) return null;

    const renderContent = () => {
        switch (status) {
            case 'finished':
                return (
                     <div className="text-center animate-fade-in">
                        <h2 className="text-2xl font-oswald font-bold text-text-dark mb-2">{t('hrv_measurement_result_title')}</h2>
                        <p className="text-7xl font-oswald font-bold text-primary my-4">{result}<span className="text-3xl">ms</span></p>
                        <p className="text-text-light">{getResultInterpretation(result)}</p>
                        <HRVTrendChart history={hrvHistory} currentHrv={result!} />
                        <div className="flex flex-col sm:flex-row gap-4 mt-8">
                            <button onClick={onClose} className="w-full bg-gray-200 text-text-dark font-roboto font-bold py-3 rounded-lg hover:bg-gray-300 transition">
                                {t('done')}
                            </button>
                            <button onClick={startMindfulness} className="w-full bg-primary text-white font-roboto font-bold py-3 rounded-lg hover:bg-primary-accent transition">
                                {t('mindfulness_cta')}
                            </button>
                        </div>
                    </div>
                );
            case 'mindfulness':
                 const mins = Math.floor(mindfulnessCountdown / 60);
                 const secs = (mindfulnessCountdown % 60).toString().padStart(2, '0');
                 return (
                    <div className="text-center animate-fade-in">
                        <h2 className="text-2xl font-oswald font-bold text-text-dark mb-2">{t('mindfulness_title')}</h2>
                        <div className="flex items-center justify-center h-48 w-48 mx-auto mb-4">
                            <BreathingFlower phase={breathPhase} />
                        </div>
                        <p className="text-2xl font-roboto font-semibold text-primary-accent h-8">
                            {breathPhase === 'inhale' ? t('breathe_in') : t('breathe_out')}
                        </p>
                        <p className="text-text-light font-mono text-lg mt-6">{mins}:{secs}</p>
                    </div>
                );
            case 'mindfulness_complete':
                 return (
                     <div className="text-center animate-fade-in p-8">
                        <h2 className="text-2xl font-oswald font-bold text-text-dark mb-2">{t('mindfulness_complete_title')}</h2>
                        <p className="text-text-light mb-8">{t('mindfulness_complete_desc')}</p>
                        <button onClick={onClose} className="w-full bg-primary text-white font-roboto font-bold py-3 rounded-lg hover:bg-primary-accent transition">
                            {t('done')}
                        </button>
                    </div>
                );
            case 'recording':
                return (
                    <div className="text-center animate-fade-in">
                         <div className="flex items-center justify-center h-48 w-48 mx-auto mb-4">
                            <BreathingFlower phase={breathPhase} />
                        </div>
                        <p className="text-3xl font-roboto font-semibold text-primary-accent h-10">
                            {breathPhase === 'inhale' ? t('breathe_in') : t('breathe_out')}
                        </p>
                        <p className="text-text-light font-mono text-lg mt-6">{countdown}s</p>
                    </div>
                );
            case 'idle':
            default:
                return (
                     <div className="text-center animate-fade-in">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <IconHeartPulse className="w-12 h-12 text-primary" />
                        </div>
                        <h2 className="text-3xl font-oswald font-bold text-text-dark mb-2">{t('hrv_measurement_title')}</h2>
                        <p className="text-text-light mb-6">{t('hrv_measurement_desc')}</p>
                        <div className="bg-background-light p-4 rounded-lg mb-8 border">
                             <p className="text-sm text-gray-600 text-center">{t('hrv_measurement_instruction')}</p>
                        </div>
                        <button onClick={startRecording} className="w-full bg-primary text-white font-roboto font-bold py-3 px-10 rounded-lg hover:bg-primary-accent transition-transform transform hover:scale-105">
                            {t('hrv_measurement_start')}
                        </button>
                    </div>
                );
        }
    };
    
    const isImmersive = status === 'recording' || status === 'mindfulness';

    return (
        <div 
          className="fixed inset-0 bg-white/80 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in p-4"
          onClick={!isImmersive ? onClose : undefined}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 sm:p-8 relative border"
            onClick={(e) => e.stopPropagation()}
          >
            {!isImmersive && (
                <button onClick={onClose} className="absolute top-4 right-4 text-text-light hover:text-text-dark text-2xl transition-colors">&times;</button>
            )}
            {renderContent()}
          </div>
        </div>
    );
};
