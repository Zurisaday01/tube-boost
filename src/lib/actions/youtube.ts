'use server';

export const getVideoData = async (videoId: string) => {
  const API_KEY = process.env['YOUTUBE_API_KEY'];
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${API_KEY}`
  );

  if (!res.ok) {
    throw new Error('Failed to fetch video data');
  }

  const data = await res.json();
  const video = data.items[0];

  if (!video) return null;

  const durationSeconds = parseDuration(video.contentDetails.duration);

  return {
    youtubeVideoId: video.id,
    title: video.snippet.title,
    channelId: video.snippet.channelId,
    channelTitle: video.snippet.channelTitle,
    duration: durationSeconds, // in seconds
    thumbnails: video.snippet.thumbnails
  };
};

// Helper: parse ISO 8601 duration (e.g., PT3M45S → 225 seconds)
function parseDuration(duration: string) {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  return hours * 3600 + minutes * 60 + seconds;
}

/*
{
    "youtubeVideoId": "jdJjh0bm5lQ",
    "title": "Dior - положение _ Polozheniye [GANGSTER RECORDS REMIX] Car Video",
    "channelId": "UCltdp3Q-Bnf5ZAgEDqfErAw",
    "channelTitle": "Gangster Records",
    "duration": 214,
    "thumbnails": {
        "default": {
            "url": "https://i.ytimg.com/vi/jdJjh0bm5lQ/default.jpg",
            "width": 120,
            "height": 90
        },
        "medium": {
            "url": "https://i.ytimg.com/vi/jdJjh0bm5lQ/mqdefault.jpg",
            "width": 320,
            "height": 180
        },
        "high": {
            "url": "https://i.ytimg.com/vi/jdJjh0bm5lQ/hqdefault.jpg",
            "width": 480,
            "height": 360
        },
        "standard": {
            "url": "https://i.ytimg.com/vi/jdJjh0bm5lQ/sddefault.jpg",
            "width": 640,
            "height": 480
        },
        "maxres": {
            "url": "https://i.ytimg.com/vi/jdJjh0bm5lQ/maxresdefault.jpg",
            "width": 1280,
            "height": 720
        }
    }
}

*/
