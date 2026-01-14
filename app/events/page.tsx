import EventsClient from "./EventsClient";

export default async function EventsPage() {
  const allEvents: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    startTime: Date | null;
    endTime: Date | null;
  }[] = [];

  return <EventsClient dbEvents={allEvents} />;
}
