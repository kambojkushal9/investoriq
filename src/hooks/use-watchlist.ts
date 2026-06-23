'use client';

import { useState, useEffect, useCallback } from 'react';
import type { WatchlistItem } from '@/lib/types';

export function useWatchlist() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWatchlist = useCallback(async () => {
    try {
      const res = await fetch('/api/watchlist');
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error('Failed to fetch watchlist:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  const addItem = async (company: string, ticker: string) => {
    try {
      const res = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company, ticker }),
      });
      const item = await res.json();
      setItems(prev => [item, ...prev.filter(p => p.ticker !== ticker)]);
      return item;
    } catch (err) {
      console.error('Failed to add to watchlist:', err);
    }
  };

  const removeItem = async (id: string) => {
    try {
      await fetch(`/api/watchlist?id=${id}`, { method: 'DELETE' });
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Failed to remove from watchlist:', err);
    }
  };

  return { items, isLoading, addItem, removeItem, refresh: fetchWatchlist };
}
