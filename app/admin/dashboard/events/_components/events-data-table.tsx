"use client";

import * as React from "react";
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
import {
  ArrowUpDown,
  ChevronDown,
  Download,
  Search,
  Calendar,
  Trophy,
  Laptop,
  Bot,
  Wrench,
  Mic,
  MoreHorizontal,
  Plus,
  Trash,
  Edit,
} from "lucide-react";
import * as XLSX from "xlsx";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventFormDialog } from "./event-form-dialog";
import { deleteEvent } from "@/lib/admin/actions";

export type Event = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: "hackathon" | "exhibition" | "competition" | "workshop" | "session";
  startTime: Date | string | null;
  endTime: Date | string | null;
  maxScore: number;
  isActive: boolean;
};

const categoryIcons: Record<string, React.ElementType> = {
  hackathon: Laptop,
  exhibition: Bot,
  competition: Trophy,
  workshop: Wrench,
  session: Mic,
};

const categoryColors: Record<string, string> = {
  hackathon: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  exhibition: "bg-purple-500/10 text-purple-500 border-purple-500/30",
  competition: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
  workshop: "bg-green-500/10 text-green-500 border-green-500/30",
  session: "bg-orange-500/10 text-orange-500 border-orange-500/30",
};

const formatDate = (date: Date | string | null) => {
  if (!date) return "TBD";
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

export function EventsDataTable({ events }: { events: Event[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingEvent, setEditingEvent] = React.useState<Event | undefined>(
    undefined
  );

  const handleDelete = async (id: string) => {
    if (
      confirm(
        "Are you sure you want to delete this event? This action cannot be undone."
      )
    ) {
      const res = await deleteEvent(id);
      if (res.success) {
        toast.success("Event deleted successfully");
      } else {
        toast.error("Failed to delete event");
      }
    }
  };

  const openCreateDialog = () => {
    setEditingEvent(undefined);
    setDialogOpen(true);
  };

  const openEditDialog = (event: Event) => {
    setEditingEvent(event);
    setDialogOpen(true);
  };

  const columns: ColumnDef<Event>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Event Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const category = row.getValue("category") as string;
        const colorClass =
          categoryColors[category] ||
          "bg-gray-500/10 text-gray-500 border-gray-500/30";
        return (
          <Badge variant="outline" className={`capitalize ${colorClass}`}>
            {category}
          </Badge>
        );
      },
    },
    {
      accessorKey: "startTime",
      header: "Start Time",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(row.getValue("startTime"))}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "endTime",
      header: "End Time",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(row.getValue("endTime"))}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "maxScore",
      header: "Max Score",
      cell: ({ row }) => (
        <div className="text-center">
          <Badge variant="secondary">{row.getValue("maxScore")}</Badge>
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const event = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link
                className="flex text-center cursor-pointer justify-center no-underline"
                href={`/admin/dashboard/events/${event.id}`}
              >
                <DropdownMenuItem className="w-full cursor-pointer">
                  View Details
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => openEditDialog(event)}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={() => handleDelete(event.id)}
              >
                <Trash className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: events,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  const handleExport = () => {
    const rows = events.map((event) => ({
      "Event Name": event.name,
      Slug: event.slug,
      Category: event.category,
      Start: formatDate(event.startTime),
      End: formatDate(event.endTime),
      "Max Score": event.maxScore,
      Description: event.description,
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Events");
    XLSX.writeFile(wb, `events_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  return (
    <div className="w-full space-y-6">
      <EventFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        event={editingEvent}
      />

      {/* Event Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {events.map((event) => {
          const IconComponent = categoryIcons[event.category] || Calendar;
          const colorClass =
            categoryColors[event.category] ||
            "bg-gray-500/10 text-gray-500 border-gray-500/30";

          return (
            <Card
              key={event.id}
              className="hover:shadow-lg transition-shadow h-full flex flex-col"
            >
              <Link
                href={`/admin/dashboard/events/${event.id}`}
                className="block no-underline flex-1"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${colorClass.split(" ")[0]}`}
                      >
                        <IconComponent
                          className={`h-5 w-5 ${colorClass.split(" ")[1]}`}
                        />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{event.name}</CardTitle>
                        <Badge
                          variant="outline"
                          className={`mt-1 capitalize ${colorClass}`}
                        >
                          {event.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {event.description}
                  </p>
                  <div className="flex flex-col gap-1 text-sm mt-auto text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold">Start:</span>
                      <span>{formatDate(event.startTime)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold">End:</span>
                      <span>{formatDate(event.endTime)}</span>
                    </div>
                  </div>
                </CardContent>
              </Link>
              <div className="p-4 flex justify-end gap-2 border-t mt-auto">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditDialog(event);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500 hover:text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(event.id);
                  }}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" /> Add Event
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
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
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
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
                  No events found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
