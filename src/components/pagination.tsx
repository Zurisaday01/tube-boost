"use client";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import { cn } from '@/lib/utils';

type Props = {
  page: number;
  totalPages: number;
  pageSize: number;
  pageSizeKey?: string; // default = "pageSize"
  queryKey?: string; // default = "page"
  basePath?: string; // default = current path ("")
  pageSizeOptions?: number[];
};

export function PaginationFooter({
  page,
  totalPages,
  pageSize,
  pageSizeKey = 'pageSize',
  queryKey = 'page',
  basePath = '',
  pageSizeOptions = [5, 10, 20, 30, 50, 100]
}: Props) {
  const buildPageHref = (targetPage: number) => {
    const params = new URLSearchParams();
    params.set(queryKey, String(targetPage));
    params.set(pageSizeKey, String(pageSize));
    return `${basePath}?${params.toString()}`;
  };

  const buildPageSizeHref = (newSize: number) => {
    const params = new URLSearchParams();
    params.set(pageSizeKey, String(newSize));
    params.set(queryKey, '1'); // always reset to page 1
    return `${basePath}?${params.toString()}`;
  };

  // Pagination numbers with ellipsis
  const pages: (number | 'ellipsis')[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);

    if (page > 3) pages.push('ellipsis');

    for (let i = page - 1; i <= page + 1; i++) {
      if (i > 1 && i < totalPages) pages.push(i);
    }

    if (page < totalPages - 2) pages.push('ellipsis');

    pages.push(totalPages);
  }

  return (
    <div className='mt-4 flex w-full items-center justify-between'>
      {/* Page size selector */}
      <div className='flex items-center gap-2 w-fit'>
        <span className='text-muted-foreground text-sm w-28'>Rows per page:</span>

        <Select
          defaultValue={String(pageSize)}
          onValueChange={(value) => {
            // This navigates using a hard redirect (safe for a footer component)
            window.location.href = buildPageSizeHref(Number(value));
          }}
        >
          <SelectTrigger className='w-20'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Actual pagination */}
      <Pagination className='w-full'>
        <PaginationContent>
          {/* Previous */}
          <PaginationItem>
            <PaginationPrevious
              className={cn(page === 1 && 'pointer-events-none opacity-50')}
              href={page > 1 ? buildPageHref(page - 1) : undefined}
            />
          </PaginationItem>

          {/* Numbers */}
          {pages.map((p, idx) =>
            p === 'ellipsis' ? (
              <PaginationItem key={`e-${idx}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={p}>
                <PaginationLink href={buildPageHref(p)} isActive={p === page}>
                  {p}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          {/* Next */}
          <PaginationItem>
            <PaginationNext
              className={cn(
                page === totalPages && 'pointer-events-none opacity-50'
              )}
              href={page < totalPages ? buildPageHref(page + 1) : undefined}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
