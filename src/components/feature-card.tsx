'use client';

import React from 'react';

export interface FeatureCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all">
      {icon && <div className="text-3xl mb-3">{icon}</div>}
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

export default FeatureCard;


