import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { Asset } from '../types';

interface AssetListProps {
  assets: Asset[];
}

export function AssetList({ assets }: AssetListProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Assets</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {assets.map((asset) => (
          <div key={asset.id} className="p-4 hover:bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium text-gray-900">{asset.name}</div>
                <div className="text-sm text-gray-500">{asset.symbol}</div>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-900">
                  ${asset.value.toLocaleString()}
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  asset.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {asset.change24h >= 0 ? (
                    <TrendingUp size={16} />
                  ) : (
                    <TrendingDown size={16} />
                  )}
                  {Math.abs(asset.change24h).toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}