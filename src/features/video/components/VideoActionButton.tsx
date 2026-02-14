import type { VideoActionType } from '@/types/api';
import { Link } from '@tanstack/react-router';


interface VideoActionButtonProps {
  actionType: VideoActionType;
  recipeSlug?: string | null;
  onGenerate: () => void;
  isGenerating?: boolean;
}

export const VideoActionButton = ({
  actionType,
  recipeSlug,
  onGenerate,
  isGenerating = false,
}: VideoActionButtonProps) => {

  // 共通のボタンスタイル（Tailwind）
  const baseButtonClass = "w-full py-4 rounded-xl font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2";
  const showProcessing = isGenerating || actionType === 'processing';

  switch (actionType) {
    case 'view_recipe':
      if (!recipeSlug) return null;

      return (
        <Link
          to="/recipes/$recipeId"
          params={{ recipeId: recipeSlug }}
          className={`${baseButtonClass} bg-orange-600 text-white hover:bg-orange-700 active:scale-[0.98]`}
        >
          📖 レシピを見る
        </Link>
      );

    case 'generate':
    case 'processing':
      return (
        <button
          onClick={onGenerate}
          disabled={showProcessing}
          className={`${baseButtonClass} bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.98] disabled:opacity-70 disabled:cursor-wait`}
        >
          {showProcessing ? (
            <>
              <span className="animate-spin">⏳</span> 生成中...
            </>
          ) : (
            '✨ この動画からレシピを生成'
          )}
        </button>
      );

    case 'limit_exceeded':
      return (
        <div className="w-full space-y-2">
          <button
            disabled
            className={`${baseButtonClass} bg-gray-300 text-gray-500 cursor-not-allowed shadow-none`}
          >
            🚫 この動画からレシピを生成できません
          </button>
          <p className="text-xs text-center text-gray-500 font-medium">
            ※ レシピの生成に失敗しました。他の動画をお試しください。
          </p>
        </div>
      );

    default:
      return null;
  }
};