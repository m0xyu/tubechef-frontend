import { createFileRoute, Link } from '@tanstack/react-router';
import { FaTrash, FaClock } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { useHistory } from '@/features/history/hooks/useHistory';
import { RecipeCard } from '@/features/recipes/components/RecipeCard';

export const Route = createFileRoute('/history')({
  component: HistoryPage,
});

function HistoryPage() {
  const { history, isLoaded, removeFromHistory, clearHistory } = useHistory();
  console.log(history);
  if (!isLoaded) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* ヘッダーエリア */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
            <FaClock className="text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">最近見たレシピ</h1>
            <p className="text-sm text-gray-500">最近チェックした動画（ブラウザに保存されています）</p>
          </div>
        </div>

        {/* 全削除ボタン */}
        {history.length > 0 && (
          <Button 
            variant="outline" 
            onClick={clearHistory}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
          >
            <FaTrash className="mr-2" /> 履歴をすべて削除
          </Button>
        )}
      </div>

      {/* コンテンツエリア */}
      {history.length === 0 ? (
        <EmptyHistoryState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((recipe) => (
            <div key={recipe.id} className="relative group">
              <RecipeCard recipe={recipe} />


              {/* 個別削除ボタン */}
              <button
                onClick={() => removeFromHistory(recipe.slug)}
                className="absolute -top-2 -right-2 z-10 p-2 bg-white rounded-full shadow-md text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all duration-200 border border-gray-100"
                title="この履歴を削除"
              >
                <FaTrash size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 空の状態
function EmptyHistoryState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 text-center animate-in fade-in zoom-in duration-500">
      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 text-3xl">
        🕰️
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">閲覧履歴はありません</h3>
      <p className="text-gray-500 max-w-sm mb-6">
        最近見た動画がここに表示されます。<br />
        気になる動画を探してみましょう。
      </p>
      <Link to="/">
        <Button size="lg" className="bg-slate-900 hover:bg-slate-800 font-bold px-8">
          動画を検索する
        </Button>
      </Link>
    </div>
  );
}