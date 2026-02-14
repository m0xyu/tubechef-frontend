import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const VideoCardSkeleton = () => {
    return (
        <Card className="rounded-2xl overflow-hidden border-none shadow-sm h-full">
      <div className="md:flex h-full">
        {/* 左側: サムネイル (スマホは上、PCは左半分) */}
        <div className="md:w-1/2 relative aspect-video md:aspect-auto md:h-full">
          <Skeleton className="w-full h-full absolute inset-0 md:relative" />
        </div>

        {/* 右側: コンテンツ */}
        <div className="p-6 md:w-1/2 flex flex-col justify-between gap-4">
          <div className="space-y-3">
            {/* タイトル (2行分) */}
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-2/3" />
            
            {/* チャンネル名 */}
            <div className="pt-2">
              <Skeleton className="h-4 w-1/3" />
            </div>
          </div>

          {/* ボタン */}
          <div className="pt-4 mt-auto">
             <Skeleton className="h-14 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </Card>
    );
}