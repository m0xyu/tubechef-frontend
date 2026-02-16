import { useEffect, useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useAuth } from '@/context/AuthContext';
import { UrlInputForm } from '@/features/video/components/UrlInputForm';
import { Button } from '@/components/ui/button';
import { FaArrowRight, FaHistory, FaSignInAlt, FaFire } from 'react-icons/fa';
import { useHistory } from '@/features/history/hooks/useHistory';
import { apiClient } from '@/lib/apiClient';
import type { RecipeListItem } from '@/types/api';
import { RecipeCard } from '@/features/recipes/components/RecipeCard';
import { Skeleton } from '@/components/ui/skeleton';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const { user } = useAuth();
  const { history: browsingHistory } = useHistory();
  
  const [recipes, setRecipes] = useState<RecipeListItem[]>([]);
  const [isLoadingPublic, setIsLoadingPublic] = useState(true);

  useEffect(() => {
    const fetchPublicRecipes = async () => {
      try {
        const res = await apiClient.get<{ data: RecipeListItem[] }>('/api/recipes');
        setRecipes(res.data.data);
      } catch (e) {
        console.error('公開レシピの取得に失敗', e);
        setRecipes([]);
      } finally {
        setIsLoadingPublic(false);
      }
    };
    fetchPublicRecipes();
  }, []);

  const recentHistory = browsingHistory.slice(0, 3);
  const recentRecipes = recipes.slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl space-y-16">
      
      <section className="text-center space-y-6">
        {user ? (
          <div className="animate-in fade-in zoom-in duration-500">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              今日はどの動画を<span className="text-orange-500">料理</span>しますか？
            </h1>
            <p className="text-gray-500 mb-8">YouTubeのURLを貼り付けて、自分だけのレシピを作りましょう。</p>
            <div className="max-w-2xl mx-auto p-1 rounded-2xl">
              <UrlInputForm />
            </div>
          </div>
        ) : (
          <div className="py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-block px-4 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-bold mb-4">
               AI Recipe Generator
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
              動画の<span className="text-orange-500">「おいしそう」</span>を、<br />
              文字の<span className="text-orange-500">「見やすさ」</span>に。
            </h1>
            
            <p className="text-lg text-gray-600 max-w-xl mx-auto leading-tight mb-8">
              動画を何度も止めたり、巻き戻したりする必要はありません。<br />
              AIが材料と手順を書き起こし、あなたの料理をスムーズにします。
            </p>
            <Link to="/login">
              <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 h-12 rounded-xl shadow-lg hover:shadow-xl transition-all">
                <FaSignInAlt className="mr-2" /> ログインしてレシピを作る
              </Button>
            </Link>
          </div>
        )}
      </section>


      <div className="grid grid-cols-1 gap-16">        
        <section>
          <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-2">
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
              <FaFire className="text-orange-500" />
              みんなの最新レシピ
            </h2>
            <Link to="/recipes" search={{ page: 1 }} className="text-sm text-gray-500 hover:text-orange-500 flex items-center gap-1 font-medium transition-colors">
              すべて見る <FaArrowRight size={12} />
            </Link>
          </div>

          {isLoadingPublic ? (
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex flex-col space-y-3">
                    <Skeleton className="h-50 w-full rounded-xl" />
                    <div className="space-y-2 p-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
          ) : recentRecipes.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {recentRecipes.map(recipe => (
                <div key={recipe.slug} className="transition-transform hover:-translate-y-1 duration-300">
                  <RecipeCard recipe={recipe} />
                </div>
              ))}
            </div>
          ) : (
             <div className="bg-gray-50 rounded-2xl p-8 text-center border border-dashed border-gray-200">
                <div className="text-4xl mb-2">🍳</div>
                <p className="text-gray-500 text-sm font-medium">まだ投稿されたレシピはありません</p>
             </div>
          )}
        </section>


        <section>
          <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-2">
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
              <FaHistory className="text-blue-500" />
              最近見たレシピ
            </h2>
            <Link to="/history" className="text-sm text-gray-500 hover:text-blue-500 flex items-center gap-1 font-medium transition-colors">
              すべて見る <FaArrowRight size={12} />
            </Link>
          </div>

          {recentHistory.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {recentHistory.map(recipe => (
                 <div key={recipe.slug} className="transition-transform hover:-translate-y-1 duration-300">
                    <RecipeCard recipe={recipe} />
                 </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-8 text-center border border-dashed border-gray-200">
               <div className="text-4xl mb-2">🕰️</div>
               <p className="text-gray-500 text-sm font-medium">閲覧履歴はありません。<br/>気になる動画をチェック！</p>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}