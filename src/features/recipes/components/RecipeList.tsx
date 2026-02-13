import { useEffect, useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { apiClient } from '@/lib/apiClient';
import type { RecipeListItem, ApiResponse, ApiMeta } from '@/types/api';
import { Skeleton } from '@/components/ui/skeleton';
import { RecipeCard } from './RecipeCard';
import { PaginationControl } from './PaginationControl';

interface RecipeListProps {
  page: number;
}

export function RecipeList({ page }: RecipeListProps) {
const navigate = useNavigate();
  const [recipes, setRecipes] = useState<RecipeListItem[]>([]);
  const [meta, setMeta] = useState<ApiMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const res = await apiClient.get<ApiResponse<RecipeListItem[]>>('/api/recipes', {
          params: { page } 
        });
        
        setRecipes(res.data.data);
        setMeta(res.data.meta ?? null);
      } catch (err) {
        console.error(err);
        setError('レシピの読み込みに失敗しました。');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();    
  }, [page]);

  const handlePageChange = (newPage: number) => {
    navigate({
      to: '/recipes',
      search: { page: newPage },
    });
    // UX向上のためトップへスクロール
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return (
      <div className="text-center py-20 text-red-500 bg-red-50 rounded-xl">
        <p>⚠️ {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 text-sm font-bold underline hover:text-red-700"
        >
          再読み込み
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="h-50 w-full rounded-xl" />
            <div className="space-y-2 p-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
        <p className="text-xl font-bold mb-2">まだレシピがありません 🍳</p>
        <p className="mb-6">YouTubeの動画URLを入力して、最初のレシピを生成しましょう！</p>
        <Link to="/" className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors">
          トップページへ戻る
        </Link>
      </div>
    );
  }

  return (
    <>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>

    {meta && (
        <PaginationControl 
          currentPage={meta.current_page}
          lastPage={meta.last_page}
          onPageChange={handlePageChange}
        />
    )}
    </>
  );
}