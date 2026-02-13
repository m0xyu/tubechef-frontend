import { forwardRef, useImperativeHandle, useRef } from 'react';
import YouTube, { type YouTubeProps, type YouTubePlayer } from 'react-youtube';

interface RecipePlayerProps {
  videoId: string;
}

export interface RecipePlayerRef {
  seekTo: (seconds: number) => void;
}

export const RecipePlayer = forwardRef<RecipePlayerRef, RecipePlayerProps>(({ videoId }, ref) => {
  const playerRef = useRef<YouTubePlayer | null>(null);

  const onReady: YouTubeProps['onReady'] = (event) => {
    playerRef.current = event.target;
  };

  useImperativeHandle(ref, () => ({
    seekTo: (seconds: number) => {
      if (playerRef.current) {
        playerRef.current.seekTo(seconds, true); // true = 即座に再生
        playerRef.current.playVideo();
      }
    },
  }));

  const opts: YouTubeProps['opts'] = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
      rel: 0, // 関連動画を非表示（現在は完全に消せない仕様だが最小限にする）
    },
  };

  return (
    <div className="relative w-full pt-[56.25%] rounded-xl overflow-hidden bg-black shadow-lg">
      <div className="absolute top-0 left-0 w-full h-full">
        <YouTube
          videoId={videoId}
          opts={opts}
          onReady={onReady}
          className="w-full h-full"
          iframeClassName="w-full h-full"
        />
      </div>
    </div>
  );
});

RecipePlayer.displayName = 'RecipePlayer';