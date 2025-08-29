import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = total > 0 ? ((current + 1) / total) * 100 : 0;

  return (
    <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
      <div
        className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};
