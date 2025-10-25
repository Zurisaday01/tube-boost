'use client';

import { useState } from 'react';
import DeletePlaylistAlert from '../dialog/delete-playlist-alert';
import { EntityOptionsMenu } from '../options-menu/entity-options-menu';
import { getPlaylistMenuItems } from '@/constants/menu-items';
import RenamePlaylist from './rename-playlist';
import AssignUpdatePlaylistType from '../playlist-type/assign-update-playlist-type';
import { PlaylistType } from '@prisma/client';

interface PlaylistOptionsMenuProps {
  id: string;
  title: string;
  playlistType: null | PlaylistType;
}

const PlaylistOptionsMenu = ({ id, title, playlistType }: PlaylistOptionsMenuProps) => {
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isTypeAssignUpdateOpen, setIsTypeAssignUpdateOpen] = useState(false);

  const actions = getPlaylistMenuItems({
    id,
    assignUpdateLabel: playlistType ? 'Update Playlist Type' : 'Assign Playlist Type',
    onDelete: (e) => {
      e.stopPropagation();
      setIsDeleteOpen(true);
    },
    onRename: (e) => {
      e.stopPropagation();
      setIsRenameOpen(true);
    },
    onAssignUpdateType: (e) => {
      e.stopPropagation();
      setIsTypeAssignUpdateOpen(true);
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
          <AssignUpdatePlaylistType
            id={id} 
            actionType={playlistType ? 'Update' : 'Assign'}
            open={isTypeAssignUpdateOpen}
            onOpenChange={setIsTypeAssignUpdateOpen}
          />
        </>
      }
    />
  );
};
export default PlaylistOptionsMenu;
