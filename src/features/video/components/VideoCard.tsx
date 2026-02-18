import { FaPlay } from 'react-icons/fa';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { VideoActionButton } from './VideoActionButton';
import type { VideoPreview } from '@/types/api';

interface VideoCardProps {
  video: VideoPreview;
  onGenerate: () => void;
  isGenerating?: boolean;
}

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

export const VideoCard = ({
    video,
    onGenerate,
    isGenerating = false,
}: VideoCardProps) => {
    return (
        <Card className="rounded-2xl py-0 overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-500 group/card animate-in fade-in slide-in-from-bottom-4">
          <div className="md:flex">
            <div className="md:w-1/2 relative overflow-hidden">
              <img 
                src={video.thumbnail_url || ''} 
                alt={video.title} 
                className="w-full h-full object-cover aspect-video md:scale-105"
              />
              {video.duration && (
                <div className="absolute bottom-3 right-3 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  {formatDuration(video.duration)}
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
                  {video.title}
                </CardTitle>
                <CardDescription className="items-center pt-2 ">
                  {video.channel.name}
                </CardDescription>
              </CardHeader>
              
              <CardFooter className="p-0 mt-auto">
                <VideoActionButton
                  actionType={video.action_type}
                  recipeSlug={video.recipe_slug}
                  onGenerate={onGenerate}
                  isGenerating={isGenerating}
                  generationErrorMessage={video.recipe_generation_error_message}
                />
              </CardFooter>
            </div>
          </div>
        </Card>
    );
}