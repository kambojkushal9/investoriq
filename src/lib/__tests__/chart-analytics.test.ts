import { computeChartSummary, detectAnomalies } from '../chart-analytics';
import type { OHLCVPoint } from '../types';

describe('Chart Analytics', () => {
  const mockData: OHLCVPoint[] = [
    { timestamp: 1000, open: 100, high: 105, low: 95, close: 102, volume: 1000 },
    { timestamp: 2000, open: 102, high: 110, low: 101, close: 108, volume: 1200 },
    { timestamp: 3000, open: 108, high: 109, low: 105, close: 106, volume: 800 },
    { timestamp: 4000, open: 106, high: 115, low: 105, close: 114, volume: 3000 }, // volume spike & large move
    { timestamp: 5000, open: 114, high: 116, low: 110, close: 112, volume: 1100 },
  ];

  describe('computeChartSummary', () => {
    it('returns null for empty data', () => {
      expect(computeChartSummary([])).toBeNull();
    });

    it('computes correct basic statistics', () => {
      const summary = computeChartSummary(mockData);
      expect(summary).toBeDefined();
      
      // Start price: 102, End price: 112
      // Return: (112 - 102) / 102 = 9.8%
      expect(summary?.startPrice).toBe(102);
      expect(summary?.endPrice).toBe(112);
      expect(summary?.percentageReturn).toBeCloseTo(9.8, 1);
      
      expect(summary?.highestPrice).toBe(116);
      expect(summary?.lowestPrice).toBe(95);
      
      // Avg vol: (1000+1200+800+3000+1100)/5 = 1420
      expect(summary?.averageVolume).toBe(1420);
      expect(summary?.totalDataPoints).toBe(5);
    });
  });

  describe('detectAnomalies', () => {
    it('returns empty array for less than 5 points', () => {
      expect(detectAnomalies(mockData.slice(0, 4))).toEqual([]);
    });

    it('detects range high and low', () => {
      const anomalies = detectAnomalies(mockData);
      
      const highAnomaly = anomalies.find(a => a.type === 'range_high');
      expect(highAnomaly).toBeDefined();
      expect(highAnomaly?.index).toBe(4); // index 4 has high 116
      
      const lowAnomaly = anomalies.find(a => a.type === 'range_low');
      expect(lowAnomaly).toBeDefined();
      expect(lowAnomaly?.index).toBe(0); // index 0 has low 95
    });

    it('detects volume spikes and large moves', () => {
      const dataWithSpike = [
        ...mockData,
        { timestamp: 6000, open: 112, high: 130, low: 110, close: 128, volume: 6000 }
      ];
      const anomalies = detectAnomalies(dataWithSpike);
      
      const volumeSpike = anomalies.find(a => a.type === 'volume_spike');
      expect(volumeSpike).toBeDefined();
      expect(volumeSpike?.index).toBe(5); // The new point
      
      const largeMove = anomalies.find(a => a.type === 'large_move');
      expect(largeMove).toBeDefined();
    });
  });
});
