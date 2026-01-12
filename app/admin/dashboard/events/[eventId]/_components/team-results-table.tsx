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
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ArrowUpDown, Medal, Trash2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type TeamRegistration = {
  id: string;
  registered_at: string;
  teams: {
    id: string;
    name: string;
    slug: string;
    team_leader_id: string;
  };
  event_results?: Array<{
    rank: number;
    marks: number;
    declared_at: string;
  }>;
};

interface TeamResultsTableMeta {
  editingResults: Record<string, { rank: number | null; marks: number | null }>;
  setEditingResults: React.Dispatch<
    React.SetStateAction<
      Record<string, { rank: number | null; marks: number | null }>
    >
  >;
  handleSaveResult: (teamId: string, teamName: string) => Promise<void>;
  handleDeleteResult: (teamId: string, teamName: string) => Promise<void>;
  setTeamToDelete: (team: { id: string; name: string } | null) => void;
  maxScore: number;
}

interface TeamResultsTableProps {
  eventId: string;
  registrations: TeamRegistration[];
  maxScore: number;
}

export function TeamResultsTable({
  eventId,
  registrations,
  maxScore,
}: TeamResultsTableProps) {
  const [editingResults, setEditingResults] = useState<
    Record<string, { rank: number | null; marks: number | null }>
  >({});
  const [teamToDelete, setTeamToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const router = useRouter();

  const { mutateAsync: saveResult } = useMutation({
    mutationFn: async (data: {
      teamId: string;
      rank: number;
      marks: number;
    }) => {
      await axios.post("/api/admin/event-results", {
        eventId,
        ...data,
      });
    },
    onError: () => {
      toast.error("Failed to save result. Please try again.");
    },
  });

  const { mutateAsync: deleteResult } = useMutation({
    mutationFn: async (teamId: string) => {
      await axios.delete("/api/admin/event-results", {
        data: { eventId, teamId },
      });
    },
    onError: () => {
      toast.error("Failed to delete result. Please try again.");
    },
  });

  const handleSaveResult = async (teamId: string, teamName: string) => {
    const result = editingResults[teamId];

    if (!result || result.rank === null || result.marks === null) {
      toast.error("Please provide both rank and marks");
      return;
    }

    if (result.marks < 0 || result.marks > maxScore) {
      toast.error(`Marks must be between 0 and ${maxScore}`);
      return;
    }

    try {
      await saveResult({
        teamId,
        rank: result.rank,
        marks: result.marks,
      });

      toast.success(`Result saved for ${teamName}`);

      // Clear editing state
      const newEditingResults = { ...editingResults };
      delete newEditingResults[teamId];
      setEditingResults(newEditingResults);

      router.refresh();
    } catch {
      toast.error("Failed to save result. Please try again.");
    }
  };

  const handleDeleteResult = async (teamId: string, teamName: string) => {
    try {
      await deleteResult(teamId);

      toast.success(`Result deleted for ${teamName}`);
      setTeamToDelete(null);
      router.refresh();
    } catch {
      toast.error("Failed to delete result. Please try again.");
    }
  };

  const columns = React.useMemo<ColumnDef<TeamRegistration>[]>(
    () => [
      {
        accessorKey: "teams.name",
        id: "team_name",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Team Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const team = row.original.teams;
          return (
            <div>
              <div className="font-medium">{team.name}</div>
              <div className="text-sm text-muted-foreground">@{team.slug}</div>
            </div>
          );
        },
      },
      {
        accessorKey: "registered_at",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Registered At
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const date = new Date(row.getValue("registered_at"));
          return <div>{date.toLocaleDateString()}</div>;
        },
      },
      {
        id: "rank",
        header: "Rank",
        cell: ({ row, table }) => {
          const meta = table.options.meta as TeamResultsTableMeta;
          const { editingResults, setEditingResults } = meta;
          const teamId = row.original.teams.id;
          const existingResult = row.original.event_results?.[0];
          const editingResult = editingResults[teamId];

          if (existingResult && existingResult.rank > 0 && !editingResult) {
            const rankColor =
              existingResult.rank === 1
                ? "text-yellow-600 border-yellow-600/50"
                : existingResult.rank === 2
                ? "text-gray-400 border-gray-400/50"
                : "text-amber-700 border-amber-700/50";
            return (
              <Badge variant="outline" className={rankColor}>
                <Medal className="mr-1 h-4 w-4" />
                Rank {existingResult.rank}
              </Badge>
            );
          }

          return (
            <Select
              value={
                editingResult?.rank?.toString() ||
                (existingResult?.rank ?? 0).toString()
              }
              onValueChange={(value) => {
                setEditingResults({
                  ...editingResults,
                  [teamId]: {
                    ...editingResults[teamId],
                    rank: parseInt(value),
                    marks:
                      editingResults[teamId]?.marks ||
                      existingResult?.marks ||
                      0,
                  },
                });
              }}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Rank" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">No Rank</SelectItem>
                <SelectItem value="1">🥇 Rank 1</SelectItem>
                <SelectItem value="2">🥈 Rank 2</SelectItem>
                <SelectItem value="3">🥉 Rank 3</SelectItem>
              </SelectContent>
            </Select>
          );
        },
      },
      {
        id: "marks",
        header: "Marks",
        cell: ({ row, table }) => {
          const meta = table.options.meta as TeamResultsTableMeta;
          const { editingResults, setEditingResults, maxScore } = meta;
          const teamId = row.original.teams.id;
          const existingResult = row.original.event_results?.[0];
          const editingResult = editingResults[teamId];

          if (existingResult && existingResult.marks > 0 && !editingResult) {
            return (
              <Badge variant="secondary">
                {existingResult.marks} / {maxScore}
              </Badge>
            );
          }

          return (
            <Input
              type="number"
              min={0}
              max={maxScore}
              placeholder="Marks"
              className="w-24"
              value={
                editingResult?.marks?.toString() ??
                (existingResult?.marks || "")
              }
              onChange={(e) => {
                const value =
                  e.target.value === "" ? null : parseInt(e.target.value);
                setEditingResults({
                  ...editingResults,
                  [teamId]: {
                    ...editingResults[teamId],
                    rank:
                      editingResults[teamId]?.rank || existingResult?.rank || 0,
                    marks: value,
                  },
                });
              }}
            />
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row, table }) => {
          const meta = table.options.meta as TeamResultsTableMeta;
          const {
            editingResults,
            setEditingResults: setEditingResults,
            handleSaveResult,
            setTeamToDelete,
          } = meta;
          const team = row.original.teams;
          const existingResult = row.original.event_results?.[0];
          const editingResult = editingResults[team.id];

          if (
            existingResult &&
            (existingResult.rank > 0 || existingResult.marks > 0) &&
            !editingResult
          ) {
            return (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingResults({
                      ...editingResults,
                      [team.id]: {
                        rank: existingResult.rank,
                        marks: existingResult.marks,
                      },
                    });
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() =>
                    setTeamToDelete({ id: team.id, name: team.name })
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          }

          return (
            <Button
              size="sm"
              onClick={() => handleSaveResult(team.id, team.name)}
              disabled={!editingResult || editingResult.marks === null}
            >
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          );
        },
      },
    ],
    []
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    meta: {
      editingResults,
      setEditingResults,
      handleSaveResult,
      handleDeleteResult,
      setTeamToDelete,
      maxScore,
    },
  });

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Filter teams..."
          value={
            (table.getColumn("team_name")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("team_name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
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
                  No teams registered yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={!!teamToDelete}
        onOpenChange={(open) => !open && setTeamToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Result?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the results for team{" "}
              {teamToDelete?.name}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTeamToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (teamToDelete) {
                  handleDeleteResult(teamToDelete.id, teamToDelete.name);
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
