import EventsClient from "./EventsClient";

export default async function EventsPage() {
  const allEvents: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    date: string | null;
  }[] = [];

  return <EventsClient dbEvents={allEvents} />;
}
