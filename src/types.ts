export interface Asset {
  id: string;
  name: string;
  type: 'stock' | 'crypto';
  symbol: string;
  amount: number;
  value: number;
  change24h: number;
}

export interface Portfolio {
  id: string;
  name: string;
  assets: Asset[];
  totalValue: number;
  change24h: number;
}

export interface ChartDataPoint {
  date: string;
  value: number;
}

export type TimeFrame = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type GrowthRate = 'current' | 'optimistic' | 'conservative';