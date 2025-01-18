"use client";

import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import {
  useClientLocation,
  useClientTranslation,
} from "@/lib/use-translation/use-client-translation";
import { servicePage } from "@prisma/client";
import { getGalleries } from "@/server/gallery.action";
import { useQuery } from "@tanstack/react-query";
import { formatElapsedTime } from "@/lib/hermes-moment";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LockKeyhole, LockKeyholeOpen } from "lucide-react";
import { EditGallery } from "./edit-gallery-dialog";
import { createOrUpdateGalleryType } from "../[locale]/dashboard/create-gallery/types";
import Link from "next/link";

export type Gallery = {
  id: number;
  userId: string | null;
  slug: string;
  profilePicture: string | null;
  tumblrProfilePicture: string | null;
  category: servicePage | null;
  private: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
};

export function GalleryDataTable({
  checked = {},
  setChecked,
  addToFirstChecked = false,
}: {
  checked?: Record<string, boolean>;
  setChecked?: (checked: any) => void;
  addToFirstChecked?: boolean;
}) {
  const t = useClientTranslation("common");
  const location = useClientLocation();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [editGalley, setEditGallery] =
    useState<createOrUpdateGalleryType | null>(null);

  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({
    ...checked,
  });
  const checkedArray = Object.keys(checked).map(Number);
  const gallery: number | null =
    checkedArray.length == 1 && addToFirstChecked ? checkedArray[0] : null;

  const columns: ColumnDef<Gallery>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 capitalize">
          {row.original.private ? (
            <LockKeyhole size={"1rem"} className="mr" />
          ) : (
            <LockKeyholeOpen size={"1rem"} className="mr" />
          )}
          <i>{row.getValue("id")}</i>
        </div>
      ),
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("id")}
            <CaretSortIcon className="ml-2 w-4 h-4" />
          </Button>
        );
      },
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: "slug",
      cell: ({ row }) => (
        <div className="flex items-center gap-4 capitalize">
          <i className="relative w-8 h-8">
            <Image
              src={row.original.profilePicture as string}
              alt={row.getValue("slug") ?? ""}
              className="rounded-full object-cover"
              loading="lazy"
              placeholder={row.original.tumblrProfilePicture ? "blur" : "empty"}
              blurDataURL={row.original.tumblrProfilePicture as string}
              fill
            />
          </i>
          {row.getValue("slug")}
        </div>
      ),
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("slug")}
            <CaretSortIcon className="ml-2 w-4 h-4" />
          </Button>
        );
      },
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: "category",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("category")}
            <CaretSortIcon className="ml-2 w-4 h-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("category")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "createdAt",
      cell: ({ row }) => {
        const createdAt: Date = row.getValue("createdAt");

        return (
          <div className="text-right">
            {" "}
            {formatElapsedTime({ date: createdAt, locale: location })}{" "}
          </div>
        );
      },
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("createdAt")}
            <CaretSortIcon className="ml-2 w-4 h-4" />
          </Button>
        );
      },
      enableSorting: true,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const gallery = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-0 w-8 h-8">
                <span className="sr-only"> {t("actions")} </span>
                <DotsHorizontalIcon className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel> {t("actions")} </DropdownMenuLabel>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => navigator.clipboard.writeText(`${gallery.slug}`)}
              >
                {t("copy-id")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link
                  aria-label={`view content for galley ${gallery.slug}`}
                  href={`/${location}/gallery/${gallery.slug}`}
                >
                  {t("view-content")}{" "}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() =>
                  setEditGallery({
                    slug: gallery.slug,
                    profilePicture: gallery.profilePicture as string,
                    tumblrProfilePicture: gallery.tumblrProfilePicture,
                    private: gallery.private,
                    category: gallery.category as string,
                    id: gallery.id,
                  })
                }
              >
                {" "}
                {t("edit")}{" "}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const { data } = useQuery({
    queryKey: ["galeres", editGalley],
    queryFn: async () =>
      await getGalleries({
        where: {
          id: gallery
            ? {
                in: [gallery],
              }
            : undefined,
        },
        select: {
          id: true,
          slug: true,
          category: true,
          profilePicture: true,
          tumblrProfilePicture: true,
          private: true,
          createdAt: true,
        },
        orderBy: {
          id: "desc",
        },
      }).then((res) => {
        return res[0] as Gallery[];
      }),

    initialData: [],
  });

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getRowId: (row) => row.id.toString(),
    onRowSelectionChange: gallery
      ? undefined
      : (value) => {
          setRowSelection(value);
          setChecked ? setChecked(value) : null;
        },
    pageCount: 10,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder={t("search")}
          value={(table.getColumn("slug")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("slug")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              {t("columns")} <ChevronDownIcon className="ml-2 w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {t(column.id)}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  t{t("no-results")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end items-center space-x-2 py-4">
        <div>
          <Select
            onValueChange={(value) => table.setPageSize(Number(Number(value)))}
            value={table.getState().pagination.pageSize.toString()}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {[5, 10, 20, 50, 100].map((value) => (
                  <SelectItem key={value} value={value.toString()}>
                    {value}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 mx-4 text-sm">
          {t("row-selected")
            .split("{n1}")
            .join(String(table.getFilteredSelectedRowModel().rows.length))
            .split("{n2}")
            .join(String(table.getFilteredRowModel().rows.length))}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {t("Previous")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {t("Next")}
          </Button>
        </div>
      </div>

      <EditGallery
        galley={editGalley}
        handleClose={() => setEditGallery(null)}
      />
    </div>
  );
}
