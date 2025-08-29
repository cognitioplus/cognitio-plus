import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
}

export const Select: React.FC<SelectProps> = ({ label, name, children, ...props }) => {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-roboto font-medium text-text-dark mb-1">
        {label}
      </label>
      <select
        id={name}
        name={name}
        {...props}
        className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm font-montserrat"
      >
        {children}
      </select>
    </div>
  );
};
