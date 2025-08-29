import React from 'react';

export const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-xl shadow-lg border border-gray-200 ${className}`}>{children}</div>
);

export const CardHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 border-b border-gray-200 ${className}`}>{children}</div>
);

export const CardTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h2 className={`text-xl font-oswald font-bold text-text-dark ${className}`}>{children}</h2>
);

export const CardDescription = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <p className={`text-sm text-text-light mt-1 ${className}`}>{children}</p>
);

export const CardContent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);
