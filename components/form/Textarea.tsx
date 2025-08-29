import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, name, ...props }) => {
  return (
    <div>
      {label && <label htmlFor={name} className="block text-sm font-roboto font-medium text-text-dark mb-1">
        {label}
      </label>}
      <textarea
        id={name}
        name={name}
        {...props}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm font-montserrat"
      />
    </div>
  );
};
