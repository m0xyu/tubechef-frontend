import { useState } from 'react';
import { apiClient } from '@/lib/apiClient';
import type { VideoPreview } from '@/types/api';
import { FaPlay, FaSearch, FaSpinner } from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import axios from 'axios';

export function UrlInputForm() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<VideoPreview | null>(null);

  const handlePreview = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setPreview(null);

    try {
      const res = await apiClient.post<{ data: VideoPreview }>('/videos/preview', { video_url: url });
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
  
  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [
      h > 0 ? h : null,
      m.toString().padStart(h > 0 ? 2 : 1, '0'),
      s.toString().padStart(2, '0'),
    ].filter(Boolean).join(':');
  };

  

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handlePreview} className="flex gap-2 mb-8">
        <Input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="YouTubeのURLを貼り付け"
          className={`flex-1 h-12 border-gray-200 rounded-xl transition-all duration-200 ${
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
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* スケルトン表示 */}
      {isLoading && (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-xl animate-pulse">
          <div className="md:flex">
            <Skeleton className="md:w-1/2 aspect-video" />
            <div className="p-8 md:w-1/2 space-y-4">
              <Skeleton className="h-6 rounded w-5/6" />
              <Skeleton className="h-4 rounded w-full" />
              <Skeleton className="h-12 rounded-xl w-full mt-auto" />
            </div>
          </div>
        </div>
      )}

      {/* プレビュー表示 */}
      {preview && (
        <Card className="rounded-2xl py-0 overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-500 group/card animate-in fade-in slide-in-from-bottom-4">
          <div className="md:flex">
            <div className="md:w-1/2 relative overflow-hidden">
              <img 
                src={preview.thumbnail_url || ''} 
                alt={preview.title} 
                className="w-full h-full object-cover aspect-video md:scale-105"
              />
              {preview.duration && (
                <div className="absolute bottom-3 right-3 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  {formatDuration(preview.duration)}
                </div>
              )}
              <div className="absolute inset-0 bg-black/20 group-hover/card:bg-transparent transition-colors flex items-center justify-center">
                <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-orange-500 shadow-xl opacity-0 group-hover/card:opacity-100 transition-all scale-90 group-hover/card:scale-100">
                  <FaPlay className="ml-1" />
                </div>
              </div>
            </div>

            <div className="p-6 md:w-1/2 flex flex-col">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-xl line-clamp-2 leading-tight">
                  {preview.title}
                </CardTitle>
                <CardDescription className="items-center pt-2 ">
                  {preview.channel.name}
                </CardDescription>
              </CardHeader>
              
              <CardFooter className="p-0 mt-auto">
                <Button 
                  className="w-full bg-slate-900 hover:bg-orange-600 text-white py-6 rounded-xl font-bold text-base shadow-lg transition-all active:scale-[0.98]"
                  onClick={() => alert('レシピ生成開始！')}
                >
                  この動画からレシピを生成
                </Button>
              </CardFooter>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}