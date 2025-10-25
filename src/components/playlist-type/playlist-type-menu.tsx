'use client';

import { useState } from 'react';
import DeleteSubcategoryAlert from '../dialog/delete-subcategory-alert';
import ChangeColorMenuItem from '../options-menu/change-color-menu-item';
import { EntityOptionsMenu } from '../options-menu/entity-options-menu';
import { getPlaylistTypeMenuItems } from '@/constants/menu-items';
import InformationSheetMenuItem from '../options-menu/information-sheet-menu-item';
import { InformationSheetDetails } from '@/types';
import UpdatePlaylistType from './update-playlist-type';

interface SubcategoryOptionsMenuProps {
  id: string;
  name: string;
  description: string;
  details: InformationSheetDetails;
  onColorChange: (color: string) => void;
  currentColor: string;
}

const PlaylistTypeOptionsMenu = ({
  details,
  onColorChange,
  currentColor,
  id,
  name,
  description,
}: SubcategoryOptionsMenuProps) => {
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);


  const actions = getPlaylistTypeMenuItems({
    id,
    onRename: (e) => {
      e.stopPropagation();
      setIsRenameOpen(true);
    },
    onDelete: (e) => {
      e.stopPropagation();
      setIsDeleteOpen(true);
    },
    infoComponent: (
      <InformationSheetMenuItem
        details={details}
        label='Playlist Type Information'
        entityType='playlist-type'
      />
    ),
    changeColorComponent: (
      <ChangeColorMenuItem
        onColorChange={onColorChange}
        currentColor={currentColor}
      />
    )
  });

  return (
    <EntityOptionsMenu
      actions={actions}
      dialogs={
        <>
          <UpdatePlaylistType
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
      }
    />
  );
};
export default PlaylistTypeOptionsMenu;
