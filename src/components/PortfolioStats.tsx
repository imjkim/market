import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Wallet, TrendingUp, CircleDollarSign } from 'lucide-react';
import type { Portfolio, TimeFrame, GrowthRate } from '../types';
import { TimeFrameSelector } from './TimeFrameSelector';
import { GrowthSelector } from './GrowthSelector';
import { generateHistoricalData, projectGrowth } from '../utils/chartUtils';

interface PortfolioStatsProps {
  portfolio: Portfolio;
}

export function PortfolioStats({ portfolio }: PortfolioStatsProps) {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('monthly');
  const [growthRate, setGrowthRate] = useState<GrowthRate>('current');
  
  const historicalData = useMemo(() => generateHistoricalData(timeFrame), [timeFrame]);
  const projectedData = useMemo(
    () => projectGrowth(historicalData, growthRate, timeFrame),
    [historicalData, growthRate, timeFrame]
  );
  
  const currentDate = new Date().toISOString();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Wallet className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-xl font-semibold text-gray-900">
                ${portfolio.totalValue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-green-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">24h Change</p>
              <p className={`text-xl font-semibold ${
                portfolio.change24h >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {portfolio.change24h >= 0 ? '+' : ''}{portfolio.change24h}%
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <CircleDollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Assets</p>
              <p className="text-xl font-semibold text-gray-900">
                {portfolio.assets.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Portfolio Performance</h3>
          <div className="flex flex-wrap gap-4">
            <TimeFrameSelector timeFrame={timeFrame} onChange={setTimeFrame} />
            <GrowthSelector growthRate={growthRate} onChange={setGrowthRate} />
          </div>
        </div>
        
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={projectedData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <XAxis 
                dataKey="date"
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <YAxis
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <Tooltip
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
                labelStyle={{ color: '#111827' }}
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.5rem'
                }}
              />
              <ReferenceLine
                x={historicalData[historicalData.length - 1].date}
                stroke="#E5E7EB"
                strokeDasharray="3 3"
                label={{
                  value: 'Projection',
                  position: 'insideTopRight',
                  fill: '#6B7280',
                  fontSize: 12
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#4F46E5"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#4F46E5' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}