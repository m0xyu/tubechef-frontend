import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/apiClient';
import type { VideoPreview } from '@/types/api';
import { toast } from 'sonner';
import axios from 'axios';

export const useVideoLibrary = () => {
  const [videos, setVideos] = useState<VideoPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // 通信中のID管理
  const [generatingIds, setGeneratingIds] = useState<Set<string>>(new Set());

  // データ取得
  const fetchLibrary = useCallback(async (isPolling = false) => {
    try {
      if (!isPolling) setIsLoading(true);
      const res = await apiClient.get<{ data: VideoPreview[] }>('/api/user/library');
      setVideos(res.data.data);
    } catch (e) {
      console.error('履歴取得エラー', e);
    } finally {
      if (!isPolling) setIsLoading(false);
    }
  }, []);

  // 生成アクション
  const generateVideo = async (video: VideoPreview) => {
    if (generatingIds.has(video.video_id)) return;

    setGeneratingIds(prev => new Set(prev).add(video.video_id));
    try {
      await apiClient.post('/api/videos', { video_url: video.video_url });
      await fetchLibrary(true);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || '生成に失敗しました');
      }
    } finally {
      setGeneratingIds(prev => {
        const next = new Set(prev);
        next.delete(video.video_id);
        return next;
      });
    }
  };

  // 削除アクション
  const deleteLibraryVideo = async (videoId: string) => {
    if (!confirm('この履歴を削除しますか？')) return;

    // Optimistic UI update
    setVideos(prev => prev.filter(v => v.video_id !== videoId));
    toast.success("履歴を削除しました。");

    try {
      await apiClient.delete(`/api/user/library/${videoId}`);
    } catch (e) {
      console.error('削除失敗', e);
      toast.error('削除に失敗しました');
      fetchLibrary(true); // ロールバック
    }
  };

  // ポーリング設定
  useEffect(() => {
    fetchLibrary();
    const interval = setInterval(() => fetchLibrary(true), 6000);
    return () => clearInterval(interval);
  }, [fetchLibrary]);

  return {
    videos,
    isLoading,
    generatingIds,
    generateVideo,
    deleteLibraryVideo,
  };
};