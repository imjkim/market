import React, { useState } from 'react';
import { X, Plus, Trash2, Search } from 'lucide-react';
import type { Portfolio, Asset } from '../types';
import { searchAssets } from '../utils/assetSearch';

interface PortfolioDetailsModalProps {
  portfolio: Portfolio;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedPortfolio: Portfolio) => void;
}

export function PortfolioDetailsModal({ portfolio, isOpen, onClose, onUpdate }: PortfolioDetailsModalProps) {
  const [assets, setAssets] = useState<Asset[]>(portfolio.assets);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Asset[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const results = await searchAssets(query);
      setSearchResults(results.filter(result => 
        !assets.some(asset => asset.symbol === result.symbol)
      ));
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddAsset = (asset: Asset) => {
    setAssets([...assets, { ...asset, amount: 0 }]);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleUpdateAmount = (symbol: string, amount: number) => {
    const updatedAssets = assets.map(asset => 
      asset.symbol === symbol ? { ...asset, amount } : asset
    );
    setAssets(updatedAssets);
  };

  const handleRemoveAsset = (symbol: string) => {
    setAssets(assets.filter(asset => asset.symbol !== symbol));
  };

  const handleSave = () => {
    const totalValue = assets.reduce((sum, asset) => sum + (asset.value * asset.amount), 0);
    onUpdate({
      ...portfolio,
      assets,
      totalValue
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">{portfolio.name}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Assets
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search stocks or crypto..."
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>

            {isSearching && (
              <div className="mt-2 text-sm text-gray-500">Searching...</div>
            )}

            {searchResults.length > 0 && (
              <div className="mt-2 border border-gray-100 rounded-lg divide-y divide-gray-100">
                {searchResults.map((result) => (
                  <button
                    key={result.symbol}
                    onClick={() => handleAddAsset(result)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium text-gray-900">{result.name}</div>
                      <div className="text-sm text-gray-500">{result.symbol}</div>
                    </div>
                    <Plus size={20} className="text-gray-400" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-4">Portfolio Assets</h3>
            <div className="space-y-4">
              {assets.map((asset) => (
                <div key={asset.symbol} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-medium text-gray-900">{asset.name}</div>
                      <div className="text-sm text-gray-500">{asset.symbol}</div>
                    </div>
                    <button
                      onClick={() => handleRemoveAsset(asset.symbol)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Amount</label>
                        <input
                          type="number"
                          value={asset.amount}
                          onChange={(e) => handleUpdateAmount(asset.symbol, Number(e.target.value))}
                          className="w-32 px-2 py-1 border border-gray-300 rounded-md"
                          min="0"
                          step="any"
                        />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Price</div>
                        <div className="font-medium">${asset.value.toLocaleString()}</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Total Value</div>
                      <div className="font-medium">${(asset.value * asset.amount).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-lg font-medium">
              Total Value: ${assets.reduce((sum, asset) => sum + (asset.value * asset.amount), 0).toLocaleString()}
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}