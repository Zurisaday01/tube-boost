'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { ComboboxDataItem } from '@/types';

interface ComboboxProps {
  dataItems: Record<string, ComboboxDataItem[]>;
  placeholder: string;
  type: string;
  subType: string;
  isClearing: boolean;
  setClearing: (clearing: boolean) => void;
  onSelect: (value: string) => void;
}

export function ComboboxSublist({
  dataItems,
  placeholder,
  type,
  subType,
  isClearing,
  setClearing,
  onSelect
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [activeCategory, setActiveCategory] = React.useState<string | null>(
    null
  );
  const [value, setValue] = React.useState('');
  const [search, setSearch] = React.useState('');

  const categories = Object.keys(dataItems);

  const isCategorySelected = activeCategory !== null;

  const handleSelect = (selectedValue: string) => {
    setValue(selectedValue);
    onSelect(selectedValue); // notify parent of selection
    setSearch(''); // clear search on selection
    setOpen(false);
    setActiveCategory(null);
  };

  React.useEffect(() => {
    if (isClearing) {
      setValue('');
      onSelect(''); // notify parent of clearing
      setClearing(false);
    }
  }, [isClearing, onSelect, setClearing]);

  const handleCategoryClick = (category: string) => {
    setSearch(''); // clear search when switching category
    setActiveCategory(category === activeCategory ? null : category);
  };

  // Filter items based on search input
  const filteredItems = activeCategory
    ? dataItems[activeCategory].filter((item) =>
        item.label.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-[220px] justify-between rounded-full'
        >
          {value
            ? Object.values(dataItems)
                .flat()
                .find((item) => item.value === value)?.label
            : placeholder}
          <ChevronsUpDown className='opacity-50' />
        </Button>
      </PopoverTrigger>

      <PopoverContent className='w-[240px] p-0'>
        <Command>
          <CommandInput
            placeholder={`Search ${isCategorySelected ? subType : type}...`}
            className='h-9'
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>
              No {isCategorySelected ? subType : type} found.
            </CommandEmpty>

            {!activeCategory ? (
              <CommandGroup heading='Categories'>
                {categories.map((category) => (
                  <CommandItem
                    key={category}
                    onSelect={() => handleCategoryClick(category)}
                    className='flex justify-between'
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                    <ChevronRight className='h-4 w-4 opacity-70' />
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : (
              <CommandGroup
                heading={
                  <div className='flex items-center justify-between'>
                    <button
                      onClick={() => handleCategoryClick(activeCategory)}
                      className='text-muted-foreground text-sm hover:underline'
                    >
                      ← Back
                    </button>
                    <span className='font-medium capitalize'>
                      {activeCategory}
                    </span>
                  </div>
                }
              >
                {filteredItems.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={() => handleSelect(item.value)}
                  >
                    {item.label}
                    <Check
                      className={cn(
                        'ml-auto h-4 w-4',
                        value === item.value ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
