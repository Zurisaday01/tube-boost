'use client';

import { useState } from 'react';
import { EntityOptionsMenu } from '../options-menu/entity-options-menu';
import { getPlaylistVideoMenuItems } from '@/constants/menu-items';
import DeletePlaylistVideoAlert from '../dialog/delete-playlist-video-alert';

interface PlaylistVideoOptionsMenuProps {
  id: string;
  title: string;
}

const PlaylistVideoOptionsMenu = ({
  id,
  title
}: PlaylistVideoOptionsMenuProps) => {
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const actions = getPlaylistVideoMenuItems({
    id,
    onDelete: (e) => {
      e.stopPropagation();
      setIsDeleteOpen(true);
    }
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
