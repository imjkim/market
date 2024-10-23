import React from 'react';
import type { TimeFrame } from '../types';

interface TimeFrameSelectorProps {
  timeFrame: TimeFrame;
  onChange: (timeFrame: TimeFrame) => void;
}

export function TimeFrameSelector({ timeFrame, onChange }: TimeFrameSelectorProps) {
  const timeFrames: TimeFrame[] = ['daily', 'weekly', 'monthly', 'yearly'];
  
  return (
    <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
      {timeFrames.map((tf) => (
        <button
          key={tf}
          onClick={() => onChange(tf)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            timeFrame === tf
              ? 'bg-indigo-600 text-white'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {tf.charAt(0).toUpperCase() + tf.slice(1)}
        </button>
      ))}
    </div>
  );
}