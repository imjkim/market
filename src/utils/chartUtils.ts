import { ChartDataPoint, TimeFrame, GrowthRate } from '../types';

const GROWTH_RATES = {
  current: 1.0,     // Current growth rate
  optimistic: 1.5,  // 50% more growth
  conservative: 0.5 // 50% less growth
};

export function generateHistoricalData(timeFrame: TimeFrame): ChartDataPoint[] {
  const now = new Date();
  const data: ChartDataPoint[] = [];
  const baseValue = 100000;
  
  switch (timeFrame) {
    case 'daily':
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        data.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          value: baseValue + Math.random() * 10000
        });
      }
      break;
      
    case 'weekly':
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - (i * 7));
        data.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          value: baseValue + Math.random() * 15000
        });
      }
      break;
      
    case 'monthly':
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - i);
        data.push({
          date: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          value: baseValue + Math.random() * 20000
        });
      }
      break;
      
    case 'yearly':
      for (let i = 4; i >= 0; i--) {
        const date = new Date(now);
        date.setFullYear(date.getFullYear() - i);
        data.push({
          date: date.getFullYear().toString(),
          value: baseValue + Math.random() * 25000
        });
      }
      break;
  }
  
  return data;
}

export function projectGrowth(
  historicalData: ChartDataPoint[],
  growthRate: GrowthRate,
  timeFrame: TimeFrame
): ChartDataPoint[] {
  const lastValue = historicalData[historicalData.length - 1].value;
  const projectedData: ChartDataPoint[] = [...historicalData];
  const growthMultiplier = GROWTH_RATES[growthRate];
  const baseGrowthRate = 0.05; // 5% base growth rate
  
  const periodsToProject = timeFrame === 'yearly' ? 3 : 6;
  let currentValue = lastValue;
  
  for (let i = 1; i <= periodsToProject; i++) {
    const growth = currentValue * (baseGrowthRate * growthMultiplier);
    currentValue += growth;
    
    const lastDate = new Date(historicalData[historicalData.length - 1].date);
    let projectedDate: Date;
    
    switch (timeFrame) {
      case 'daily':
        projectedDate = new Date(lastDate.setDate(lastDate.getDate() + i));
        break;
      case 'weekly':
        projectedDate = new Date(lastDate.setDate(lastDate.getDate() + (i * 7)));
        break;
      case 'monthly':
        projectedDate = new Date(lastDate.setMonth(lastDate.getMonth() + i));
        break;
      case 'yearly':
        projectedDate = new Date(lastDate.setFullYear(lastDate.getFullYear() + i));
        break;
    }
    
    projectedData.push({
      date: projectedDate.toLocaleDateString('en-US', {
        month: timeFrame === 'yearly' ? undefined : 'short',
        day: timeFrame === 'daily' || timeFrame === 'weekly' ? 'numeric' : undefined,
        year: timeFrame === 'monthly' || timeFrame === 'yearly' ? 'numeric' : undefined
      }),
      value: Math.round(currentValue)
    });
  }
  
  return projectedData;
}