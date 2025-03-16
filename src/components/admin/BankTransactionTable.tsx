import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, ChevronDown, ChevronUp } from "lucide-react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  Row,
  RowSelectionState,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

export interface BankTransaction {
  id: number;
  date: string;
  docNumber: string;
  debit: number;
  credit: number;
  balance: number;
  description: string;
}

interface BankTransactionTableProps {
  transactions: BankTransaction[];
  onBulkAction?: (selectedIds: number[]) => void;
  isBulkLoading?: boolean;
}

export const BankTransactionTable: React.FC<BankTransactionTableProps> = ({
  transactions,
  onBulkAction,
  isBulkLoading = false,
}) => {
  const { t } = useTranslation();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const columns = useMemo<ColumnDef<BankTransaction>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ? true : table.getIsSomePageRowsSelected() ? "indeterminate" : false
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label={t("transactions.selectAll")}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label={t("transactions.select")}
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "id",
        header: t("transactions.id"),
        cell: ({ row }) => <div className='text-center font-medium'>{row.getValue("id")}</div>,
      },
      {
        accessorKey: "date",
        header: t("transactions.date"),
        cell: ({ row }) => <div>{format(row.getValue("date"), "dd/MM/yyyy")}</div>,
      },
      {
        accessorKey: "docNumber",
        header: t("transactions.docNumber"),
        cell: ({ row }) => <div>{row.getValue("docNumber")}</div>,
      },
      {
        accessorKey: "debit",
        header: t("transactions.debit"),
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue("debit"));
          return amount > 0 ? (
            <div className='text-right'>{amount.toLocaleString("vi-VN")}</div>
          ) : (
            <div className='text-right'></div>
          );
        },
      },
      {
        accessorKey: "credit",
        header: t("transactions.credit"),
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue("credit"));
          return amount > 0 ? (
            <div className='text-right'>{amount.toLocaleString("vi-VN")}</div>
          ) : (
            <div className='text-right'></div>
          );
        },
      },
      {
        accessorKey: "balance",
        header: t("transactions.balance"),
        cell: ({ row }) => (
          <div className='text-right'>{parseFloat(row.getValue("balance")).toLocaleString("vi-VN")}</div>
        ),
      },
      {
        accessorKey: "description",
        header: t("transactions.description"),
        cell: ({ row }) => (
          <div className='line-clamp-2 max-w-[500px]' title={row.getValue("description")}>
            {row.getValue("description")}
          </div>
        ),
      },
    ],
    [t]
  );

  const table = useReactTable({
    data: transactions,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
  });

  // Get selected row IDs
  const getSelectedRowIds = (): number[] => {
    return Object.keys(rowSelection).map((idx) => {
      const selectedRow = table.getRowModel().rows[parseInt(idx)];
      return selectedRow.getValue("id");
    });
  };

  // Handle bulk actions
  const handleBulkAction = () => {
    const selectedIds = getSelectedRowIds();
    if (onBulkAction && selectedIds.length > 0) {
      onBulkAction(selectedIds);
    }
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-lg font-medium'>{t("transactions.bankTransactions")}</h3>
        <div className='flex gap-2'>
          <Input
            placeholder={t("transactions.search")}
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className='max-w-sm'
          />
          <Button
            variant='outline'
            onClick={handleBulkAction}
            disabled={Object.keys(rowSelection).length === 0 || isBulkLoading}
            className={isBulkLoading ? "opacity-70" : ""}
          >
            {isBulkLoading ? (
              <>
                <span className='animate-spin mr-2'>◌</span>
                {t("transactions.processing")}
              </>
            ) : (
              t("transactions.processSelected")
            )}
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className='p-0 overflow-auto'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: header.column.getCanSort() ? "cursor-pointer select-none flex items-center" : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: <ChevronUp className='ml-1 h-4 w-4' />,
                            desc: <ChevronDown className='ml-1 h-4 w-4' />,
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className='h-[57px]'>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className='h-24 text-center'>
                    {t("transactions.noTransactions")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className='mt-4 flex justify-between'>
        <div className='text-sm text-gray-500'>
          {t("transactions.selected")}: {Object.keys(rowSelection).length} / {table.getFilteredRowModel().rows.length}{" "}
          {t("transactions.transactions")}
        </div>
      </div>
    </div>
  );
};
