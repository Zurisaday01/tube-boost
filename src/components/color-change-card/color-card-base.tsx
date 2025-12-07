'use client';
import { useMemo, useState } from 'react';
import { getLuminance, hexToRgb, lighten, rgba } from '@/lib/utils';
import Link from 'next/link';
import { useTheme } from 'next-themes';

interface ColorCardBaseProps {
  id: string;
  name: string;
  initialColor: string;
  href: string;
  Icon: React.ComponentType<any>;
  OptionsMenu: React.ReactNode;
}

const ColorCardBase = ({
  id,
  name,
  initialColor: color,
  href,
  Icon,
  OptionsMenu
}: ColorCardBaseProps) => {
  const { theme } = useTheme();

  // Background color
  const bgColor = useMemo(() => {
    const rgb = hexToRgb(color);
    const lum = getLuminance(rgb);

    if (color.toLowerCase() === '#000000') {
      return theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)';
    }

    const isDark = lum < 128;

    if (theme === 'dark') {
      return isDark ? rgba(rgb, 0.35) : rgba(rgb, 0.15);
    }

    return isDark ? lighten(rgb, 0.95) : rgba(rgb, 0.2);
  }, [color, theme]);

  // Icon color
  const rgb = hexToRgb(color);
  const lum = getLuminance(rgb);

  const iconColor = theme === 'dark' && lum < 40 ? '#ffffff' : color;

  return (
    <Link
      href={href}
      className='flex items-center gap-3 rounded-md p-3'
      style={{ backgroundColor: bgColor }}
    >
      <Icon className='size-7' style={{ color: iconColor }} />

      <p>{name}</p>

      {OptionsMenu}
    </Link>
  );
};

export default ColorCardBase;
