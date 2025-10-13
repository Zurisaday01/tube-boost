import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { formatLocalDate } from '@/lib/utils';
import { TagGroupInformation } from '@/types';
import { Info } from 'lucide-react';
const TagGroupInformationSheet = ({
  details
}: {
  details: TagGroupInformation;
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="focus:bg-accent hover:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
          <Info className='size-4' />
          Tag Group Information
        </button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Tag Group Information</SheetTitle>
          <SheetDescription>
            Here is some information about this tag group.
          </SheetDescription>
          <ul>
            <li>
              <span className='font-semibold'>Modified:</span>{' '}
              {formatLocalDate(details.modified.toISOString().slice(0, 10))}
            </li>
            <li>
              <span className='font-semibold'>Created:</span>{' '}
              {formatLocalDate(details.created.toISOString().slice(0, 10))}
            </li>
          </ul>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
export default TagGroupInformationSheet;
