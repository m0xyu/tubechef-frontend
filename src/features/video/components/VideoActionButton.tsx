import type { VideoActionType } from '@/types/api';
import { Link } from '@tanstack/react-router';
import { FaSpinner } from 'react-icons/fa';

interface VideoActionButtonProps {
  actionType: VideoActionType;
  recipeSlug?: string | null;
  onGenerate: () => void;
  isGenerating?: boolean;
  generationErrorMessage?: string | null;
}

export const VideoActionButton = ({
  actionType,
  recipeSlug,
  onGenerate,
  isGenerating = false,
  generationErrorMessage,
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
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2">
                <FaSpinner className="animate-spin" />
                <span>AIが解析中...</span>
              </div>
              <span className="text-[10px] font-normal opacity-80 mt-0.5">
                ※通常1分程度で完了します
              </span>
            </div>
          ) : (
            '✨ この動画からレシピを生成'
          )}
        </button>
      );

    case 'retry':
      return (
        <div className="w-full space-y-2">
          <button
            className={`${baseButtonClass} bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.98] disabled:opacity-70 disabled:cursor-wait`}
            onClick={onGenerate}
            disabled={showProcessing}
          >
            {showProcessing ? (
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2">
                  <FaSpinner className="animate-spin" />
                  <span>AIが再解析中...</span>
                </div>
                <span className="text-[10px] font-normal opacity-80 mt-0.5">
                  ※通常1分程度で完了します
                </span>
              </div>
            ) : (
              '🔄 レシピを再生成する'
            )}
          </button>
          <p className="text-sm text-center text-gray-800 font-medium">
            {generationErrorMessage || '※レシピの生成に失敗しました。もう一度お試しください'}
          </p>
        </div>
      );

    case 'limit_exceeded':
      return (
        <div className="w-full space-y-2">
          <button
            disabled
            className={`${baseButtonClass} text-sm bg-gray-300 text-gray-500 cursor-not-allowed shadow-none`}
          >
            🚫 この動画からレシピを生成できません
          </button>
          <p className="text-xs text-center text-gray-500 font-medium">
            {generationErrorMessage ? (
              <span>{generationErrorMessage}</span>
            ) : (
              '※レシピの生成に失敗しました。他の動画をお試しください。'
            )}
          </p>
        </div>
      );

    default:
      return null;
  }
};