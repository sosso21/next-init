import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface PaginationProps {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  count: number;
  currentPage: number;
  link: string;
  take: number;
  className?: string;
}

export function SmartPagination({
  hasPreviousPage,
  hasNextPage,
  count,
  currentPage,
  link,
  take,
  className,
}: PaginationProps) {
  const totalPages = Math.ceil(count / take);
  const renderPageLinks = () => {
    const pages = [];
    for (
      let i = hasPreviousPage ? currentPage - 1 : currentPage;
      i <= (hasNextPage ? currentPage + 1 : currentPage);
      i++
    ) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            aria-label={`page ${i}`}
            href={`${link}/${i}`}
            isActive={i === currentPage}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return pages;
  };

  if (!hasPreviousPage && !hasNextPage) {
    return <></>;
  }

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem
          className={cn({ "pointer-events-none opacity-50": !hasPreviousPage })}
        >
          <PaginationPrevious
            aria-label="previous label"
            href={hasPreviousPage ? `${link}/${currentPage - 1}` : "#"}
            isActive={hasPreviousPage}
          />
        </PaginationItem>

        {currentPage > 2 && (
          <PaginationItem>
            <PaginationLink aria-label={`page 1`} href={`${link}/${1}`}>
              {1}
            </PaginationLink>
          </PaginationItem>
        )}

        {currentPage > 3 && <PaginationEllipsis />}

        {renderPageLinks()}

        {totalPages - currentPage > 2 && <PaginationEllipsis />}
        {totalPages - currentPage > 1 && (
          <PaginationItem>
            <PaginationLink
              aria-label={`last page`}
              href={`${link}/${totalPages}`}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}

        <PaginationItem
          className={cn({ "pointer-events-none opacity-50": !hasNextPage })}
        >
          <PaginationNext
            aria-label="next page"
            href={hasNextPage ? `${link}/${currentPage + 1}` : "#"}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
