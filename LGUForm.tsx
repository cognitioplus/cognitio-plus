import React from 'react';
import { useOnboarding } from '../../contexts/UserContext';
import { Select } from './Select';
import { Input } from './Input';

export const LGUForm: React.FC = () => {
    const { onboardingData, updateOnboardingData } = useOnboarding();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        updateOnboardingData({ [e.target.name]: e.target.value });
    };
    return (
        <div className="space-y-4">
            <Select label="Location" name="location" value={onboardingData.location || ''} onChange={handleChange}>
                <option value="">Select location type</option>
                <option value="rural">Rural</option>
                <option value="urban">Urban</option>
                <option value="highly-urbanized">Highly Urbanized</option>
            </Select>
            <Input label="Population Size (approximate)" name="population" type="number" value={onboardingData.population || ''} onChange={handleChange} placeholder="e.g., 5000" />
        </div>
    );
};