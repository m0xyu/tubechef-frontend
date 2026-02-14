import { createFileRoute, Link } from '@tanstack/react-router';
import { FaHistory } from 'react-icons/fa';
import { Button } from '@/components/ui/button';

import { useVideoLibrary } from '@/features/library/hooks/useVideoLibrary';
import { LibraryList } from '@/features/library/components/LibraryList';
import { EmptyState } from '@/features/library/components/EmptyState';

export const Route = createFileRoute('/_authenticated/library')({
  component: LibraryPage,
});

function LibraryPage() {
  const { videos, isLoading, generatingIds, generateVideo, deleteLibraryVideo } = useVideoLibrary();

  const isEmpty = !isLoading && videos.length === 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* ヘッダーエリア */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-100 rounded-xl text-orange-600">
            <FaHistory className="text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">ライブラリ</h1>
            <p className="text-sm text-gray-500">生成したレシピの履歴とステータス</p>
          </div>
        </div>
        
        <Link to="/" className="w-full md:w-auto">
          <Button className="w-full font-bold bg-slate-900 hover:bg-slate-800">
            + 新しい動画から作る
          </Button>
        </Link>
      </div>

      {isEmpty ? (
        <EmptyState />
      ) : (
        <LibraryList 
          videos={videos}
          isLoading={isLoading}
          generatingIds={generatingIds}
          onGenerate={generateVideo}
          onDelete={deleteLibraryVideo}
        />
      )}
    </div>
  );
}