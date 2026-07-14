// ============================================
// Chart Analytics — Summary & Anomaly Detection
// ============================================
// Generates compact chart statistics for AI context
// and detects notable market anomalies.

import type { OHLCVPoint, ChartSummary, ChartAnomalyMarker, AnomalyType } from '@/lib/types';

/**
 * Compute a compact summary of OHLCV data for AI context.
 * Never sends raw candles to the LLM — only aggregated stats.
 */
export function computeChartSummary(data: OHLCVPoint[]): ChartSummary | null {
  if (!data || data.length === 0) return null;

  const closes = data.map(d => d.close).filter(c => c != null && isFinite(c));
  const volumes = data.map(d => d.volume).filter(v => v != null && isFinite(v));

  if (closes.length === 0) return null;

  const startPrice = closes[0];
  const endPrice = closes[closes.length - 1];
  const percentageReturn = startPrice > 0 ? ((endPrice - startPrice) / startPrice) * 100 : 0;

  const highestPrice = Math.max(...data.map(d => d.high).filter(h => isFinite(h)));
  const lowestPrice = Math.min(...data.map(d => d.low).filter(l => isFinite(l)));

  const averageVolume = volumes.length > 0
    ? volumes.reduce((s, v) => s + v, 0) / volumes.length
    : 0;

  // Compute daily returns for volatility & moves
  const returns: number[] = [];
  for (let i = 1; i < closes.length; i++) {
    if (closes[i - 1] > 0) {
      returns.push(((closes[i] - closes[i - 1]) / closes[i - 1]) * 100);
    }
  }

  const largestUpMove = returns.length > 0 ? Math.max(...returns, 0) : 0;
  const largestDownMove = returns.length > 0 ? Math.min(...returns, 0) : 0;

  // Volatility proxy: standard deviation of returns
  const volatilityProxy = computeStdDev(returns);

  // Recent trend: based on last 20% of data points
  const recentCount = Math.max(Math.floor(closes.length * 0.2), 2);
  const recentCloses = closes.slice(-recentCount);
  const recentStart = recentCloses[0];
  const recentEnd = recentCloses[recentCloses.length - 1];
  const recentChange = recentStart > 0 ? ((recentEnd - recentStart) / recentStart) * 100 : 0;

  let recentTrend: 'bullish' | 'bearish' | 'neutral' = 'neutral';
  if (recentChange > 1.5) recentTrend = 'bullish';
  else if (recentChange < -1.5) recentTrend = 'bearish';

  return {
    startPrice: round(startPrice),
    endPrice: round(endPrice),
    percentageReturn: round(percentageReturn),
    highestPrice: round(highestPrice),
    lowestPrice: round(lowestPrice),
    averageVolume: Math.round(averageVolume),
    largestUpMove: round(largestUpMove),
    largestDownMove: round(largestDownMove),
    recentTrend,
    volatilityProxy: round(volatilityProxy),
    totalDataPoints: data.length,
  };
}

/**
 * Detect notable market anomalies for chart markers.
 * Uses statistical thresholds to avoid cluttering the chart.
 */
