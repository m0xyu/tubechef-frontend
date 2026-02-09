import { useState } from 'react';
import { apiClient } from '../../../lib/apiClient';
import type { VideoPreview } from '../../../types/api';
import { FaSearch, FaSpinner } from 'react-icons/fa';

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
      const res = await apiClient.post<{ data: VideoPreview }>('/videos/preview', { url });
      setPreview(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || '動画情報の取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* 入力フォーム */}
      <form onSubmit={handlePreview} className="flex gap-2 mb-8">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="YouTubeのURLを貼り付け (例: https://youtu.be/...)"
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !url}
          className="bg-orange-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-600 disabled:opacity-50 flex items-center gap-2 transition-colors"
        >
          {isLoading ? <FaSpinner className="animate-spin" /> : <FaSearch />}
          プレビュー
        </button>
      </form>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {preview && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm animate-fade-in">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img 
                src={preview.thumbnail || ''} 
                alt={preview.title} 
                className="w-full h-full object-cover aspect-video"
              />
            </div>
            <div className="p-6 md:w-1/2 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                  {preview.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {preview.channel.title}
                </p>
              </div>
              
              <button 
                className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors"
                onClick={() => alert('次はここを作ります！')}
              >
                レシピを生成する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}