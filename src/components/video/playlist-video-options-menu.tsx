'use client';

import { useState } from 'react';
import { EntityOptionsMenu } from '../options-menu/entity-options-menu';
import { getPlaylistVideoMenuItems } from '@/constants/menu-items';
import DeletePlaylistVideoAlert from '../dialog/delete-playlist-video-alert';
import MovePlaylistVideo from './move-playlist-video';
import { Subcategory } from '@/types';

interface PlaylistVideoOptionsMenuProps {
  id: string;
  title: string;
  subcategories: Subcategory[];
}

const PlaylistVideoOptionsMenu = ({
  id,
  title,
  subcategories
}: PlaylistVideoOptionsMenuProps) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const actions = getPlaylistVideoMenuItems({
    id,
    onDelete: (e) => {
      e.stopPropagation();
      setIsDeleteOpen(true);
    },
    movePlaylistVideoComponent: (
      <MovePlaylistVideo playlistVideoId={id} subcategories={subcategories} />
    )
  });

  return (
    <EntityOptionsMenu
      actions={actions}
      dialogs={
        <>
          <DeletePlaylistVideoAlert
            id={id}
            title={title}
            open={isDeleteOpen}
            onOpenChange={setIsDeleteOpen}
          />
        </>
      }
    />
  );
};
export default PlaylistVideoOptionsMenu;
