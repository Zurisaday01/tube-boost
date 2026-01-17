'use client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { playlistSortOptions } from '@/constants/sorting';

interface SortByPlaylistProps {
  onClear: () => void;
  onSelect: (sortBy: string) => void;
}

const SortByPlaylist = ({ onClear, onSelect }: SortByPlaylistProps) => {
  return (
    <div>
      <h2 className='text-lg font-semibold'>Sort by</h2>
      <Select
        defaultValue='default'
        onValueChange={(value) => {
          if (value === 'default') {
            onClear();
          } else {
            onSelect(value);
          }
        }}
      >
        <SelectTrigger className='w-full sm:w-[180px] rounded-full'>
          <SelectValue placeholder='Sort by' />
        </SelectTrigger>
        <SelectContent>
          {playlistSortOptions.map((option) => (
            <SelectItem key={option.id} value={option.id}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SortByPlaylist;
