
import React from 'react';

interface RadioCardProps {
  id: string;
  name: string;
  value: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const RadioCard: React.FC<RadioCardProps> = ({ id, name, value, icon, title, description, checked, onChange }) => {
  return (
    <label htmlFor={id} className={`
      relative block p-6 border-2 rounded-lg cursor-pointer transition-all duration-200 
      ${checked ? 'border-primary bg-primary/5 shadow-lg' : 'border-gray-300 bg-white hover:border-primary/50'}
    `}>
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="absolute opacity-0 w-0 h-0"
      />
      <div className="flex items-center">
        <div className={`mr-4 p-2 rounded-full ${checked ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-text-dark'}`}>
          {icon}
        </div>
        <div>
          <h3 className="font-bold font-roboto text-text-dark">{title}</h3>
          <p className="text-sm text-text-light">{description}</p>
        </div>
      </div>
    </label>
  );
};
