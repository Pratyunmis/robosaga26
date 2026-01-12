import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/current-user";
import { getAllEvents } from "@/lib/admin/queries";
import { EventsDataTable } from "./_components/events-data-table";
import { Suspense } from "react";
import { connection } from "next/server";
import { DataTableSkeleton } from "../_components/skeletons";

async function EventsContent() {
  await connection();
  try {
    await requireAdmin();
  } catch {
    redirect("/api/auth/signin?callbackUrl=/admin/dashboard/events");
  }
  const events = await getAllEvents();
  return <EventsDataTable events={events} />;
}

export default function EventsPage() {
  return (
    <div className="@container/main flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Events Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage all RoboSaga&lsquo;26 events, competitions, and workshops
        </p>
      </div>

      <Suspense fallback={<DataTableSkeleton />}>
        <EventsContent />
      </Suspense>
    </div>
  );
}
