"use client";

import { useState } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Download,
  Eye,
  Search,
  Crown,
  Star,
  Loader2,
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Copy,
} from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "sonner";

interface TeamMember {
  userId: string;
  userName: string | null;
  userEmail: string | null;
  userImage: string | null;
  phoneNo: string | null;
  role: "leader" | "member";
  joinedAt: Date;
}

interface Team {
  id: string;
  name: string;
  slug: string;
  score: number;
  leaderId: string;
  createdAt: Date;
  members: TeamMember[];
}

interface TeamsDataTableProps {
  teams: Team[];
}

function getInitials(name: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function TeamsDataTable({ teams: initialTeams }: TeamsDataTableProps) {
  const [data, setData] = useState(initialTeams);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  // Scoring State
  const [scoreDialogOpen, setScoreDialogOpen] = useState(false);
  const [scoreInput, setScoreInput] = useState("");
  const [scoringTeam, setScoringTeam] = useState<Team | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // View Team State
  const [viewTeamDialogOpen, setViewTeamDialogOpen] = useState(false);
  const [viewingTeam, setViewingTeam] = useState<Team | null>(null);

  const handleOpenScoreDialog = (team: Team) => {
    setScoringTeam(team);
    setScoreInput(team.score.toString());
    setScoreDialogOpen(true);
  };

  const handleOpenViewDialog = (team: Team) => {
    setViewingTeam(team);
    setViewTeamDialogOpen(true);
  };

  const handleCopySlug = (slug: string) => {
    navigator.clipboard.writeText(slug);
    toast.success("Team code copied to clipboard");
  };

  const handleUpdateScore = async () => {
    if (!scoringTeam) return;

    const newScore = parseInt(scoreInput);
    if (isNaN(newScore) || newScore < 0) {
      toast.error("Please enter a valid score");
      return;
    }

    setIsUpdating(true);
    try {
      const response = await fetch("/api/admin/teams/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId: scoringTeam.id,
          score: newScore,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update score");
      }

      // Update local state and data source
      const updatedTeams = data.map((t) =>
        t.id === scoringTeam.id ? { ...t, score: newScore } : t
      );
      setData(updatedTeams);

      toast.success(`Score updated for ${scoringTeam.name}`);
      setScoreDialogOpen(false);
    } catch {
      toast.error("Failed to update score");
    } finally {
      setIsUpdating(false);
    }
  };

  const columns: ColumnDef<Team>[] = [
    {
      accessorKey: "name",
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
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "slug",
      header: "Team Code",
      cell: ({ row }) => (
        <code className="text-xs bg-muted px-2 py-1 rounded">
          {row.getValue("slug")}
        </code>
      ),
    },
    {
      accessorKey: "leader",
      header: "Leader",
      cell: ({ row }) => {
        const team = row.original;
        const leader = team.members.find((m) => m.role === "leader");
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={leader?.userImage || undefined}
                alt={leader?.userName || "Leader"}
              />
              <AvatarFallback className="text-xs">
                {getInitials(leader?.userName || null)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">{leader?.userName || "N/A"}</span>
          </div>
        );
      },
    },
    {
      id: "membersCount",
      accessorFn: (row) => row.members.length,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Members
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">
          <Badge variant="secondary">{row.original.members.length}</Badge>
        </div>
      ),
    },
    {
      accessorKey: "score",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Score
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const score = row.getValue("score") as number;
        return (
          <div className="text-center">
            <Badge
              variant={score > 0 ? "default" : "outline"}
              className={score > 0 ? "bg-yellow-500 hover:bg-yellow-600" : ""}
            >
              {score}
            </Badge>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const team = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleCopySlug(team.slug)}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Team Code
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleOpenViewDialog(team)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleOpenScoreDialog(team)}>
                <Star className="mr-2 h-4 w-4" />
                Update Score
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

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
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, filterValue) => {
      // Custom global filter to search nested objects
      const searchableStrings = [
        row.original.name,
        row.original.slug,
        ...row.original.members.map((m) => m.userName || ""),
        ...row.original.members.map((m) => m.userEmail || ""),
      ].map((s) => s.toLowerCase());

      const searchTerm = String(filterValue).toLowerCase();
      return searchableStrings.some((s) => s.includes(searchTerm));
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  const handleExport = () => {
    const rows: Record<string, string | number>[] = [];

    data.forEach((team) => {
      team.members.forEach((member) => {
        rows.push({
          "Team Name": team.name,
          "Team Code": team.slug,
          "Team Score": team.score,
          "Member Name": member.userName || "Unknown",
          Email: member.userEmail || "N/A",
          Phone: member.phoneNo || "N/A",
          Role: member.role,
        });
      });
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Teams");
    XLSX.writeFile(wb, `teams_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search teams, members..."
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
                      {column.id.replace(/([A-Z])/g, " $1").trim()}
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
                  No teams found.
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

      {/* Score Update Dialog */}
      <Dialog open={scoreDialogOpen} onOpenChange={setScoreDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Update Team Score</DialogTitle>
            <DialogDescription>
              Set the score for {scoringTeam?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">Score</label>
            <Input
              type="number"
              min="0"
              placeholder="Enter score"
              value={scoreInput}
              onChange={(e) => setScoreInput(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setScoreDialogOpen(false)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateScore} disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Score"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Team Dialog */}
      <Dialog open={viewTeamDialogOpen} onOpenChange={setViewTeamDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {viewingTeam?.name}
            </DialogTitle>
            <DialogDescription>Code: {viewingTeam?.slug}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">
                Members ({viewingTeam?.members.length})
              </h4>
              <div className="space-y-2">
                {viewingTeam?.members.map((member) => (
                  <div
                    key={member.userId}
                    className={`flex items-center gap-3 p-2 rounded-lg ${
                      member.role === "leader"
                        ? "bg-primary/10 border border-primary/20"
                        : "bg-muted"
                    }`}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={member.userImage || undefined}
                        alt={member.userName || "User"}
                      />
                      <AvatarFallback className="text-xs">
                        {getInitials(member.userName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {member.userName || "Unknown"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {member.userEmail}
                      </p>
                      {member.phoneNo && (
                        <p className="text-xs text-muted-foreground">
                          {member.phoneNo}
                        </p>
                      )}
                    </div>
                    {member.role === "leader" && (
                      <Badge variant="default" className="gap-1">
                        <Crown className="h-3 w-3" />
                        Leader
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
