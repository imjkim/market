import React from 'react';
import type { GrowthRate } from '../types';

interface GrowthSelectorProps {
  growthRate: GrowthRate;
  onChange: (rate: GrowthRate) => void;
}

const GROWTH_LABELS: Record<GrowthRate, string> = {
  current: 'Same as now',
  optimistic: 'More growth',
  conservative: 'Less growth'
};

export function GrowthSelector({ growthRate, onChange }: GrowthSelectorProps) {
  const rates: GrowthRate[] = ['current', 'optimistic', 'conservative'];
  
  return (
    <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
      {rates.map((rate) => (
        <button
          key={rate}
          onClick={() => onChange(rate)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            growthRate === rate
              ? 'bg-indigo-600 text-white'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {GROWTH_LABELS[rate]}
        </button>
      ))}
    </div>
  );
}