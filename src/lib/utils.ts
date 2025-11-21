import { ActionResponse } from '@/types/actions';
import { type ClassValue, clsx } from 'clsx';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: 'accurate' | 'normal';
  } = {}
) {
  const { decimals = 0, sizeType = 'normal' } = opts;

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === 'accurate'
      ? (accurateSizes[i] ?? 'Bytest')
      : (sizes[i] ?? 'Bytes')
  }`;
}

export function formatLocalDate(dateString: string, locale = 'en-US') {
  const [yearStr, monthStr, dayStr] = dateString.split('-');
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    return dateString; // fallback to original string if invalid
  }

  const date = new Date(year, month - 1, day); // month is 0-indexed
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function extractYouTubeVideoId(url: string): string | null {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.slice(1); // after the slash
    }

    if (parsed.hostname.includes('youtube.com')) {
      return parsed.searchParams.get('v');
    }

    return null;
  } catch {
    return null;
  }
}

export async function validateYouTubeVideo(url: string) {
  const videoId = extractYouTubeVideoId(url);

  if (!videoId) throw new Error('Invalid YouTube URL');

  const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;

  const res = await fetch(oembedUrl);
  if (!res.ok) throw new Error('Video not found');

  return await res.json(); // contains title, thumbnail, etc.
}

// Determine if we're in production environment
const isProduction = () => {
  if (typeof process !== 'undefined' && process.env) {
    return process.env.NODE_ENV === 'production';
  }
  // Fallback for browser - check if we're on the production domain
  if (typeof window !== 'undefined') {
    return window.location.hostname === 'collegehub.info';
  }
  // Default fallback
  return false;
};

// Development logger with colors for better visibility
export const devLog = {
  success: (...args: unknown[]) => {
    if (!isProduction()) {
      console.log(
        '%c✅ FORM SUCCESS',
        'color: #10b981; font-weight: bold;',
        ...args
      );
    }
  },
  error: (...args: unknown[]) => {
    if (!isProduction()) {
      console.error(
        '%c❌ FORM ERROR',
        'color: #ef4444; font-weight: bold;',
        ...args
      );
    }
  },
  warn: (...args: unknown[]) => {
    if (!isProduction()) {
      console.warn(
        '%c⚠️ FORM WARNING',
        'color: #f59e0b; font-weight: bold;',
        ...args
      );
    }
  },
  info: (...args: unknown[]) => {
    if (!isProduction()) {
      console.info(
        '%c🔵 FORM INFO',
        'color: #3b82f6; font-weight: bold;',
        ...args
      );
    }
  },
  debug: (...args: unknown[]) => {
    if (!isProduction()) {
      console.log(
        '%c🔍 FORM DEBUG',
        'color: #8b5cf6; font-weight: bold;',
        ...args
      );
    }
  },
  log: (...args: unknown[]) => {
    if (!isProduction()) {
      console.log(
        '%c📝 FORM LOG',
        'color: #64748b; font-weight: bold;',
        ...args
      );
    }
  }
};

// utility to convert hex to rgba with opacity
// Convert hex -> RGB
export const hexToRgb = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
};
// Calculate relative luminance (perceived brightness)
export const getLuminance = ({
  r,
  g,
  b
}: {
  r: number;
  g: number;
  b: number;
}) => {
  return 0.299 * r + 0.587 * g + 0.114 * b;
};

// Lighten by blending with white
export const lighten = (
  { r, g, b }: { r: number; g: number; b: number },
  strength = 0.8 // closer to 1 → closer to white
) => {
  return `rgb(
    ${Math.round(r + (255 - r) * strength)},
    ${Math.round(g + (255 - g) * strength)},
    ${Math.round(b + (255 - b) * strength)}
  )`;
};

// Return rgba with opacity
export const rgba = (
  { r, g, b }: { r: number; g: number; b: number },
  alpha: number
) => {
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/*
the extractor handles both:
Short link: https://youtu.be/RVdMAav0R-Y?list=RDRVdMAav0R-Y
pathname.slice(1) → "RVdMAav0R-Y"

Ignores ?list=...
Full URL: https://www.youtube.com/watch?v=RVdMAav0R-Y&t=30s

searchParams.get('v') → "RVdMAav0R-Y"

It basically checks the domain (youtu.be vs youtube.com) and extracts the video ID reliably, no matter which type of URL the user pastes.
*/

export const extractVideoId = (url: string): string | null => {
  try {
    const parsed = new URL(url);

    // Short URL: youtu.be/VIDEO_ID
    if (parsed.hostname === 'youtu.be') {
      return parsed.pathname.slice(1);
    }

    // Standard URL: youtube.com/watch?v=VIDEO_ID
    if (
      parsed.hostname.includes('youtube.com') &&
      parsed.searchParams.has('v')
    ) {
      return parsed.searchParams.get('v');
    }

    // Other cases (optional: share links, embed URLs)
    return null;
  } catch {
    return null;
  }
};

/*
| Seconds | Output |
| ------- | ------ |
| 45      | 45s    |
| 214     | 3m     |
| 3730    | 1h 2m  |
| 7200    | 2h     |
| 7265    | 2h 1m  |
*/
export const formatDuration = (seconds: number): string => {
  const truncated = Math.floor(seconds);

  if (truncated < 60) return `${truncated}s`; // less than a minute → seconds
  if (truncated < 3600) return `${Math.floor(truncated / 60)}m`; // less than an hour → minutes

  const h = Math.floor(truncated / 3600);
  const m = Math.floor((truncated % 3600) / 60);
  return m === 0 ? `${h}h` : `${h}h ${m}m`; // over an hour → hours + optional minutes
};

export const formatTimestampTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const handleActionResponse = (
  response: ActionResponse,
  onSuccess?: () => void
) => {
  const { status, message } = response;

  if (status === 'success') {
    toast.success(message);
    onSuccess?.();
  } else if (status === 'error') {
    toast.error(message);
  }
};

type BlockContent = {
  type: string;
  text: string;
  styles?: any;
};

type EditorBlock = {
  id: string;
  type: string;
  content?: BlockContent[]; // content is an array of text objects
  children?: EditorBlock[];
};

export function extractTextFromBlocks(blocks: any): string {
  if (typeof blocks === 'string') {
    try {
      if (!blocks.trim()) return ''; // Handle empty strings safely
      blocks = JSON.parse(blocks);
    } catch (e) {
      console.error('Error parsing JSON:', e);
      return '';
    }
  }

  // 2. Now validation: Ensure we have an array (whether it came from string or was already an array)
  if (!Array.isArray(blocks)) {
    return '';
  }

  return blocks
    .map((block: EditorBlock) => {
      // 1. Extract text from the current block's content array
      const currentText = block.content
        ? block.content.map((c) => c.text ?? '').join(' ')
        : '';

      // 2. (Optional) Recursively get text from children if you use nested lists
      const childrenText = block.children
        ? extractTextFromBlocks(block.children)
        : '';

      return `${currentText} ${childrenText}`;
    })
    .filter((text) => text.trim() !== '') // Remove empty lines (like timestamps)
    .join('\n');
}
