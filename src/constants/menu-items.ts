import { MenuAction } from '@/types/menu-items';
import { ReactNode } from 'react';

interface SubcategoryMenuItemsProps {
  id: string;
  playlistId?: string;
  onRename?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onDelete?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onAssignUpdateType?: (e: React.MouseEvent<HTMLDivElement>) => void;
  assignUpdateLabel?: string;
  infoComponent?: ReactNode;
  changeColorComponent?: ReactNode;
}

// Subcategory Menu Items
export const getSubcategoryMenuItems = ({
  id,
  playlistId,
  onRename,
  onDelete,
  changeColorComponent,
  infoComponent
}: SubcategoryMenuItemsProps): MenuAction[] => [
  {
    type: 'link',
    label: 'See',
    icon: 'eye',
    href: `/dashboard/playlists/${playlistId}/subcategory/${id}`
  },
  {
    type: 'button',
    label: 'Rename',
    icon: 'pen',
    onClick: onRename
  },
  {
    type: 'button',
    label: 'Subcategory Information',
    icon: 'info',
    render: () => infoComponent
  },
  {
    type: 'change-color',
    render: () => changeColorComponent
  },
  {
    type: 'separator'
  },
  {
    type: 'button',
    label: 'Delete',
    icon: 'trash-2',
    onClick: onDelete
  }
];

// Tag Group Menu Items
export const getTagGroupMenuItems = ({
  id,
  onRename,
  onDelete,
  changeColorComponent,
  infoComponent
}: SubcategoryMenuItemsProps): MenuAction[] => [
  {
    type: 'link',
    label: 'See',
    icon: 'eye',
    href: `/dashboard/tag-groups/${id}`
  },
  {
    type: 'button',
    label: 'Update',
    icon: 'pen',
    onClick: onRename
  },
  {
    type: 'button',
    label: 'Tag Group Information',
    icon: 'info',
    render: () => infoComponent
  },
  {
    type: 'change-color',
    render: () => changeColorComponent
  },
  {
    type: 'separator'
  },
  {
    type: 'button',
    label: 'Delete',
    icon: 'trash-2',
    onClick: onDelete
  }
];

// Playlist Menu Items
export const getPlaylistMenuItems = ({
  onDelete,
  onRename,
  assignUpdateLabel,
  onAssignUpdateType,
}: SubcategoryMenuItemsProps): MenuAction[] => [
  {
    type: 'button',
    label: 'Rename',
    icon: 'pen',
    onClick: onRename
  },
  {
    type: 'button',
    label: assignUpdateLabel,
    icon: 'types',
    onClick: onAssignUpdateType
  },
  {
    type: 'separator'
  },
  {
    type: 'button',
    label: 'Delete',
    icon: 'trash-2',
    onClick: onDelete
  }
];

// Playlist Video Menu Items
export const getPlaylistVideoMenuItems = ({
  onDelete
}: SubcategoryMenuItemsProps): MenuAction[] => [
  {
    type: 'button',
    label: 'Delete',
    icon: 'trash-2',
    onClick: onDelete
  }
];

// Tag Group Menu Items
export const getPlaylistTypeMenuItems = ({
  id,
  onRename,
  onDelete,
  changeColorComponent,
  infoComponent
}: SubcategoryMenuItemsProps): MenuAction[] => [
  {
    type: 'link',
    label: 'See',
    icon: 'eye',
    href: `/dashboard/playlist-types/${id}`
  },
  {
    type: 'button',
    label: 'Update',
    icon: 'pen',
    onClick: onRename
  },
  {
    type: 'button',
    label: 'Playlist Type Information',
    icon: 'info',
    render: () => infoComponent
  },
  {
    type: 'change-color',
    render: () => changeColorComponent
  },
  {
    type: 'separator'
  },
  {
    type: 'button',
    label: 'Delete',
    icon: 'trash-2',
    onClick: onDelete
  }
];
