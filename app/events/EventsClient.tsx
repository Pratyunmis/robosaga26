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

// Static metadata for events (icons, highlights, extra display info)
const EVENT_METADATA: Record<
  string,
  {
    icon: LucideIcon;
    day: string;
    time: string;
    highlights: string[];
    displayTitle?: string; // Optional override if DB name isn't styled enough
  }
> = {
  hackaway: {
    icon: Laptop,
    day: "Day 1",
    time: "7:00 PM - 2:00 PM (Next Day)",
    highlights: [
      "Build software & hardware solutions",
      "Collaborate with teammates",
      "Win exciting prizes",
      "Mentorship from experts",
    ],
  },
  exhibition: {
    icon: Bot,
    day: "Day 2",
    time: "8:00 AM - 2:00 PM",
    highlights: [
      "Innovative robot models",
      "Futuristic AI concepts",
      "Automation breakthroughs",
      "Interactive demonstrations",
    ],
  },
  blindfold: {
    icon: Target,
    day: "Day 2",
    time: "10:00 AM - 2:00 PM",
    highlights: [
      "Team coordination challenge",
      "Voice-guided navigation",
      "Exciting maze obstacles",
      "Test your communication skills",
    ],
  },
  workshop: {
    icon: Wrench,
    day: "Day 2",
    time: "3:00 PM - 7:30 PM",
    highlights: [
      "Build your own robot",
      "Expert mentorship",
      "Hands-on learning",
      "Take your creation home",
    ],
  },
  "burst-brawl": {
    icon: Zap,
    day: "Day 3",
    time: "10:00 AM - 1:00 PM",
    highlights: [
      "Bot combat arena",
      "Strategy & precision",
      "Fast-paced action",
      "Exciting prizes",
    ],
  },
  speaker: {
    icon: Mic,
    day: "Day 3",
    time: "3:00 PM - 5:00 PM",
    highlights: [
      "Industry expert speakers",
      "Future of robotics & AI",
      "Q&A session",
      "Networking opportunities",
    ],
  },
};

type DbEvent = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  date: string | null;
};

interface EventsClientProps {
  dbEvents: DbEvent[];
}

export default function EventsClient({ dbEvents }: EventsClientProps) {
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);
  const [fetchedEvents, setFetchedEvents] = useState<DbEvent[]>([]);
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
      }
    };
    fetchRegistrations();
  }, []);

  // Use fetched events if available, otherwise use initial props
  // But wait, initial props are [] now. So we must rely on fetched events or fallback to skeleton?
  // We need to store fetched events in state.

  const eventsList = fetchedEvents.length > 0 ? fetchedEvents : dbEvents;

  // Merge DB data with static metadata
  const events = eventsList
    .map((e) => {
      const metadata = EVENT_METADATA[e.slug];
      if (!metadata) return null;
      return {
        id: e.slug, // Use slug as ID for frontend logic and registration
        dbId: e.id,
        title: metadata.displayTitle || e.name,
        description: e.description || "",
        date: e.date || "TBA",
        ...metadata,
      };
    })
    .filter((e) => e !== null) as Array<{
    id: string;
    dbId: string;
    title: string;
    description: string;
    date: string;
    icon: LucideIcon;
    day: string;
    time: string;
    highlights: string[];
  }>;

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
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoadingEvents((prev) => ({ ...prev, [eventSlug]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-black via-blue-950 to-black text-white">
      <Navbar />

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
                      <p className="text-gray-300 mb-4">{event.description}</p>
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
                        onClick={() => handleRegister(event.id, event.title)}
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
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-12"
          >
            Event <span className="text-yellow-400">Timeline</span>
          </motion.h2>

          <div className="space-y-8">
            {["Day 1", "Day 2", "Day 3"].map((day, index) => {
              // Calculate actual date - this is hardcoded for now based on known event dates or the day map
              // Actually we can just group by "Day"
              const dayEvents = events.filter((e) => e.day === day);
              if (dayEvents.length === 0) return null;

              // Extract date from first event of the day if possible, or use hardcoded
              const dateDisplay =
                index === 0
                  ? "23 Jan"
                  : index === 1
                  ? "24 Jan"
                  : index === 2
                  ? "25 Jan"
                  : "";

              return (
                <motion.div
                  key={day}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="border-l-4 border-yellow-400 pl-6 py-4"
                >
                  <h3 className="text-2xl font-bold text-yellow-400 mb-4">
                    {day} - {dateDisplay}
                  </h3>
                  {dayEvents.map((event) => (
                    <div key={event.id} className="mb-3 text-gray-300">
                      <span className="font-semibold">{event.time}</span> -{" "}
                      {event.title}
                    </div>
                  ))}
                </motion.div>
              );
            })}
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
              Register your team now and secure your spot in RoboSaga &apos;26!
            </p>
            <Link href="/teams">
              <button className="bg-black text-yellow-400 px-8 py-4 rounded-full font-bold hover:bg-gray-900 transition-colors text-lg">
                Manage Team
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
