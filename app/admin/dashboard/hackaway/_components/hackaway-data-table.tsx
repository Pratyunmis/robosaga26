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
  Users,
  Laptop,
  Calendar,
  MoreHorizontal,
  Eye,
  Settings,
  Save,
  Loader2,
  ExternalLink,
  Trophy,
  CheckCircle,
  XCircle,
  Edit,
  FileText,
} from "lucide-react";
import * as XLSX from "xlsx";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  updateProblemStatementMaxParticipants,
  updateHackawayRegistration,
} from "@/lib/admin/actions";

const PROBLEM_STATEMENTS: Record<number, string> = {
  1: "Glove-Controlled Drift Racer",
  2: "Smart Attendance System",
  3: "Relief Supply Chain",
  4: "Smart Safety Monitor",
  5: "Line Follower Robot",
  6: "Drowsiness Detection",
  7: "Logistics Partner",
  8: "SuperSense",
  9: "Drip-Sync",
  10: "Pothole Patrol",
  11: "The Omni-Wheel Scout",
  12: "Watt-Watch",
};

export type HackawayRegistration = {
  id: string;
  teamId: string;
  problemStatementNo: number;
  rank: number | null;
  isQualified: boolean | null;
  pptLink: string | null;
  registeredAt: Date;
  teamName: string;
  teamSlug: string;
  teamScore: number;
  leaderId: string;
  members: {
    userId: string;
    name: string | null;
    email: string | null;
    image: string | null;
    role: "leader" | "member";
  }[];
};

type HackawayStats = {
  total: number;
  byProblemStatement: { problemStatementNo: number; count: number }[];
};

type ProblemStatementSetting = {
  id: number;
  title: string;
  maxParticipants: number;
  isActive: boolean;
  registeredCount: number;
  isFull: boolean;
};

const formatDate = (date: Date | string | null) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

