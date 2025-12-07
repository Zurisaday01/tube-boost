import { useEffect, useState } from 'react';

export function useMediaQuery() {
  const [isOpen, setIsOpen] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    setIsOpen(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setIsOpen(e.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return { isOpen };
}
