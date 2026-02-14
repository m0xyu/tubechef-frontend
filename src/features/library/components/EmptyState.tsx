import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

export const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 text-center animate-in fade-in zoom-in duration-500">
      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 text-3xl">
        🍳
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">履歴はありません</h3>
      <p className="text-gray-500 max-w-sm mb-6">
        まだレシピを生成していません。<br />
        YouTubeの動画からレシピを作ってみましょう。
      </p>
      <Link to="/">
        <Button size="lg" className="bg-orange-500 hover:bg-orange-600 font-bold px-8">
          レシピを生成する
        </Button>
      </Link>
    </div>
  );
};