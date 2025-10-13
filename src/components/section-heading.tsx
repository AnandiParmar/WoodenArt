'use client';

import React from 'react';

export interface SectionHeadingProps {
  overline?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({ overline, title, subtitle, align = 'center', className }) => {
  const alignCls = align === 'center' ? 'text-center' : 'text-left';
  return (
    <div className={`space-y-2 ${alignCls} ${className ?? ''}`}>
      {overline && <div className="text-sm font-semibold text-accent-600 tracking-wide">{overline}</div>}
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{title}</h2>
      {subtitle && <p className="text-gray-600 max-w-3xl mx-auto">{subtitle}</p>}
    </div>
  );
};

export default SectionHeading;


