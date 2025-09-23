'use client';

import { useState } from 'react';
import { ColorPicker } from '@/components/ui/color-picker';
import { Button } from '@/components/ui/button';

interface ChangeColorProps {
  onColorChange: (color: string) => void;
  currentColor: string;
}

export const ChangeColor = ({
  onColorChange,
  currentColor
}: ChangeColorProps) => {
  const [color, setColor] = useState<string>(currentColor);

  return (
    <div className='flex flex-col items-center justify-center space-y-2'>
      <div className='flex flex-col items-center gap-1 rounded-sm p-2'>
        <p>Pick a color</p>
        <ColorPicker
          onChange={(v) => {
            setColor(v as string);
          }}
          value={color}
        />
        <Button
          disabled={color === currentColor}
          variant='secondary'
          className='mt-2 w-full'
          onClick={() => onColorChange(color)}
        >
          Select Color
        </Button>
      </div>
    </div>
  );
};
