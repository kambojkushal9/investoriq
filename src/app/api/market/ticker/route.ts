import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';

const yf = new YahooFinance();
const POPULAR_SYMBOLS = ['AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NFLX', 'AMD', 'JPM'];

export async function GET() {
  try {
    const results = await Promise.allSettled(
      POPULAR_SYMBOLS.map(symbol => yf.quote(symbol))
    );

    const tickerData = results
      .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
      .map(result => {
        const quote = result.value;
        return {
          symbol: quote.symbol,
          price: quote.regularMarketPrice || 0,
          change: quote.regularMarketChange || 0,
          changePercent: quote.regularMarketChangePercent || 0,
          up: (quote.regularMarketChange || 0) >= 0,
        };
      })
      .filter(data => data.price > 0);

    return NextResponse.json(tickerData);
  } catch (error) {
    console.error('Ticker API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch ticker data' }, { status: 500 });
  }
}
