'use client';
import { useState } from 'react';
import SearchYouTubeVideoForm from '../forms/search-youtube-video-form';
import { Subcategory, VideoData } from '@/types';
import Image from 'next/image';

import AddVideo from './add-video';

interface SearchVideoToAddProps {
  subcategories: Subcategory[];
  playlistId: string;
}

const SearchVideoToAdd = ({
  subcategories,
  playlistId
}: SearchVideoToAddProps) => {
  const [searchedVideo, setSearchedVideo] = useState<VideoData | null>(null);
  const [isSuccessfullyAdded, setIsSuccessfullyAdded] = useState(false);

  const subcategoryOptions = subcategories.map((subcategory) => ({
    label: subcategory.name,
    value: subcategory.id
  }));

  const handleVideoSelect = (video: VideoData) => {
    setSearchedVideo(video);
  };

  const handleVideoClear = () => {
    // this is for the AddVideo that displays the video details and add button
    setSearchedVideo(null);
    // this is to clear the input search
    setIsSuccessfullyAdded(true);
  }

  // in a new video the isSuccessfullyAdded should be false
  const handleNewSearch = () => {
    if (isSuccessfullyAdded) {
      setIsSuccessfullyAdded(false);
    }
  }

  return (
    <div className='w-full'>
      <div className='flex flex-col items-center gap-2 justify-self-start'>
        <h2 className='text-xl font-semibold'>
          Let&apos;s find something for your playlist
        </h2>
        <SearchYouTubeVideoForm onVideoSelect={handleVideoSelect} isSuccessfullyAdded={isSuccessfullyAdded} onNewSearch={handleNewSearch} />
      </div>
      {searchedVideo && (
        <div className='mt-4 w-full'>
          <h3 className='text-lg font-semibold'>Searched Video:</h3>
          <div className='mt-4 flex w-full items-center justify-between gap-2'>
            <div>
              <Image
                src={searchedVideo.thumbnails.high.url}
                alt={searchedVideo.title}
                className='size-20 rounded-md'
                width={searchedVideo.thumbnails.high.width}
                height={searchedVideo.thumbnails.high.height}
              />
            </div>

            <p>{searchedVideo.title}</p>
            <p>{searchedVideo.channelTitle}</p>

            <AddVideo
              subcategoryOptions={subcategoryOptions}
              searchedVideo={searchedVideo}
              playlistId={playlistId}
              onClear={handleVideoClear}
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default SearchVideoToAdd;
