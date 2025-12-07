import { getLuminance, hexToRgb, lighten, rgba } from '@/lib/utils';
import { useTheme } from 'next-themes';

export function useTagColors(rawColor?: string) {
  const { theme, resolvedTheme } = useTheme();
  const activeTheme = theme === 'system' ? resolvedTheme : theme;

  const color = /^#([0-9a-fA-F]{6})$/.test(rawColor ?? '')
    ? rawColor!
    : '#888888';
  const rgb = hexToRgb(color);

  const luminance = getLuminance(rgb);
  const isDarkColor = luminance < 128;
  const lumNorm = luminance / 255;

  const dynamicBright = 0.05 + (1 - lumNorm) * 0.3;
  const lightThemeBrightFactor = 0.82 + lumNorm * 0.12;

  const bgColor =
    activeTheme === 'dark'
      ? rgba(rgb, isDarkColor ? 0.35 : 0.25)
      : isDarkColor
        ? lighten(rgb, lightThemeBrightFactor)
        : rgba(rgb, 0.2);

  const displayColor =
    activeTheme === 'dark' ? lighten(rgb, dynamicBright) : color;

  return { bgColor, displayColor, color };
}
