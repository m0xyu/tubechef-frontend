import { useState, useEffect, useRef, useCallback } from 'react';
import { apiClient } from '@/lib/apiClient';
import type { VideoPreview } from '@/types/api';

type PollingStatus = 'idle' | 'processing' | 'completed' | 'failed';

interface UseRecipePollingProps {
  initialVideo: VideoPreview | null;
  onComplete?: (updatedVideo: Partial<VideoPreview>) => void;
}

export const useRecipePolling = ({ initialVideo, onComplete }: UseRecipePollingProps) => {
  const [status, setStatus] = useState<PollingStatus>('idle');
  const [lastVideoId, setLastVideoId] = useState<string | null>(null);
  const [lastGenerationStatus, setLastGenerationStatus] = useState<string | null>(null);

  const currentVideoId = initialVideo?.video_id || null;
  const currentGenerationStatus = initialVideo?.recipe_generation_status || null;
  if (currentVideoId !== lastVideoId || currentGenerationStatus !== lastGenerationStatus) {
    setLastVideoId(currentVideoId);
    setLastGenerationStatus(currentGenerationStatus);
    
    // APIから 'processing' が返ってきたら、即座にポーリング状態にする
    if (currentGenerationStatus === 'processing') {
      setStatus('processing');
    } else if (status !== 'completed') {
      // 完了済みでなければ idle に戻す
      setStatus('idle');
    }
  }

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const intervalIdRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
  }, []);

  const startInterval = useCallback((videoId: string) => {
    // 既存タイマーのクリア
    if (intervalIdRef.current) clearInterval(intervalIdRef.current);

    intervalIdRef.current = setInterval(async () => {
      try {
        const res = await apiClient.get<{ 
            status: string; 
            action_type: string; 
            recipe_slug?: string 
        }>(`/videos/${videoId}/status`);

        const data = res.data;

        if (data.status === 'completed') {
          setStatus('completed');
          stopPolling();
          
          // Ref経由で最新の関数を呼ぶ
          if (onCompleteRef.current) {
            onCompleteRef.current({
              action_type: 'view_recipe',
              recipe_slug: data.recipe_slug,
              recipe_generation_status: 'completed'
            } as Partial<VideoPreview>);
          }
        } else if (data.status === 'failed') {
          setStatus('failed');
          stopPolling();
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 3000);
  }, [stopPolling]); 

  const startPolling = useCallback((videoId: string) => {
    setStatus('processing');
    startInterval(videoId);
  }, [startInterval]);

  // useEffect
  useEffect(() => {
    if (status === 'processing' && initialVideo?.video_id) {
      startInterval(initialVideo.video_id);
    }

    return () => {
      stopPolling();
    };
  }, [status, initialVideo?.video_id, startInterval, stopPolling]);

  return {
    isPolling: status === 'processing',
    pollingStatus: status,
    startPolling,
  };
};