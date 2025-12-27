'use client';

import React, { useEffect, useRef, useState } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';

export default function ResizableYouTubePlayer({
  videoId,
  onReady,
  onStateChange
}: {
  videoId: string;
  onReady?: YouTubeProps['onReady'];
  onStateChange?: YouTubeProps['onStateChange'];
}) {
  const [width, setWidth] = useState(720);
  const [resizing, setResizing] = useState(false);
  const handleRef = useRef<HTMLDivElement>(null);

  // Mobile default
  useEffect(() => {
    if (window.innerWidth < 640) {
      setWidth(window.innerWidth - 16);
    }
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setResizing(true);
    handleRef.current?.setPointerCapture(e.pointerId);

    const startX = e.clientX;
    const startWidth = width;

    const onMove = (ev: PointerEvent) => {
      const nextWidth = startWidth + (ev.clientX - startX);

      setWidth(Math.min(Math.max(320, nextWidth), window.innerWidth - 16));
    };

    const onUp = () => {
      setResizing(false);
      handleRef.current?.releasePointerCapture(e.pointerId);
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
    };

    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  };

  const opts: YouTubeProps['opts'] = {
    width: '100%',
    height: '100%',
    playerVars: { modestbranding: 1 }
  };

  return (
    <div
      style={{
        width,
        aspectRatio: '16 / 9',
        position: 'relative',
        margin: '0 auto',
        border: `2px solid ${resizing ? 'red' : '#888'}`,
        borderRadius: 8,
        overflow: 'hidden'
      }}
    >
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={onReady}
        onStateChange={onStateChange}
        style={{ width: '100%', height: '100%' }}
      />

      {/* Resize handle */}
      <div
        ref={handleRef}
        onPointerDown={handlePointerDown}
        role='separator'
        aria-label='Resize video'
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: 36,
          height: 36,
          cursor: 'se-resize',
          touchAction: 'none'
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: 6,
            bottom: 6,
            width: 0,
            height: 0,
            borderLeft: '14px solid transparent',
            borderTop: '14px solid transparent',
            borderRight: '14px solid #FF0000',
            borderBottom: '14px solid #FF0000'
          }}
        />
      </div>
    </div>
  );
}
