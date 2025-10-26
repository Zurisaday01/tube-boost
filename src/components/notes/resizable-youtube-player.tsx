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
  const [size, setSize] = useState({ width: 640, height: 360 });
  const [resizing, setResizing] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);

  const handlersRef = useRef<{
    handleMouseMove?: (e: MouseEvent) => void;
    handleMouseUp?: () => void;
  }>({});

  useEffect(() => {
    const handlersSnapshot = { ...handlersRef.current };
    return () => {
      if (handlersSnapshot.handleMouseMove) {
        document.removeEventListener(
          'mousemove',
          handlersSnapshot.handleMouseMove
        );
      }
      if (handlersSnapshot.handleMouseUp) {
        document.removeEventListener('mouseup', handlersSnapshot.handleMouseUp);
      }
    };
  }, []);

  const handleResize = (e: React.MouseEvent) => {
    e.preventDefault();
    setResizing(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = startWidth + (moveEvent.clientX - startX);
      const newHeight = startHeight + (moveEvent.clientY - startY);
      setSize({
        width: Math.max(320, newWidth),
        height: Math.max(180, newHeight)
      });
    };

    const handleMouseUp = () => {
      setResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      handlersRef.current = {};
    };

    handlersRef.current = { handleMouseMove, handleMouseUp };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const opts: YouTubeProps['opts'] = {
    width: size.width,
    height: size.height,
    playerVars: { modestbranding: 1 }
  };

  return (
    <div
      ref={playerRef}
      style={{
        width: size.width,
        height: size.height,
        position: 'relative',
        border: `2px solid ${resizing ? 'red' : '#888'}`,
        borderRadius: 8,
        overflow: 'hidden',
        transition: 'border-color 0.2s'
      }}
    >
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={onReady}
        onStateChange={onStateChange}
      />
      {/* Resize handle (bottom-right corner) */}
      <div
        onMouseDown={handleResize}
        style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: resizing ? 'red' : '#ccc',
          position: 'absolute',
          right: 0,
          bottom: 0,
          cursor: 'se-resize',
          transition: 'background 0.2s'
        }}
      />
    </div>
  );
}
