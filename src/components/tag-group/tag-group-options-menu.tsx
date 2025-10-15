'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { EllipsisVertical, Eye, Paintbrush, Pen, Trash2 } from 'lucide-react';
import { TagGroupInformation } from '@/types';
import SubcategoryInformationSheet from './tag-group-Information-sheet';
import { ChangeColor } from '@/components/change-color';
import UpdateTagGroup from './update-tag-group';
import { useState } from 'react';
import DeleteSubcategoryAlert from '../dialog/delete-subcategory-alert';
import Link from 'next/link';

interface TagGroupOptionsMenuProps {
  id: string;
  name: string;
  description: string;
  details: TagGroupInformation;
  onColorChange: (color: string) => void;
  currentColor: string;
}

const TagGroupOptionsMenu = ({
  details,
  onColorChange,
  currentColor,
  id,
  name,
  description
}: TagGroupOptionsMenuProps) => {
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleRenameOpenChange = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation(); // Stop dropdown from closing
    setIsRenameOpen(true);
  };

  const handleDeleteOpenChange = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation(); // Stop dropdown from closing
    setIsDeleteOpen(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='ml-auto flex h-6 w-6 items-center justify-center rounded-full p-0 hover:bg-gray-200'
          >
            <EllipsisVertical className='h-2 w-2' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/tag-groups/${id}`}>
              <Eye className='size-4' />
              See
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleRenameOpenChange}>
            <Pen className='size-4' />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <SubcategoryInformationSheet details={details} />
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Paintbrush className='text-muted-foreground mr-2 size-4' />
              Change Color
            </DropdownMenuSubTrigger>

            <DropdownMenuSubContent>
              <ChangeColor
                onColorChange={onColorChange}
                currentColor={currentColor}
              />
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDeleteOpenChange}>
            <Trash2 className='size-4' />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialogs and Alerts (need to be outside <DropdownMenu> to function properly) */}
      <UpdateTagGroup
        id={id}
        name={name}
        description={description}
        open={isRenameOpen}
        onOpenChange={setIsRenameOpen}
      />
      <DeleteSubcategoryAlert
        id={id}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
      />
    </>
  );
};
export default TagGroupOptionsMenu;
