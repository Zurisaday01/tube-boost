import { Icons } from '@/components/icons';
import { ReactNode } from 'react';

export interface MenuAction {
  type: 'link' | 'button' | 'submenu' | 'separator' | 'change-color';
  label?: string;
  icon?: keyof typeof Icons;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  href?: string;
  submenu?: ReactNode;
  render?: () => ReactNode;
}