export function detectAnomalies(data: OHLCVPoint[]): ChartAnomalyMarker[] {
  if (!data || data.length < 5) return [];

  const markers: ChartAnomalyMarker[] = [];
  const closes = data.map(d => d.close);
  const volumes = data.map(d => d.volume);

  // Compute returns
  const returns: number[] = [0]; // first point has no return
  for (let i = 1; i < closes.length; i++) {
    returns.push(closes[i - 1] > 0 ? ((closes[i] - closes[i - 1]) / closes[i - 1]) * 100 : 0);
  }

  const returnStdDev = computeStdDev(returns.slice(1));
  const avgVolume = volumes.reduce((s, v) => s + v, 0) / volumes.length;

  // Find range high and low indices
  let highIdx = 0, lowIdx = 0;
  for (let i = 1; i < data.length; i++) {
    if (data[i].high > data[highIdx].high) highIdx = i;
    if (data[i].low < data[lowIdx].low) lowIdx = i;
  }

  // Range High marker
  markers.push({
    index: highIdx,
    timestamp: data[highIdx].timestamp,
    type: 'range_high' as AnomalyType,
    label: 'Range High',
    description: `Highest price in the selected period: $${data[highIdx].high.toFixed(2)}`,
    magnitude: 0.8,
  });

  // Range Low marker
  if (lowIdx !== highIdx) {
    markers.push({
      index: lowIdx,
      timestamp: data[lowIdx].timestamp,
      type: 'range_low' as AnomalyType,
      label: 'Range Low',
      description: `Lowest price in the selected period: $${data[lowIdx].low.toFixed(2)}`,
      magnitude: 0.8,
    });
  }

  // Detect volume spikes and large price moves (limit markers to avoid clutter)
  const anomalyThreshold = 2; // 2 standard deviations
  let addedCount = 0;
  const MAX_EXTRA_MARKERS = 6;

  for (let i = 1; i < data.length && addedCount < MAX_EXTRA_MARKERS; i++) {
    // Already have marker at this index?
    if (i === highIdx || i === lowIdx) continue;

    const absReturn = Math.abs(returns[i]);

    // Large price move
    if (returnStdDev > 0 && absReturn > returnStdDev * anomalyThreshold && absReturn > 2) {
      const direction = returns[i] > 0 ? 'up' : 'down';
      markers.push({
        index: i,
        timestamp: data[i].timestamp,
        type: 'large_move',
        label: 'Large Price Move',
        description: `Price moved ${returns[i] > 0 ? '+' : ''}${returns[i].toFixed(1)}% in a single period`,
        magnitude: Math.min(absReturn / (returnStdDev * 4), 1),
      });
      addedCount++;
      continue; // one marker per point
    }

    // Volume spike
    if (avgVolume > 0 && volumes[i] > avgVolume * 2.5) {
      markers.push({
        index: i,
        timestamp: data[i].timestamp,
        type: 'volume_spike',
        label: 'Unusual Volume',
        description: `Volume was ${(volumes[i] / avgVolume).toFixed(1)}× the average`,
        magnitude: Math.min(volumes[i] / (avgVolume * 5), 1),
      });
      addedCount++;
    }
  }

  // Momentum shift: find the strongest reversal point
  if (data.length >= 10) {
    const windowSize = Math.max(Math.floor(data.length / 10), 3);
    let maxShift = 0;
    let shiftIdx = -1;

    for (let i = windowSize; i < data.length - windowSize; i++) {
      if (i === highIdx || i === lowIdx) continue;
      const before = closes.slice(i - windowSize, i);
      const after = closes.slice(i, i + windowSize);
      const trendBefore = before[before.length - 1] - before[0];
      const trendAfter = after[after.length - 1] - after[0];

      // Momentum shift = opposing trends around this point
      if ((trendBefore > 0 && trendAfter < 0) || (trendBefore < 0 && trendAfter > 0)) {
        const shiftMagnitude = Math.abs(trendBefore) + Math.abs(trendAfter);
        if (shiftMagnitude > maxShift) {
          maxShift = shiftMagnitude;
          shiftIdx = i;
        }
      }
    }

    if (shiftIdx >= 0 && !markers.find(m => m.index === shiftIdx)) {
      markers.push({
        index: shiftIdx,
        timestamp: data[shiftIdx].timestamp,
        type: 'momentum_shift',
        label: 'Momentum Shift',
        description: 'Price trend direction changed significantly around this point',
        magnitude: 0.7,
      });
    }
  }

  return markers.sort((a, b) => a.index - b.index);
}

/**
 * Format chart summary into a compact string for AI context.
 */
export function formatChartContextForAI(
  ticker: string,
  range: string,
  chartMode: string,
  summary: ChartSummary,
  selectedPoint?: OHLCVPoint,
  anomalies?: ChartAnomalyMarker[]
): string {
  const parts: string[] = [];

  parts.push(`=== CHART CONTEXT ===`);
  parts.push(`Ticker: ${ticker}`);
  parts.push(`Chart Range: ${range}`);
  parts.push(`Chart Mode: ${chartMode}`);
  parts.push(`Data Points: ${summary.totalDataPoints}`);
  parts.push(`\n--- Price Summary ---`);
  parts.push(`Start Price: $${summary.startPrice}`);
  parts.push(`End Price: $${summary.endPrice}`);
  parts.push(`Return: ${summary.percentageReturn > 0 ? '+' : ''}${summary.percentageReturn}%`);
  parts.push(`Range High: $${summary.highestPrice}`);
  parts.push(`Range Low: $${summary.lowestPrice}`);
  parts.push(`Average Volume: ${summary.averageVolume.toLocaleString()}`);
  parts.push(`Largest Up Move: +${summary.largestUpMove}%`);
  parts.push(`Largest Down Move: ${summary.largestDownMove}%`);
  parts.push(`Recent Trend: ${summary.recentTrend}`);
  parts.push(`Volatility (σ of returns): ${summary.volatilityProxy}%`);

  if (selectedPoint) {
    parts.push(`\n--- Selected Data Point ---`);
    parts.push(`Date: ${new Date(selectedPoint.timestamp).toISOString()}`);
    parts.push(`Open: $${selectedPoint.open.toFixed(2)}`);
    parts.push(`High: $${selectedPoint.high.toFixed(2)}`);
    parts.push(`Low: $${selectedPoint.low.toFixed(2)}`);
    parts.push(`Close: $${selectedPoint.close.toFixed(2)}`);
    parts.push(`Volume: ${selectedPoint.volume.toLocaleString()}`);
  }

  if (anomalies && anomalies.length > 0) {
    parts.push(`\n--- Notable Anomalies ---`);
    anomalies.forEach(a => {
      parts.push(`  [${a.type}] ${a.description}`);
    });
  }

  return parts.join('\n');
}

// ---- Helpers ----

function computeStdDev(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / (values.length - 1);
  return Math.sqrt(variance);
}

function round(n: number, decimals = 2): number {
  const f = Math.pow(10, decimals);
  return Math.round(n * f) / f;
}
