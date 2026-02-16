import { FaTrash } from 'react-icons/fa';
import type { VideoPreview } from '@/types/api';
import { VideoCard } from '@/features/video/components/VideoCard';
import { VideoCardSkeleton } from '@/features/video/components/VideoCardSkeleton';

interface LibraryListProps {
  videos: VideoPreview[];
  isLoading: boolean;
  generatingIds: Set<string>;
  onGenerate: (video: VideoPreview) => void;
  onDelete: (videoId: string) => void;
}

export const LibraryList = ({ 
  videos, 
  isLoading, 
  generatingIds, 
  onGenerate, 
  onDelete 
}: LibraryListProps) => {
  
  // 初回ロード中
  if (isLoading && videos.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <VideoCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // 動画リスト表示
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <div key={video.video_id} className="relative group">
          <VideoCard
            video={video}
            onGenerate={() => onGenerate(video)}
            isGenerating={generatingIds.has(video.video_id)}
          />

          {/* 削除ボタン (オーバーレイ) */}
          <button
            onClick={() => onDelete(video.video_id)}
            className="absolute -top-2 -right-2 z-10 p-2 bg-white rounded-full shadow-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 border border-gray-100"
            title="履歴から削除"
          >
            <FaTrash size={18} />
          </button>
        </div>
      ))}
    </div>
  );
};