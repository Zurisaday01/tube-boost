'use client';

import { useState } from 'react';
import DeletePlaylistAlert from '../dialog/delete-playlist-alert';
import { EntityOptionsMenu } from '../options-menu/entity-options-menu';
import { getPlaylistMenuItems } from '@/constants/menu-items';
import RenamePlaylist from './rename-playlist';

interface PlaylistOptionsMenuProps {
  id: string;
  title: string;
}

const PlaylistOptionsMenu = ({ id, title }: PlaylistOptionsMenuProps) => {
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const actions = getPlaylistMenuItems({
    id,
    onDelete: (e) => {
      e.stopPropagation();
      setIsDeleteOpen(true);
    },
    onRename: (e) => {
      e.stopPropagation();
      setIsRenameOpen(true);
    }
  });

  return (
    <EntityOptionsMenu
      actions={actions}
      dialogs={
        <>
          <RenamePlaylist
            id={id}
            title={title}
            open={isRenameOpen}
            onOpenChange={setIsRenameOpen}
          />
          <DeletePlaylistAlert
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
export default PlaylistOptionsMenu;
