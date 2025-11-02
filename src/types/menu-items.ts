import { Icons } from '@/components/icons';
import { ReactNode } from 'react';

export interface MenuAction {
  type: 'link' | 'button' | 'separator' | 'change-color';
  label?: string;
  icon?: keyof typeof Icons;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  href?: string;
  render?: () => ReactNode;
}
