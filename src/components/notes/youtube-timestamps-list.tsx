import { useRef } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';

interface YouTubeTimestampsListProps {
  videoId: string;
  onLoad: () => void;
  timestamps: number[];
}

const YouTubeTimestampsList = ({
  videoId,
  onLoad,
  timestamps
}: YouTubeTimestampsListProps) => {
  const opts: YouTubeProps['opts'] = {
    width: 1000,
    height: 560,
    playerVars: { modestbranding: 1 }
  };

  const playerRef = useRef<any>(null);

  const onReady: YouTubeProps['onReady'] = (event) => {
    playerRef.current = event.target;
    // This is to hide the loading spinner in the parent component
    onLoad();
  };

  return (
    <div className='flex gap-5'>
      <YouTube videoId={videoId} opts={opts} onReady={onReady} />
      <div>
        <h2 className='mt-4 mb-2 text-lg font-semibold'>Timestamps</h2>
        <p className='text-muted-foreground'>
          Click on a timestamp to jump to that part of the video.
        </p>
        {timestamps.length === 0 && (
          <p className='mt-4 text-muted-foreground'>No timestamps available.</p>
        )}
        <ul className='mt-4 space-y-2'>
          {timestamps.map((timestamp, index) => (
            <li key={index}>
              <button
                className='text-primary underline'
                onClick={() => {
                  if (playerRef.current) {
                    playerRef.current.seekTo(timestamp, true);
                  }
                }}
              >
                {new Date(timestamp * 1000).toISOString().substr(11, 8)}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default YouTubeTimestampsList;
