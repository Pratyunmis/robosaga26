"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Laptop,
  Bot,
  Target,
  Wrench,
  Zap,
  Mic,
  Calendar,
  Clock,
  type LucideIcon,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  registerForEvent,
  getUserEventRegistrations,
  getEvents,
} from "./actions";

type DbEvent = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  startTime: Date | null;
  endTime: Date | null;
};

// Removing dbEvents from props as we fetch only from client
export default function EventsClient() {
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);
  const [fetchedEvents, setFetchedEvents] = useState<DbEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // ... (rest of simple state)
  const [loadingEvents, setLoadingEvents] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const [registrations, activeEvents] = await Promise.all([
          getUserEventRegistrations(),
          getEvents(),
        ]);
        setRegisteredEvents(registrations);
        setFetchedEvents(activeEvents); // Update state for events
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRegistrations();
  }, []);

  const eventsList = fetchedEvents;

  // Merge DB data with static metadata
  const events = eventsList
    .map((e) => {
      const formattedDate = e.startTime
        ? new Date(e.startTime).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        : "TBA";

      // Deterministic icon selection based on slug
      const ICONS = [Laptop, Bot, Target, Wrench, Zap, Mic];
      const iconIndex =
        e.slug.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
        ICONS.length;
      const SelectedIcon = ICONS[iconIndex];

      // Placeholder metadata since external definition is missing
      const metadata = {
        day: e.startTime
          ? new Date(e.startTime).toLocaleDateString("en-US", {
              weekday: "long",
            })
          : "TBA",
        displayTitle: e.name,
        icon: SelectedIcon,
        time: e.startTime
          ? new Date(e.startTime).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            })
          : "TBA",
        highlights: [],
      };

      return {
        id: e.slug, // Use slug as ID for frontend logic and registration
        dbId: e.id,
        title: metadata.displayTitle || e.name,
        description: e.description || "",
        date: formattedDate,
        startTime: e.startTime,
        ...metadata,
      };
    })
    .filter((e) => e !== null) as Array<{
    id: string;
    dbId: string;
    title: string;
    description: string;
    date: string;
    startTime: Date | null;
    icon: LucideIcon;
    day: string;
    time: string;
    highlights: string[];
  }>;

  // Group events for timeline
  const eventsByDate = events.reduce((acc, event) => {
    const dateKey = event.date;
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(event);
    return acc;
  }, {} as Record<string, typeof events>);

  const sortedDateKeys = Object.keys(eventsByDate).sort((a, b) => {
    if (a === "TBA") return 1;
    if (b === "TBA") return -1;
    return new Date(a).getTime() - new Date(b).getTime();
  });

  const handleRegister = async (eventSlug: string, eventTitle: string) => {
    setLoadingEvents((prev) => ({ ...prev, [eventSlug]: true }));
    try {
      const result = await registerForEvent(eventSlug);

      if (result.success) {
        toast.success(`Successfully registered for ${eventTitle}!`);
        setRegisteredEvents((prev) => [...prev, eventSlug]);
      } else if (result.alreadyRegistered) {
        toast.info(result.message || "Already registered");
        // Ensure it's marked as registered in state just in case
        if (!registeredEvents.includes(eventSlug)) {
          setRegisteredEvents((prev) => [...prev, eventSlug]);
        }
      } else {
        toast.error(result.error || "Failed to register");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoadingEvents((prev) => ({ ...prev, [eventSlug]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-black via-blue-950 to-black text-white">
      <Navbar />

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center min-h-screen">
          <Loader2 className="w-12 h-12 text-yellow-400 animate-spin mb-4" />
          <p className="text-gray-400 text-lg">Loading events...</p>
        </div>
      ) : (
        <>
          {/* Hero Section */}
          <section className="pt-32 pb-20 relative overflow-hidden">
            <div className="absolute inset-0">
              <motion.div
                className="absolute top-20 left-20 w-4 h-4 bg-yellow-400 rounded-full"
                animate={{ y: [0, -20, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="absolute bottom-40 right-20 w-3 h-3 bg-yellow-400 rounded-full"
                animate={{ y: [0, -15, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
              />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl font-bold mb-6"
              >
                Event <span className="text-yellow-400">Schedule</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-300 max-w-3xl mx-auto"
              >
                Three days of innovation, competition, and learning. Choose your
                events and get ready to compete!
              </motion.p>
            </div>
          </section>

          {/* Events Grid */}
          <section className="pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-2 gap-8">
                {events.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="bg-linear-to-br from-gray-900 to-black border-2 border-yellow-400/50 hover:border-yellow-400 transition-all h-full flex flex-col justify-between">
                      <div>
                        <CardHeader>
                          <div className="flex items-center justify-between mb-4">
                            <event.icon className="w-12 h-12 text-yellow-400" />
                            <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold">
                              {event.day}
                            </span>
                          </div>
                          <CardTitle className="text-2xl text-yellow-400 mb-2">
                            {event.title}
                          </CardTitle>
                          <CardDescription className="text-gray-400">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" /> {event.date}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" /> {event.time}
                            </div>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-300 mb-4">
                            {event.description}
                          </p>
                          <div className="space-y-2 mb-4">
                            {event.highlights.map((highlight, i) => (
                              <div
                                key={i}
                                className="flex items-center text-sm text-gray-400"
                              >
                                <span className="text-yellow-400 mr-2">▸</span>
                                {highlight}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </div>

                      <div className="p-6 pt-0 mt-auto">
                        {registeredEvents.includes(event.id) ? (
                          <Button
                            variant="outline"
                            className="w-full bg-green-900/20 border-green-500 text-green-500 hover:bg-green-900/30 hover:text-green-400 cursor-default"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Registered
                          </Button>
                        ) : (
                          <Button
                            variant="pacman"
                            className="w-full"
                            onClick={() =>
                              handleRegister(event.id, event.title)
                            }
                            disabled={loadingEvents[event.id]}
                          >
                            {loadingEvents[event.id] ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Registering...
                              </>
                            ) : (
                              "Register Now"
                            )}
                          </Button>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Timeline */}
          <section className="py-20 bg-black/50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl font-bold mb-4">
                  Program <span className="text-yellow-400">Flow</span>
                </h2>
                <div className="w-20 h-1 bg-yellow-400 mx-auto rounded-full" />
              </motion.div>

              <div className="max-w-3xl mx-auto">
                {sortedDateKeys.length === 0 ? (
                  <div className="text-center text-gray-400">
                    No events scheduled yet.
                  </div>
                ) : (
                  <div className="relative border-l-2 border-yellow-400/20 ml-4 md:ml-12 space-y-12">
                    {sortedDateKeys.map((date, index) => (
                      <motion.div
                        key={date}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="relative pl-8 md:pl-12"
                      >
                        {/* Dot */}
                        <div className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-black border-2 border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]" />

                        <h3 className="text-2xl font-bold text-yellow-400 mb-6 flex items-center gap-3">
                          {date}
                        </h3>

                        <div className="space-y-4">
                          {eventsByDate[date]
                            .sort(
                              (a, b) =>
                                new Date(a.startTime ?? 0).getTime() -
                                new Date(b.startTime ?? 0).getTime()
                            )
                            .map((event) => (
                              <Card
                                key={event.id}
                                className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors"
                              >
                                <CardContent className="p-4 flex gap-4 items-center">
                                  <div className="bg-yellow-400/10 p-3 rounded-full text-yellow-400 shrink-0">
                                    <event.icon className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <div className="text-yellow-400 text-sm font-bold mb-0.5 font-mono">
                                      {event.time}
                                    </div>
                                    <h4 className="text-white font-semibold">
                                      {event.title}
                                    </h4>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-linear-to-r from-yellow-400 to-yellow-500 p-12 rounded-2xl"
              >
                <h2 className="text-4xl font-bold text-black mb-4">
                  Ready to Participate?
                </h2>
                <p className="text-black/80 text-lg mb-8">
                  Register your team now and secure your spot in RoboSaga
                  &apos;26!
                </p>
                <Link href="/team">
                  <button className="bg-black text-yellow-400 px-8 py-4 rounded-full font-bold hover:bg-gray-900 transition-colors text-lg">
                    Manage Team
                  </button>
                </Link>
              </motion.div>
            </div>
          </section>

          <Footer />
        </>
      )}
    </div>
  );
}
