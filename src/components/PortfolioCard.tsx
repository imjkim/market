import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { Portfolio } from '../types';

interface PortfolioCardProps {
  portfolio: Portfolio;
  onSelect: (id: string) => void;
}

export function PortfolioCard({ portfolio, onSelect }: PortfolioCardProps) {
  const isPositive = portfolio.change24h >= 0;

  return (
    <div 
      onClick={() => onSelect(portfolio.id)}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer border border-gray-100"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{portfolio.name}</h3>
        <span className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          {Math.abs(portfolio.change24h).toFixed(2)}%
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Total Value</span>
          <span className="font-medium text-gray-900">
            ${portfolio.totalValue.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Assets</span>
          <span className="font-medium text-gray-900">{portfolio.assets.length}</span>
        </div>
      </div>
    </div>
  );
}