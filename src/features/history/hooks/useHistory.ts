import { useState, useEffect, useCallback } from 'react';
import type { RecipeListItem } from '@/types/api';
import { toast } from 'sonner';

const STORAGE_KEY = 'app_browsing_history';
const MAX_HISTORY_COUNT = 30;

export const useHistory = () => {
  const [history, setHistory] = useState<RecipeListItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error('履歴の読み込みに失敗しました', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // 履歴に追加 (詳細ページなどで呼ぶ)
  const addToHistory = useCallback((recipe: RecipeListItem) => {
    setHistory((prev) => {
      // 重複排除: 同じ動画IDがあれば一旦消す
      const filtered = prev.filter((r) => r.slug !== recipe.slug);
      
      const newHistory = [recipe, ...filtered].slice(0, MAX_HISTORY_COUNT);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  const removeFromHistory = useCallback((slug: string) => {
    setHistory((prev) => {
      const newHistory = prev.filter((r) => r.slug !== slug);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
    toast.success('履歴から削除しました');
  }, []);

  const clearHistory = useCallback(() => {
    if (!confirm('閲覧履歴をすべて削除しますか？')) return;
    
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
    toast.success('履歴をすべて削除しました');
  }, []);

  return {
    history,
    isLoaded,
    addToHistory,
    removeFromHistory,
    clearHistory
  };
};