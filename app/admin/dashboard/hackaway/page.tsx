import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/current-user";
import {
  getAllHackawayRegistrations,
  getHackawayStats,
  getProblemStatementSettingsAdmin,
} from "@/lib/admin/queries";
import { HackawayDataTable } from "./_components/hackaway-data-table";
import { Suspense } from "react";
import { connection } from "next/server";
import { DataTableSkeleton } from "../_components/skeletons";

async function HackawayContent() {
  await connection();
  try {
    await requireAdmin();
  } catch {
    redirect("/api/auth/signin?callbackUrl=/admin/dashboard/hackaway");
  }

  const [registrations, stats, problemStatementSettings] = await Promise.all([
    getAllHackawayRegistrations(),
    getHackawayStats(),
    getProblemStatementSettingsAdmin(),
  ]);

  return (
    <HackawayDataTable
      registrations={registrations}
      stats={stats}
      problemStatementSettings={problemStatementSettings}
    />
  );
}

export default function HackawayPage() {
  return (
    <div className="@container/main flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          HackAway Registrations
        </h1>
        <p className="text-muted-foreground mt-2">
          View and manage all HackAway hackathon registrations and team
          assignments
        </p>
      </div>

      <Suspense fallback={<DataTableSkeleton />}>
        <HackawayContent />
      </Suspense>
    </div>
  );
}
