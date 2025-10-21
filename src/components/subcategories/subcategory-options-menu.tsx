'use client';

import RenameSubcategory from './rename-subcategory';
import { useState } from 'react';
import DeleteSubcategoryAlert from '../dialog/delete-subcategory-alert';
import ChangeColorMenuItem from '../options-menu/change-color-menu-item';
import { EntityOptionsMenu } from '../options-menu/entity-options-menu';
import { getSubcategoryMenuItems } from '@/constants/menu-items';
import InformationSheetMenuItem from '../options-menu/information-sheet-menu-item';
import { InformationSheetDetails } from '@/types';

interface SubcategoryOptionsMenuProps {
  id: string;
  name: string;
  details: InformationSheetDetails;
  onColorChange: (color: string) => void;
  currentColor: string;
  playlistId: string; // needed for rename subcategory
}

const SubcategoryOptionsMenu = ({
  details,
  onColorChange,
  currentColor,
  id,
  name,
  playlistId
}: SubcategoryOptionsMenuProps) => {
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const actions = getSubcategoryMenuItems({
    id,
    playlistId,
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
        label='Subcategory Information'
        entityType='subcategory'
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
          <RenameSubcategory
            id={id}
            name={name}
            playlistId={playlistId}
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
export default SubcategoryOptionsMenu;
