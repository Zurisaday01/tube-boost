'use client';

import UpdateTagGroup from './update-tag-group';
import { useState } from 'react';
import DeleteTagGroupAlert from '../dialog/delete-tag-group-alert';
import { EntityOptionsMenu } from '../options-menu/entity-options-menu';
import ChangeColorMenuItem from '../options-menu/change-color-menu-item';
import { getTagGroupMenuItems } from '@/constants/menu-items';
import InformationSheetMenuItem from '../options-menu/information-sheet-menu-item';
import { InformationSheetDetails } from '@/types';

interface TagGroupOptionsMenuProps {
  id: string;
  name: string;
  description: string;
  details: InformationSheetDetails;
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

  const actions = getTagGroupMenuItems({
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
        label='Tag Group Information'
        entityType='tag group'
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
          <UpdateTagGroup
            id={id}
            name={name}
            description={description}
            open={isRenameOpen}
            onOpenChange={setIsRenameOpen}
          />
          <DeleteTagGroupAlert
            id={id}
            open={isDeleteOpen}
            onOpenChange={setIsDeleteOpen}
          />
        </>
      }
    />
  );
};
export default TagGroupOptionsMenu;
