import { useEffect, useState, useRef } from 'react';
import { useParams } from '@tanstack/react-router';
import { apiClient } from '@/lib/apiClient';
import type { RecipeDetail, Ingredient, RecipeListItem } from '@/types/api';
import { RecipePlayer, type RecipePlayerRef } from '../components/RecipePlayer';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FaClock, FaUserFriends, FaPlay, FaLightbulb, FaExternalLinkAlt } from 'react-icons/fa';
import { FaCompress, FaExpand } from 'react-icons/fa';
import { useHistory } from '@/features/history/hooks/useHistory';

export function RecipeDetailPage() {
  const { recipeId } = useParams({ from: '/recipes/$recipeId' });
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMiniPlayer, setIsMiniPlayer] = useState(false);
  const { addToHistory } = useHistory();
  
  const playerRef = useRef<RecipePlayerRef>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await apiClient.get<{ data: RecipeDetail }>(`/api/recipes/${recipeId}`);
        setRecipe(res.data.data);
      } catch (error) {
        console.error('Failed to fetch recipe', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecipe();
  }, [recipeId]);

  useEffect(() => {
    if (!recipe) return;

    addToHistory({
      id: recipe.id,
      slug: recipe.slug,
      title: recipe.title,
      channel_name: recipe.channel.name, 
      thumbnail_url: recipe.video.thumbnail_url,
      cooking_time: recipe.cooking_time,
      dish: recipe.dish,
    } as RecipeListItem);
    
  }, [recipe, addToHistory]);

  // 時間フォーマット関数 (秒 -> mm:ss)
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const groupedIngredients = recipe?.ingredients.reduce((acc, curr) => {
    const group = curr.group || '材料';
    if (!acc[group]) acc[group] = [];
    acc[group].push(curr);
    return acc;
  }, {} as Record<string, Ingredient[]>) || {};

  if (isLoading) return <DetailSkeleton />;
  if (!recipe) return <div>Recipe not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{recipe.title}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-500 items-center">
          <span className="bg-gray-100 px-2 py-1 rounded">📺 {recipe.channel.name}</span>
          {recipe.cooking_time && <span className="flex items-center gap-1"><FaClock /> {recipe.cooking_time}</span>}
          {recipe.serving_size && <span className="flex items-center gap-1"><FaUserFriends /> {recipe.serving_size}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">        
        <div className="lg:col-span-1 space-y-6">
          <div className="lg:sticky lg:top-4 z-20 space-y-4">

            <div className="relative w-full aspect-video bg-gray-100 rounded-xl">
            
                <div 
                className={`
                    transition-all duration-300 ease-in-out z-50 overflow-visible
                    ${isMiniPlayer 
                    ? 'fixed bottom-24 right-4 w-50 shadow-2xl rounded-lg border-2 border-white bg-black' // スマホのタブバー等を考慮して bottom-24 くらいが安全
                    : 'absolute top-0 left-0 w-full h-full rounded-xl overflow-hidden shadow-lg'
                    }
                `}
                >
               
                {isMiniPlayer && (
                    <button
                    onClick={() => setIsMiniPlayer(false)}
                    className="absolute -top-3 -right-3 z-50 bg-gray-900 text-white p-2 rounded-full shadow-lg border border-white hover:bg-gray-700 transition-transform active:scale-95"
                    aria-label="元の位置に戻す"
                    >
                    <FaExpand size={12} />
                    </button>
                )}

                {/* YouTubeプレイヤー本体 */}
                <RecipePlayer 
                    ref={playerRef} 
                    videoId={recipe.video.video_id} 
                />
                </div>

                {isMiniPlayer && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-gray-100 rounded-xl border-2 border-dashed border-gray-200">
                    <FaExternalLinkAlt className="text-2xl mb-2 opacity-50" />
                    <span className="text-sm font-bold">右下で再生中...</span>
                    <button 
                    onClick={() => setIsMiniPlayer(false)}
                    className="mt-2 text-xs text-orange-600 underline"
                    >
                    ここに戻す
                    </button>
                </div>
                )}
            </div>
            {!isMiniPlayer && (
                <div className="flex justify-end">
                <button
                    onClick={() => setIsMiniPlayer(true)}
                    className="flex items-center gap-2 text-sm font-bold text-gray-600 bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-all active:scale-95"
                >
                    <FaCompress className="text-orange-500" />
                    <span>ながら見モードにする</span>
                </button>
                </div>
            )}

              {/* 材料リスト */}
              <Card className="p-6 shadow-sm border-orange-100">
                    <h2 className="font-bold text-xl mb-4 flex items-center gap-2">
                        🥕 材料 
                        <span className="text-sm font-normal text-gray-500">
                        {recipe.serving_size && `(${recipe.serving_size})`}
                        </span>
                    </h2>
                
                    <div className="space-y-4">
                        {Object.entries(groupedIngredients).map(([groupName, ingredients]) => (
                        <div key={groupName}>
                            {/* グループ名（'A'や'ソース'など）がある場合のみ表示、'材料'などのデフォルトは控えめに */}
                            {groupName !== '材料' && (
                            <h3 className="text-sm font-bold text-orange-600 mb-2 bg-orange-50 inline-block px-2 py-0.5 rounded">
                                {groupName}
                            </h3>
                            )}
                            <ul className="space-y-2 text-sm">
                            {ingredients.map((ing, idx) => (
                                <li key={idx} className="flex justify-between border-b border-dashed border-gray-100 pb-1 last:border-0">
                                <span className="text-gray-800">{ing.name}</span>
                                <span className="font-medium text-gray-900">{ing.quantity}</span>
                                </li>
                            ))}
                            </ul>
                        </div>
                        ))}
                    </div>
              </Card>
            </div>
          </div>
        
        {/* 右カラム: 調理手順 & コツ */}
        <div className="lg:col-span-2 space-y-8">
          
          {recipe.summary && (
            <div className="bg-orange-50 p-4 rounded-lg text-gray-700 leading-relaxed text-sm">
              {recipe.summary}
            </div>
          )}

          <section>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b-2 border-orange-500 pb-2 inline-block">
              調理手順
            </h2>
            
            <div className="space-y-6">
              {recipe.steps.map((step) => (
                <div key={step.step_number} className="flex gap-4 group">
                  {/* ステップ番号 */}
                  <div className="shrink-0">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 text-white font-bold text-lg shadow-md">
                      {step.step_number}
                    </span>
                  </div>

                  {/* 手順詳細 */}
                  <div className="flex-1 pt-1">
                    <p className="text-gray-800 leading-7 text-base mb-2">
                      {step.description}
                    </p>

                    {/* 再生ボタン (タイムスタンプがある場合) */}
                    {step.start_time_in_seconds !== null && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => playerRef.current?.seekTo(step.start_time_in_seconds!)}
                        className="text-orange-600 border-orange-200 hover:bg-orange-50 hover:text-orange-700 h-8 gap-1.5"
                      >
                        <FaPlay className="text-[10px]" />
                        <span className="text-xs font-bold">
                          {formatTime(step.start_time_in_seconds)} から再生
                        </span>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* コツ・ポイント */}
          {recipe.tips.length > 0 && (
            <section className="bg-yellow-50 rounded-xl p-6 border border-yellow-100">
              <h3 className="text-lg font-bold text-yellow-800 mb-4 flex items-center gap-2">
                <FaLightbulb /> コツ・ポイント
              </h3>
              <ul className="space-y-3">
                {recipe.tips.map((tip, idx) => (
                  <li key={idx} className="flex gap-2 text-sm text-gray-700">
                    <span className="text-yellow-500 mt-1">●</span>
                    <span>
                      {tip.description}
                      {tip.related_step_number && (
                        <span className="ml-2 text-xs text-gray-400">
                          (工程{tip.related_step_number}参照)
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
    );
  }

// 読み込み中スケルトン
function DetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-1/3" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <Skeleton className="aspect-video w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-24 w-full rounded-xl" />
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-4">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}