export function HackawayDataTable({
  registrations,
  stats,
  problemStatementSettings,
}: {
  registrations: HackawayRegistration[];
  stats: HackawayStats;
  problemStatementSettings: ProblemStatementSetting[];
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");

  // Dialogs
  const [selectedRegistration, setSelectedRegistration] =
    React.useState<HackawayRegistration | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = React.useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);

  // Max participants settings
  const [maxParticipants, setMaxParticipants] = React.useState<
    Record<number, number>
  >({});
  const [savingId, setSavingId] = React.useState<number | null>(null);

  // Edit form state
  const [editRank, setEditRank] = React.useState<string>("");
  const [editIsQualified, setEditIsQualified] = React.useState(false);
  const [editPptLink, setEditPptLink] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);

  // Initialize max participants from settings
  React.useEffect(() => {
    const initial: Record<number, number> = {};
    problemStatementSettings.forEach((ps) => {
      initial[ps.id] = ps.maxParticipants;
    });
    setMaxParticipants(initial);
  }, [problemStatementSettings]);

  const handleSaveMaxParticipants = async (psId: number) => {
    setSavingId(psId);
    const result = await updateProblemStatementMaxParticipants(
      psId,
      maxParticipants[psId],
    );
    if (result.success) {
      toast.success(`Max participants updated for ${PROBLEM_STATEMENTS[psId]}`);
    } else {
      toast.error(result.error || "Failed to update");
    }
    setSavingId(null);
  };

  const openEditDialog = (reg: HackawayRegistration) => {
    setSelectedRegistration(reg);
    setEditRank(reg.rank?.toString() || "");
    setEditIsQualified(reg.isQualified || false);
    setEditPptLink(reg.pptLink || "");
    setEditDialogOpen(true);
  };

  const handleSaveRegistration = async () => {
    if (!selectedRegistration) return;

    setIsSaving(true);
    const result = await updateHackawayRegistration(selectedRegistration.id, {
      rank: editRank ? parseInt(editRank) : null,
      isQualified: editIsQualified,
      pptLink: editPptLink || null,
    });

    if (result.success) {
      toast.success("Registration updated successfully");
      setEditDialogOpen(false);
    } else {
      toast.error(result.error || "Failed to update");
    }
    setIsSaving(false);
  };

  const handleQuickToggleQualified = async (
    reg: HackawayRegistration,
    qualified: boolean,
  ) => {
    const result = await updateHackawayRegistration(reg.id, {
      isQualified: qualified,
    });
    if (result.success) {
      toast.success(
        qualified ? "Team marked as qualified" : "Team marked as not qualified",
      );
    } else {
      toast.error(result.error || "Failed to update");
    }
  };

  const columns: ColumnDef<HackawayRegistration>[] = [
    {
      accessorKey: "rank",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Rank
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const rank = row.original.rank;
        if (!rank) return <span className="text-muted-foreground">-</span>;
        return (
          <Badge
            variant="outline"
            className={
              rank === 1
                ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/30"
                : rank === 2
                  ? "bg-gray-400/10 text-gray-500 border-gray-400/30"
                  : rank === 3
                    ? "bg-orange-500/10 text-orange-600 border-orange-500/30"
                    : "bg-muted"
            }
          >
            <Trophy className="h-3 w-3 mr-1" />#{rank}
          </Badge>
        );
      },
    },
    {
      accessorKey: "teamName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Team Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("teamName")}</div>
      ),
    },
    {
      accessorKey: "problemStatementNo",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Problem
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const psNo = row.getValue("problemStatementNo") as number;
        return (
          <Badge
            variant="outline"
            className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30"
          >
            #{psNo}
          </Badge>
        );
      },
    },
    {
      accessorKey: "isQualified",
      header: "Qualified",
      cell: ({ row }) => {
        const isQualified = row.original.isQualified;
        return isQualified ? (
          <Badge className="bg-green-500/10 text-green-600 border-green-500/30">
            <CheckCircle className="h-3 w-3 mr-1" />
            Yes
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="bg-red-500/10 text-red-500 border-red-500/30"
          >
            <XCircle className="h-3 w-3 mr-1" />
            No
          </Badge>
        );
      },
    },
    {
      accessorKey: "pptLink",
      header: "PPT",
      cell: ({ row }) => {
        const pptLink = row.original.pptLink;
        if (!pptLink) return <span className="text-muted-foreground">-</span>;
        return (
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-500 hover:text-blue-600"
            onClick={(e) => {
              e.stopPropagation();
              window.open(pptLink, "_blank");
            }}
          >
            <FileText className="h-4 w-4 mr-1" />
            Open
            <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        );
      },
    },
    {
      accessorKey: "members",
      header: "Size",
      cell: ({ row }) => {
        const members = row.original.members;
        return (
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{members.length}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "registeredAt",
      header: "Date",
      cell: ({ row }) => {
        return (
          <div className="text-muted-foreground text-sm">
            {formatDate(row.getValue("registeredAt"))}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const reg = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedRegistration(reg);
                  setDetailsDialogOpen(true);
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  openEditDialog(reg);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Registration
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuickToggleQualified(reg, !reg.isQualified);
                }}
              >
                {reg.isQualified ? (
                  <>
                    <XCircle className="mr-2 h-4 w-4 text-red-500" />
                    Mark Not Qualified
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    Mark Qualified
                  </>
                )}
              </DropdownMenuItem>
              {reg.pptLink && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(reg.pptLink!, "_blank");
                    }}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open PPT Link
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: registrations,
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
    const rows = registrations.map((reg) => ({
      Rank: reg.rank || "-",
      "Team Name": reg.teamName,
      "Problem Statement": `#${reg.problemStatementNo} - ${PROBLEM_STATEMENTS[reg.problemStatementNo] || "Unknown"}`,
      Qualified: reg.isQualified ? "Yes" : "No",
      "PPT Link": reg.pptLink || "-",
      "Team Members": reg.members.map((m) => m.name).join(", "),
      "Member Emails": reg.members.map((m) => m.email).join(", "),
      "Registered At": formatDate(reg.registeredAt),
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "HackAway Registrations");
    XLSX.writeFile(
      wb,
      `hackaway_registrations_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
  };

  // Calculate qualified count
  const qualifiedCount = registrations.filter((r) => r.isQualified).length;

  return (
    <div className="w-full space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-yellow-500/30 bg-linear-to-br from-yellow-500/5 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Registrations
            </CardTitle>
            <Laptop className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Teams registered for HackAway
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-500/30 bg-linear-to-br from-green-500/5 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Qualified Teams
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{qualifiedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Teams marked as qualified
            </p>
          </CardContent>
        </Card>

        {/* Top 2 Problem Statements */}
        {problemStatementSettings
          .sort((a, b) => b.registeredCount - a.registeredCount)
          .slice(0, 2)
          .map((ps, index) => (
            <Card key={ps.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium truncate max-w-32">
                  #{ps.id} {ps.title}
                </CardTitle>
                <Badge
                  variant="outline"
                  className={
                    ps.isFull
                      ? "bg-red-500/10 text-red-500"
                      : index === 0
                        ? "bg-yellow-500/10 text-yellow-600"
                        : "bg-gray-500/10"
                  }
                >
                  {ps.isFull
                    ? "FULL"
                    : index === 0
                      ? "Most Popular"
                      : `#${index + 1}`}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {ps.registeredCount}/{ps.maxParticipants}
                </div>
                <p className="text-xs text-muted-foreground">
                  teams registered
                </p>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Problem Statement Settings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Problem Statement Capacity</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSettingsDialogOpen(true)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Edit Max Participants
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {problemStatementSettings.map((ps) => {
              const percentage =
                (ps.registeredCount / ps.maxParticipants) * 100;
              return (
                <div
                  key={ps.id}
                  className={`relative p-4 rounded-lg border transition-colors ${
                    ps.isFull
                      ? "bg-red-500/5 border-red-500/30"
                      : percentage >= 80
                        ? "bg-yellow-500/5 border-yellow-500/30"
                        : "bg-muted/50 border-border"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge
                      variant="outline"
                      className={
                        ps.isFull
                          ? "bg-red-500/10 text-red-500 border-red-500/30"
                          : "bg-yellow-500/10 text-yellow-600 border-yellow-500/30"
                      }
                    >
                      #{ps.id}
                    </Badge>
                    <span
                      className={`text-sm font-semibold ${
                        ps.isFull ? "text-red-500" : "text-foreground"
                      }`}
                    >
                      {ps.registeredCount}/{ps.maxParticipants}
                    </span>
                  </div>
                  <p className="text-sm font-medium truncate">{ps.title}</p>
                  {/* Progress bar */}
                  <div className="mt-2 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        ps.isFull
                          ? "bg-red-500"
                          : percentage >= 80
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  {ps.isFull && (
                    <p className="text-xs text-red-500 mt-1 font-medium">
                      Registration Closed
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Search and Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search teams..."
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
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

      {/* Data Table */}
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
                            header.getContext(),
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
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => {
                    setSelectedRegistration(row.original);
                    setDetailsDialogOpen(true);
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
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
                  No registrations found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} registration(s) total.
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

      {/* Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Laptop className="h-5 w-5 text-yellow-500" />
              {selectedRegistration?.teamName}
            </DialogTitle>
            <DialogDescription>HackAway Registration Details</DialogDescription>
          </DialogHeader>

          {selectedRegistration && (
            <div className="space-y-6">
              {/* Status Row */}
              <div className="flex items-center gap-4">
                {selectedRegistration.rank && (
                  <Badge
                    variant="outline"
                    className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30"
                  >
                    <Trophy className="h-3 w-3 mr-1" />
                    Rank #{selectedRegistration.rank}
                  </Badge>
                )}
                {selectedRegistration.isQualified ? (
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/30">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Qualified
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-red-500/10 text-red-500 border-red-500/30"
                  >
                    <XCircle className="h-3 w-3 mr-1" />
                    Not Qualified
                  </Badge>
                )}
              </div>

              {/* Problem Statement */}
              <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  Problem Statement
                </h4>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30"
                  >
                    #{selectedRegistration.problemStatementNo}
                  </Badge>
                  <span className="font-medium">
                    {PROBLEM_STATEMENTS[
                      selectedRegistration.problemStatementNo
                    ] || "Unknown"}
                  </span>
                </div>
              </div>

              {/* PPT Link */}
              {selectedRegistration.pptLink && (
                <div className="flex items-center justify-between p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Presentation</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open(selectedRegistration.pptLink!, "_blank")
                    }
                    className="text-blue-500"
                  >
                    Open PPT
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              )}

              {/* Team Members */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">
                  Team Members ({selectedRegistration.members.length})
                </h4>
                <div className="space-y-3">
                  {selectedRegistration.members.map((member) => (
                    <div
                      key={member.userId}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={member.image || undefined}
                          alt={member.name || ""}
                        />
                        <AvatarFallback>
                          {member.name?.charAt(0) || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">
                            {member.name || "Unknown"}
                          </span>
                          {member.role === "leader" && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-blue-500/10 text-blue-600 border-blue-500/30"
                            >
                              Leader
                            </Badge>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground truncate block">
                          {member.email}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Registration Info */}
              <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t">
                <span>Registered</span>
                <span>{formatDate(selectedRegistration.registeredAt)}</span>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                if (selectedRegistration) {
                  openEditDialog(selectedRegistration);
                  setDetailsDialogOpen(false);
                }
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-yellow-500" />
              Edit Registration
            </DialogTitle>
            <DialogDescription>
              {selectedRegistration?.teamName} - Problem #
              {selectedRegistration?.problemStatementNo}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Rank */}
            <div className="space-y-2">
              <Label htmlFor="rank">Rank</Label>
              <Input
                id="rank"
                type="number"
                min={1}
                max={100}
                placeholder="Enter rank (1-100)"
                value={editRank}
                onChange={(e) => setEditRank(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Leave empty if not ranked yet
              </p>
            </div>

            {/* Is Qualified */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <Label>Qualified</Label>
                <p className="text-xs text-muted-foreground">
                  Mark if team has qualified
                </p>
              </div>
              <Switch
                checked={editIsQualified}
                onCheckedChange={setEditIsQualified}
              />
            </div>

            {/* PPT Link */}
            <div className="space-y-2">
              <Label htmlFor="pptLink">PPT Link</Label>
              <Input
                id="pptLink"
                type="url"
                placeholder="https://..."
                value={editPptLink}
                onChange={(e) => setEditPptLink(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Link to team&apos;s presentation (Google Slides, Canva, etc.)
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveRegistration} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Settings className="h-5 w-5 text-yellow-500" />
              Edit Max Participants
            </DialogTitle>
            <DialogDescription>
              Set the maximum number of teams that can register for each problem
              statement
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {problemStatementSettings.map((ps) => (
              <div
                key={ps.id}
                className="flex items-center gap-4 p-4 rounded-lg border bg-card"
              >
                <Badge
                  variant="outline"
                  className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30 shrink-0"
                >
                  #{ps.id}
                </Badge>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{ps.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Currently: {ps.registeredCount} registered
                    {ps.isFull && (
                      <span className="text-red-500 ml-2">(FULL)</span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm text-muted-foreground">Max:</span>
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    value={maxParticipants[ps.id] || ps.maxParticipants}
                    onChange={(e) =>
                      setMaxParticipants((prev) => ({
                        ...prev,
                        [ps.id]: parseInt(e.target.value) || 1,
                      }))
                    }
                    className="w-20 text-center"
                  />
                  <Button
                    size="sm"
                    onClick={() => handleSaveMaxParticipants(ps.id)}
                    disabled={
                      savingId === ps.id ||
                      maxParticipants[ps.id] === ps.maxParticipants
                    }
                  >
                    {savingId === ps.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSettingsDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
