import { Paintbrush } from 'lucide-react';
import { ChangeColor } from '../change-color';
import {
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent
} from '../ui/dropdown-menu';

interface ChangeColorMenuItemProps {
  onColorChange: (color: string) => void;
  currentColor: string;
}

const ChangeColorMenuItem = ({
  onColorChange,
  currentColor
}: ChangeColorMenuItemProps) => {
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className='flex' isPropagationStopped>
        <Paintbrush className='text-muted-foreground mr-2 size-4' />
        Change Color
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent onClick={(e) => e.stopPropagation()}>
        <ChangeColor
          onColorChange={onColorChange}
          currentColor={currentColor}
        />
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
};
export default ChangeColorMenuItem;
