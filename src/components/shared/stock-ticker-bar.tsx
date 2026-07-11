'use client';

import { useEffect, useState } from 'react';
import { TradingChartModal } from './trading-chart-modal';

interface TickerData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  up: boolean;
}

function TickerItem({ item, onClick }: { item: TickerData; onClick: (symbol: string) => void }) {
  return (
    <button 
      onClick={() => onClick(item.symbol)}
      className="flex items-center gap-3 px-5 py-2 whitespace-nowrap hover:bg-white/5 transition-colors cursor-pointer"
    >
      <span className="text-xs font-mono font-bold text-zinc-300">{item.symbol}</span>
      <span className="text-xs font-mono text-zinc-400">${item.price.toFixed(2)}</span>
      <span className={`text-xs font-mono font-medium ${item.up ? 'text-emerald-400' : 'text-rose-400'}`}>
        {item.up ? '▲' : '▼'} {Math.abs(item.change).toFixed(2)} ({Math.abs(item.changePercent).toFixed(2)}%)
      </span>
    </button>
  );
}

export function StockTickerBar() {
  const [tickerData, setTickerData] = useState<TickerData[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/market/ticker')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setTickerData(data);
        }
      })
      .catch(console.error);
  }, []);

  if (tickerData.length === 0) {
    return (
      <div className="w-full h-[41px] border-y border-white/5 bg-black/20 backdrop-blur-sm overflow-hidden flex items-center">
        <div className="animate-pulse flex gap-8 px-5">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="h-4 w-32 bg-white/5 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  // Duplicate for seamless scroll
  const items = [...tickerData, ...tickerData, ...tickerData];

  return (
    <>
      <div className="w-full overflow-hidden border-y border-white/5 bg-black/20 backdrop-blur-sm flex">
        <div className="ticker-scroll flex w-max">
          {items.map((item, i) => (
            <TickerItem key={`${item.symbol}-${i}`} item={item} onClick={setSelectedSymbol} />
          ))}
        </div>
      </div>

      <TradingChartModal 
        isOpen={!!selectedSymbol} 
        onClose={() => setSelectedSymbol(null)} 
        symbol={selectedSymbol || ''} 
      />
    </>
  );
}
