import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Calendar,
  Check,
  ChevronDown,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  FilterX,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

interface BankTransaction {
  id: string;
  transaction_date: string;
  document_number: string;
  debit: number;
  credit: number;
  balance: number;
  description: string;
}

type DateFilterType = "none" | "month" | "year" | "range";

const TransactionsView = () => {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState<BankTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    document_number: false,
  });
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [totalCount, setTotalCount] = useState(0);

  // Date filtering states
  const [dateFilterType, setDateFilterType] = useState<DateFilterType>("none");
  const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), "MM-yyyy"));
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to?: Date | undefined }>({
    from: undefined,
    to: undefined,
  });

  const { toast } = useToast();

  // Month options for select dropdown
  const monthOptions = useMemo(() => {
    const options = [];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    // Generate options for the last 3 years
    for (let year = currentYear; year >= currentYear - 2; year--) {
      for (let month = 12; month >= 1; month--) {
        // Skip future months for current year
        if (year === currentYear && month > currentDate.getMonth() + 1) continue;

        const date = new Date(year, month - 1, 1);
        options.push({
          value: format(date, "MM-yyyy"),
          label: format(date, "MMMM yyyy", { locale: vi }),
        });
      }
    }
    return options;
  }, []);

  // Year options for select dropdown
  const yearOptions = useMemo(() => {
    const options = [];
    const currentYear = new Date().getFullYear();

    for (let year = currentYear; year >= currentYear - 5; year--) {
      options.push({
        value: year.toString(),
        label: year.toString(),
      });
    }
    return options;
  }, []);

  // Define columns for TanStack Table
  const columns = useMemo<ColumnDef<BankTransaction>[]>(
    () => [
      {
        accessorKey: "transaction_date",
        header: ({ column }) => <div className='flex-1 text-center'>{t("date")}</div>,
        cell: ({ row }) => <div className='text-center'>{formatDate(row.getValue("transaction_date"))}</div>,
      },
      {
        accessorKey: "document_number",
        header: ({ column }) => <div className='text-center'>{t("documentNumber")}</div>,
        cell: ({ row }) => <div className='text-center'>{row.getValue("document_number")}</div>,
      },
      {
        accessorKey: "debit",
        header: ({ column }) => <div className='text-right'>{t("debit")}</div>,
        cell: ({ row }) => <div className='text-right'>{formatCurrency(row.getValue("debit"))}</div>,
      },
      {
        accessorKey: "credit",
        header: ({ column }) => <div className='text-right'>{t("credit")}</div>,
        cell: ({ row }) => <div className='text-right'>{formatCurrency(row.getValue("credit"))}</div>,
      },
      {
        accessorKey: "balance",
        header: ({ column }) => <div className='text-right'>{t("balance")}</div>,
        cell: ({ row }) => <div className='text-right'>{formatCurrency(row.getValue("balance"))}</div>,
      },
      {
        accessorKey: "description",
        header: ({ column }) => <div className='text-left'>{t("description")}</div>,
        cell: ({ row }) => {
          const description = row.getValue("description") as string;
          const parts = description.split(".");
          if (parts.length > 3) {
            return parts.slice(3).join(".");
          }
          return description;
        },
      },
    ],
    [t]
  );

  // Modified useEffect to include date filtering
  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        // Build the base query for counting
        let countQuery = supabase.from("bank_transactions").select("*", { count: "exact", head: true });

        // Apply date filters to the count query
        countQuery = applyDateFilters(countQuery);

        // Get the count with filters applied
        const { count, error: countError } = await countQuery;

        if (countError) {
          throw countError;
        }

        if (count !== null) {
          setTotalCount(count);
        }

        // Calculate pagination range
        const { from, to } = {
          from: pagination.pageIndex * pagination.pageSize,
          to: (pagination.pageIndex + 1) * pagination.pageSize - 1,
        };

        // Start building the query
        let query = supabase.from("bank_transactions").select("*");

        // Apply date filters
        query = applyDateFilters(query);

        // Apply sorting if present
        if (sorting.length > 0) {
          // Convert TanStack sorting to Supabase order
          sorting.forEach((sort) => {
            query = query.order(sort.id, { ascending: sort.desc === false });
          });
        } else {
          // Default sorting
          query = query.order("transaction_date", { ascending: false });
        }

        // Apply pagination
        query = query.range(from, to);

        // Execute the query
        const { data, error } = await query;

        if (error) {
          throw error;
        }

        setTransactions(data || []);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        toast({
          title: "Error",
          description: "Failed to load transactions. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Helper function to apply date filters based on the active filter type
    function applyDateFilters(query: any) {
      switch (dateFilterType) {
        case "month": {
          if (selectedMonth) {
            const [month, year] = selectedMonth.split("-");
            const startDate = `${year}-${month}-01`;
            // Calculate the last day of the month
            const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
            const endDate = `${year}-${month}-${lastDay}`;
            return query.gte("transaction_date", startDate).lte("transaction_date", endDate);
          }
          break;
        }
        case "year": {
          if (selectedYear) {
            const startDate = `${selectedYear}-01-01`;
            const endDate = `${selectedYear}-12-31`;
            return query.gte("transaction_date", startDate).lte("transaction_date", endDate);
          }
          break;
        }
        case "range": {
          if (dateRange.from) {
            query = query.gte("transaction_date", format(dateRange.from, "yyyy-MM-dd"));
          }
          if (dateRange.to) {
            query = query.lte("transaction_date", format(dateRange.to, "yyyy-MM-dd"));
          }
          return query;
        }
        default:
          return query; // No date filter applied
      }
      return query;
    }

    fetchTransactions();
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    sorting,
    dateFilterType,
    selectedMonth,
    selectedYear,
    dateRange,
    toast,
  ]);

  // Reset all date filters
  const resetDateFilters = () => {
    setDateFilterType("none");
    setSelectedMonth(format(new Date(), "MM-yyyy"));
    setSelectedYear(new Date().getFullYear().toString());
    setDateRange({ from: undefined, to: undefined });
  };

  const table = useReactTable({
    data: transactions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      pagination,
    },
    manualPagination: true,
    manualSorting: true,
    pageCount: Math.ceil(totalCount / pagination.pageSize),
    onPaginationChange: setPagination,
  });

  return (
    <div className='space-y-4'>
      <Card>
        <CardHeader>
          <CardTitle>{t("bankTransactions")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-between mb-4 gap-2'>
            <div className='relative flex-1 max-w-sm'>
              <Search className='absolute left-2 top-2.5 h-4 w-4 text-gray-500' />
              <Input
                placeholder={t("search")}
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className='pl-8'
              />
            </div>

            {/* Date filter dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline'>
                  <Calendar className='mr-2 h-4 w-4' />
                  {dateFilterType === "none" && t("filterByDate")}
                  {dateFilterType === "month" &&
                    `${t("month")}: ${format(
                      new Date(`${selectedMonth.split("-")[1]}-${selectedMonth.split("-")[0]}-01`),
                      "MM/yyyy"
                    )}`}
                  {dateFilterType === "year" && `${t("year")}: ${selectedYear}`}
                  {dateFilterType === "range" &&
                    (dateRange.from
                      ? `${format(dateRange.from, "dd/MM/yyyy")} - ${
                          dateRange.to ? format(dateRange.to, "dd/MM/yyyy") : ""
                        }`
                      : t("selectDateRange"))}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-56'>
                <DropdownMenuItem onClick={() => setDateFilterType("month")}>Lọc theo tháng</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateFilterType("year")}>Lọc theo năm</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateFilterType("range")}>
                  Lọc theo khoảng thời gian
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    setDateFilterType("none");
                    resetDateFilters();
                  }}
                >
                  <FilterX className='mr-2 h-4 w-4' />
                  Xóa bộ lọc
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Month selector (shown when month filter is active) */}
            {dateFilterType === "month" && (
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className='w-[200px]'>
                  <SelectValue placeholder='Chọn tháng' />
                </SelectTrigger>
                <SelectContent>
                  {monthOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Year selector (shown when year filter is active) */}
            {dateFilterType === "year" && (
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className='w-[120px]'>
                  <SelectValue placeholder='Chọn năm' />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Date range picker (shown when range filter is active) */}
            {dateFilterType === "range" && (
              <div className='grid gap-2'>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id='date'
                      variant={"outline"}
                      className={cn(
                        "w-[300px] justify-start text-left font-normal",
                        !dateRange.from && "text-muted-foreground"
                      )}
                    >
                      <Calendar className='mr-2 h-4 w-4' />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "dd/MM/yyyy")} - {format(dateRange.to, "dd/MM/yyyy")}
                          </>
                        ) : (
                          format(dateRange.from, "dd/MM/yyyy")
                        )
                      ) : (
                        t("selectDateRange")
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <CalendarComponent
                      initialFocus
                      mode='range'
                      defaultMonth={dateRange.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {/* Column visibility dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' className='ml-auto'>
                  <SlidersHorizontal className='mr-2 h-4 w-4' />
                  {t("columnVisibility")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-[200px]'>
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className='capitalize'
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {column.id === "transaction_date" && t("date")}
                        {column.id === "document_number" && t("documentNumber")}
                        {column.id === "debit" && t("debit")}
                        {column.id === "credit" && t("credit")}
                        {column.id === "balance" && t("balance")}
                        {column.id === "description" && t("description")}
                        {column.getIsVisible() && <Check className='ml-auto h-4 w-4' />}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {isLoading ? (
            <div className='text-center py-10'>{t("loading")}</div>
          ) : transactions.length === 0 ? (
            <div className='text-center py-10 text-gray-500'>{t("noData")}</div>
          ) : (
            <>
              <div className='rounded-md border overflow-hidden'>
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id}>
                            {header.isPlaceholder ? null : (
                              <div
                                {...{
                                  className: header.column.getCanSort()
                                    ? "cursor-pointer select-none flex items-center"
                                    : "",
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
                        <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id} className='h-[57px]'>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={columns.length} className='h-24 text-center'>
                          {t("noData")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className='flex items-center justify-between mt-4'>
                <div className='text-sm text-gray-500'>
                  {t("showing")} {pagination.pageIndex * pagination.pageSize + 1} {t("to")}{" "}
                  {Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalCount)} {t("of")} {totalCount}{" "}
                  {t("transactions.transactions")}
                </div>
                <div className='flex items-center space-x-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                    title={t("firstPage")}
                  >
                    <ChevronFirst className='h-4 w-4' />
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    title={t("previousPage")}
                  >
                    <ChevronLeft className='h-4 w-4' />
                  </Button>
                  <span className='text-sm px-2'>
                    {t("page")}{" "}
                    <strong>
                      {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
                    </strong>
                  </span>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    title={t("nextPage")}
                  >
                    <ChevronRight className='h-4 w-4' />
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                    title={t("lastPage")}
                  >
                    <ChevronLast className='h-4 w-4' />
                  </Button>
                  <Select
                    value={`${table.getState().pagination.pageSize}`}
                    onValueChange={(value) => {
                      table.setPageSize(Number(value));
                    }}
                  >
                    <SelectTrigger className='h-8 w-[70px]'>
                      <SelectValue placeholder={table.getState().pagination.pageSize} />
                    </SelectTrigger>
                    <SelectContent side='top'>
                      {[10, 30, 100].map((pageSize) => (
                        <SelectItem key={pageSize} value={`${pageSize}`}>
                          {pageSize}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsView;
