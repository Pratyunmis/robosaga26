import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/admin/current-user";
import { getAllRegistrations } from "@/lib/admin/queries";
import { RegistrationsDataTable } from "./_components/registrations-data-table";
import { connection } from "next/server";
import { Suspense } from "react";
import { DataTableSkeleton } from "../_components/skeletons";

async function RegistrationsContent() {
  await connection();
  try {
    await requireAdmin();
  } catch {
    redirect("/api/auth/signin?callbackUrl=/admin/dashboard/registrations");
  }

  const registrations = await getAllRegistrations();
  return <RegistrationsDataTable data={registrations} />;
}

export default function RegistrationsPage() {
  return (
    <div className="@container/main flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Event Registrations
        </h1>
        <p className="text-muted-foreground mt-2">
          View and manage all team registrations across all events
        </p>
      </div>

      <Suspense fallback={<DataTableSkeleton />}>
        <RegistrationsContent />
      </Suspense>
    </div>
  );
}
