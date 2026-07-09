import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';

const yf = new YahooFinance();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');

  if (!symbol) {
    return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
  }

  try {
    // Get historical data for the last 6 months
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);

    const queryOptions = {
      period1: startDate,
      period2: endDate,
      interval: '1d' as const,
    };

    const historical = await yf.historical(symbol, queryOptions);
    const quote = await yf.quote(symbol);

    const chartData = historical.map(item => ({
      date: item.date.toISOString().split('T')[0],
      price: item.close,
      open: item.open,
      high: item.high,
      low: item.low,
      volume: item.volume,
    }));

    return NextResponse.json({
      symbol,
      name: quote?.shortName || quote?.longName || symbol,
      currentPrice: quote?.regularMarketPrice || 0,
      change: quote?.regularMarketChange || 0,
      changePercent: quote?.regularMarketChangePercent || 0,
      volume: quote?.regularMarketVolume || 0,
      high52: quote?.fiftyTwoWeekHigh || 0,
      low52: quote?.fiftyTwoWeekLow || 0,
      chartData,
    });
  } catch (error) {
    console.error('Chart API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch chart data' }, { status: 500 });
  }
}
