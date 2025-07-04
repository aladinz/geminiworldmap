
import React from 'react';
import type { ScaleLogarithmic } from 'd3-scale';

interface LegendProps {
  colorScale: ScaleLogarithmic<string, string>;
}

export const Legend: React.FC<LegendProps> = ({ colorScale }) => {
  const domain = colorScale.domain();
  const range = colorScale.range();

  const gradientId = 'populationGradient';

  return (
    <div className="absolute bottom-4 left-4 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-lg p-3 shadow-lg text-white w-48">
      <h4 className="font-bold text-sm mb-2 text-gray-200">Population Scale</h4>
      <svg width="100%" height="20" className="mb-1">
        <defs>
          <linearGradient id={gradientId}>
            {range.map((color, i) => (
              <stop
                key={i}
                offset={`${(i / (range.length - 1)) * 100}%`}
                stopColor={color}
              />
            ))}
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="100%" height="20" fill={`url(#${gradientId})`} rx="4"/>
      </svg>
      <div className="flex justify-between text-xs text-gray-400">
        <span>Low</span>
        <span>High</span>
      </div>
    </div>
  );
};
