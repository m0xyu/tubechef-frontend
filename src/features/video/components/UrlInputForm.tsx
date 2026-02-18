import { useState } from 'react';
import { apiClient } from '@/lib/apiClient';
import type { VideoPreview } from '@/types/api';
import { FaSearch, FaSpinner } from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import axios from 'axios';
import { useRecipePolling } from '@/features/recipes/hooks/useRecipePolling';
import { VideoCard } from './VideoCard';
import { Link } from '@tanstack/react-router';

export function UrlInputForm() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<VideoPreview | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePreview = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setPreview(null);

    try {
      const res = await apiClient.post<{ data: VideoPreview }>('/api/videos/preview', { video_url: url });
      setPreview(res.data.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
       setError(err.response?.data?.message || '動画情報の取得に失敗しました');
      } else {
        setError('予期せぬエラーが発生しました');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!preview) return;
    setIsGenerating(true);

    try {
      const res = await apiClient.post<{ data: VideoPreview }>('/api/videos', { video_url: url });
      setPreview(res.data.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'レシピの生成に失敗しました');
      } else {
        setError('予期せぬエラーが発生しました');
      }
    } finally {
      setIsGenerating(false);
    }
  }

  const { isPolling } = useRecipePolling({
    initialVideo: preview,
    onComplete: (updatedData) => {
      setPreview((prev) => prev ? { ...prev, ...updatedData } : null);
    }
  });

  const showProcessing = isGenerating || preview?.action_type === 'processing';

  console.log(preview);
  
  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handlePreview} className="flex gap-2">
        <Input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="YouTubeのURLを貼り付け"
          className={`flex-1 h-12 border-gray-200 rounded-xl transition-all duration-200 bg-white ${
            error 
              ? 'border-red-500 focus-visible:ring-red-500 shadow-[0_0_0_2px_rgba(239,68,68,0.1)]' 
              : 'focus-visible:ring-orange-500 focus-visible:border-orange-500'
          }`}
          disabled={isLoading} 
        />
        <Button 
        type="submit" 
        disabled={isLoading || !url} 
        className="flex h-12 items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-600 disabled:opacity-50 transition-colors">
          {isLoading ? <FaSpinner className="animate-spin" /> : <FaSearch />}
          プレビュー
        </Button>
      </form>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mt-6">
          {error}
        </div>
      )}

      {/* スケルトン表示 */}
     {isLoading && (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-xl mt-6">
          <div className="md:flex">
            <Skeleton className="md:w-1/2 aspect-video" />
            <div className="p-6 md:w-1/2 flex flex-col gap-4">
              <Skeleton className="h-7 w-3/4 rounded-md" />
              <Skeleton className="h-4 w-1/2 rounded-md" />
              <Skeleton className="h-12 w-full rounded-xl mt-auto" />
            </div>
          </div>
        </div>
      )}

      {/* プレビュー表示 */}
      {preview && (
        <div className='mt-6'>
          <VideoCard
            video={preview}
            onGenerate={handleGenerate}
            isGenerating={isGenerating || isPolling}
          />
          {showProcessing && (
            <div className="mt-4 p-4 rounded-xl bg-orange-50/80 border border-orange-100 animate-in fade-in slide-in-from-top-2">
              <div className="gap-3 text-center">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-orange-800">
                    レシピを生成しています
                  </p>
                  <p className="text-xs leading-relaxed">
                    完了まであと1分ほどお待ちください。
                    <Link to='/library' className='underline font-bold text-orange-500'>生成したレシピ</Link>から確認できます。
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}