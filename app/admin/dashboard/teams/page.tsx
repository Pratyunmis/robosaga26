import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/admin/current-user";
import { getAllTeams } from "@/lib/admin/queries";
import { TeamsDataTable } from "./_components/teams-data-table";
import { connection } from "next/server";
import { Suspense } from "react";
import { DataTableSkeleton } from "../_components/skeletons";

async function TeamsContent() {
  await connection();
  try {
    await requireAdmin();
  } catch {
    redirect("/api/auth/signin?callbackUrl=/admin/dashboard/teams");
  }
  const teams = await getAllTeams();
  return <TeamsDataTable teams={teams} />;
}

export default function TeamsPage() {
  return (
    <div className="@container/main flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Teams Management</h1>
        <p className="text-muted-foreground mt-2">
          View and manage all registered teams
        </p>
      </div>

      <Suspense fallback={<DataTableSkeleton />}>
        <TeamsContent />
      </Suspense>
    </div>
  );
}
