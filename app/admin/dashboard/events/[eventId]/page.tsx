import { requireAdmin } from "@/lib/admin/current-user";
import { getEventDetails } from "@/lib/admin/queries";
import { redirect, notFound } from "next/navigation";
import { connection } from "next/server";
import { TeamResultsTable } from "./_components/team-results-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Suspense } from "react";
import { EventDetailsSkeleton } from "../../_components/skeletons";

type PageProps = {
  params: Promise<{ eventId: string }>;
};

async function EventDetailsContent({ eventId }: { eventId: string }) {
  await connection();
  try {
    await requireAdmin();
  } catch {
    redirect(`/api/auth/signin?callbackUrl=/admin/dashboard/events/${eventId}`);
  }

  const eventData = await getEventDetails(eventId);

  if (!eventData || !eventData.event) {
    notFound();
  }

  const { event, registrations } = eventData;

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{event.name}</h1>
        <p className="text-muted-foreground mt-2">
          Manage team registrations and mark results
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Category</CardDescription>
            <CardTitle className="capitalize">{event.category}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Max Score</CardDescription>
            <CardTitle>{event.max_score}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Total Registrations</CardDescription>
            <CardTitle>{registrations.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {event.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{event.description}</p>
          </CardContent>
        </Card>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-4">Registered Teams & Marking</h2>
        <TeamResultsTable
          eventId={eventId}
          registrations={registrations}
          maxScore={event.max_score}
        />
      </div>
    </>
  );
}

export default async function EventDetailsPage({ params }: PageProps) {
  const { eventId } = await params;

  return (
    <div className="@container/main flex flex-col gap-6">
      <Suspense fallback={<EventDetailsSkeleton />}>
        <EventDetailsContent eventId={eventId} />
      </Suspense>
    </div>
  );
}
