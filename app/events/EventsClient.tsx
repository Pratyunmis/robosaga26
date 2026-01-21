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
  PartyPopper,
  Sword,
  Presentation,
  Award,
  Wrench,
  Flag,
  Calendar,
  Clock,
  Loader2,
  CheckCircle,
  Sparkles,
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

// Static Timeline Data matching the RoboSaga'26 Schedule
const STATIC_TIMELINE = [
  {
    day: 1,
    date: "23/01/2026",
    fullDate: "DAY 1 - 23/01/2026",
    events: [
      {
        eventNum: 1,
        name: "Opening Ceremony",
        time: "12:30 pm - 1 pm",
        icon: Flag,
        slug: "opening-ceremony",
      },
      {
        eventNum: 2,
        name: "Fun Event - Robo Runway",
        time: "2 pm - 5 pm",
        icon: PartyPopper,
        slug: "robo-runway",
      },
      {
        eventNum: 3,
        name: "Overnight Hackathon - HackAway",
        time: "7 pm - 2 pm of next day",
        icon: Laptop,
        slug: "hackaway",
      },
    ],
  },
  {
    day: 2,
    date: "24/01/2026",
    fullDate: "DAY 2 - 24/01/2026",
    events: [
      {
        eventNum: 1,
        name: "Fun Event - Burst n Brawl",
        time: "10 am - 1 pm",
        icon: Sword,
        slug: "burst-n-brawl",
      },
      {
        eventNum: 2,
        name: "Robotics Exhibition",
        time: "10 am - 2 pm",
        icon: Bot,
        slug: "robotics-exhibition",
      },
      {
        eventNum: 3,
        name: "Speaker Session and Award Ceremony",
        time: "3 pm - 7:30 pm",
        icon: Presentation,
        slug: "speaker-session",
      },
    ],
  },
  {
    day: 3,
    date: "25/01/2026",
    fullDate: "DAY 3 - 25/01/2026",
    events: [
      {
        eventNum: 1,
        name: "Robotics Workshop",
        time: "10 am - 12 pm",
        icon: Wrench,
        slug: "robotics-workshop",
      },
      {
        eventNum: 2,
        name: "Closing Ceremony",
        time: "12:30 pm - 1:30 pm",
        icon: Award,
        slug: "closing-ceremony",
      },
    ],
  },
];

export default function EventsClient() {
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);
  const [fetchedEvents, setFetchedEvents] = useState<DbEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const [registrations, activeEvents] = await Promise.all([
          getUserEventRegistrations(),
          getEvents(),
        ]);
        setRegisteredEvents(registrations);
        setFetchedEvents(activeEvents);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRegistrations();
  }, []);

  const handleRegister = async (eventSlug: string, eventTitle: string) => {
    setLoadingEvents((prev) => ({ ...prev, [eventSlug]: true }));
    try {
      const result = await registerForEvent(eventSlug);

      if (result.success) {
        toast.success(`Successfully registered for ${eventTitle}!`);
        setRegisteredEvents((prev) => [...prev, eventSlug]);
      } else if (result.alreadyRegistered) {
        toast.info(result.message || "Already registered");
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white">
      <Navbar />

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center min-h-screen">
          <Loader2 className="w-12 h-12 text-amber-400 animate-spin mb-4" />
          <p className="text-gray-400 text-lg">Loading events...</p>
        </div>
      ) : (
        <>
          {/* Hero Section */}
          <section className="pt-32 pb-16 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
              <motion.div
                className="absolute top-20 left-10 md:left-20 w-2 md:w-3 h-2 md:h-3 bg-amber-400 rounded-full"
                animate={{ y: [0, -20, 0], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div
                className="absolute top-40 right-10 md:right-32 w-2 h-2 bg-amber-300 rounded-full"
                animate={{ y: [0, -15, 0], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
              />
              <motion.div
                className="absolute bottom-40 left-1/3 w-2 h-2 bg-purple-400 rounded-full"
                animate={{ y: [0, -10, 0], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1.5 md:px-4 md:py-2 mb-4 md:mb-6"
              >
                <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-400" />
                <span className="text-amber-300 text-xs md:text-sm font-medium">
                  January 23-25, 2026
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6"
              >
                Event{" "}
                <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
                  Schedule
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-sm sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-2"
              >
                Three days of innovation, competition, and learning. Discover
                our action-packed schedule!
              </motion.p>
            </div>
          </section>

          {/* Static Timeline Section */}
          <section className="py-12 md:py-16 relative">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Timeline Container with glass effect */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative bg-gradient-to-br from-amber-50/95 via-orange-50/95 to-amber-100/95 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-12 shadow-2xl border border-amber-200/50"
              >
                {/* Decorative corner elements */}
                <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-amber-400/20 to-transparent rounded-tl-3xl" />
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-orange-400/20 to-transparent rounded-br-3xl" />

                {/* Timeline Content */}
                <div className="space-y-10">
                  {STATIC_TIMELINE.map((day, dayIndex) => (
                    <motion.div
                      key={day.day}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: dayIndex * 0.15 }}
                      viewport={{ once: true }}
                    >
                      {/* Day Header */}
                      <motion.h3
                        className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800 mb-4 md:mb-6 tracking-tight"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: dayIndex * 0.15 + 0.1 }}
                        viewport={{ once: true }}
                      >
                        {day.fullDate}
                      </motion.h3>

                      {/* Events Table */}
                      <div className="space-y-2 md:space-y-3">
                        {day.events.map((event, eventIndex) => (
                          <motion.div
                            key={event.slug}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                              delay: dayIndex * 0.15 + eventIndex * 0.08 + 0.2,
                            }}
                            viewport={{ once: true }}
                            className="py-3 px-3 md:px-4 rounded-xl hover:bg-white/50 transition-colors group"
                          >
                            {/* Mobile Layout - Stacked */}
                            <div className="md:hidden">
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-sm shrink-0 mt-0.5">
                                  <event.icon className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-slate-500 text-xs font-medium">
                                      Event {event.eventNum}
                                    </span>
                                  </div>
                                  <h4 className="text-slate-800 font-semibold text-sm leading-tight mb-1">
                                    {event.name}
                                  </h4>
                                  <span className="text-slate-600 text-xs font-medium">
                                    {event.time}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Desktop Layout - Grid */}
                            <div className="hidden md:grid md:grid-cols-12 md:gap-4 md:items-center">
                              {/* Event Number */}
                              <div className="col-span-2">
                                <span className="text-slate-600 font-medium text-base">
                                  Event {event.eventNum}
                                </span>
                              </div>

                              {/* Event Name */}
                              <div className="col-span-6 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
                                  <event.icon className="w-4 h-4" />
                                </div>
                                <span className="text-slate-800 font-semibold text-base">
                                  {event.name}
                                </span>
                              </div>

                              {/* Time */}
                              <div className="col-span-4 text-right">
                                <span className="text-slate-700 font-medium text-base">
                                  {event.time}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Separator */}
                      {dayIndex < STATIC_TIMELINE.length - 1 && (
                        <div className="mt-8 border-b-2 border-dashed border-amber-300/50" />
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Footer Note */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  viewport={{ once: true }}
                  className="mt-10 pt-8 border-t-2 border-slate-800/10"
                >
                  <p className="text-center text-slate-800 font-bold text-sm md:text-base uppercase tracking-wider">
                    Closing Ceremony of RoboSaga&apos;26 by
                    <br />
                    <span className="text-lg md:text-xl">
                      Vice-Chancellor of B.I.T Mesra
                    </span>
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* Event Cards Section */}
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-8 md:mb-12"
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                  Register for{" "}
                  <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                    Events
                  </span>
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
                  Choose the events you want to participate in and secure your
                  spot!
                </p>
              </motion.div>

              {fetchedEvents.length === 0 ? (
                <div className="text-center text-gray-400 py-12">
                  <p className="text-lg">No events available yet.</p>
                  <p className="text-sm mt-2">Check back soon!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {[...fetchedEvents]
                    .sort((a, b) => {
                      if (!a.startTime) return 1;
                      if (!b.startTime) return -1;
                      return (
                        new Date(a.startTime).getTime() -
                        new Date(b.startTime).getTime()
                      );
                    })
                    .map((event, index) => {
                      const isRegistered = registeredEvents.includes(
                        event.slug,
                      );

                      // Get icon based on slug matching timeline data
                      const timelineEvent = STATIC_TIMELINE.flatMap(
                        (d) => d.events,
                      ).find((e) => e.slug === event.slug);
                      const EventIcon = timelineEvent?.icon || Bot;

                      // Format date and time
                      const formattedDate = event.startTime
                        ? new Date(event.startTime).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            },
                          )
                        : "TBA";

                      const formattedTime = event.startTime
                        ? new Date(event.startTime).toLocaleTimeString(
                            "en-IN",
                            {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            },
                          )
                        : "TBA";

                      return (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          viewport={{ once: true }}
                        >
                          <Card className="group relative overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-white/10 hover:border-amber-400/50 transition-all duration-300 h-full flex flex-col">
                            {/* Glow effect on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-orange-500/0 group-hover:from-amber-500/5 group-hover:to-orange-500/5 transition-all duration-300" />

                            <CardHeader className="relative pb-3">
                              {/* Icon and Badge */}
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                                    <EventIcon className="w-5 h-5 text-white" />
                                  </div>
                                </div>
                                <span className="bg-gradient-to-r from-amber-400/20 to-orange-400/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-amber-400/30">
                                  {event.startTime
                                    ? new Date(
                                        event.startTime,
                                      ).toLocaleDateString("en-US", {
                                        weekday: "short",
                                      })
                                    : "TBA"}
                                </span>
                              </div>

                              <CardTitle className="text-lg text-white mb-1 group-hover:text-amber-300 transition-colors">
                                {event.name}
                              </CardTitle>
                              <CardDescription className="text-gray-400">
                                <div className="flex items-center gap-2 text-sm">
                                  <Calendar className="w-3.5 h-3.5 text-amber-400/70" />
                                  <span>{formattedDate}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm mt-1">
                                  <Clock className="w-3.5 h-3.5 text-amber-400/70" />
                                  <span>{formattedTime}</span>
                                </div>
                              </CardDescription>
                            </CardHeader>

                            <CardContent className="relative flex-1 flex flex-col justify-end pt-0">
                              {event.description && (
                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                  {event.description}
                                </p>
                              )}

                              {isRegistered ? (
                                <Button
                                  variant="outline"
                                  className="w-full bg-emerald-500/10 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 cursor-default"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Registered
                                </Button>
                              ) : (
                                <Button
                                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all"
                                  onClick={() =>
                                    handleRegister(event.slug, event.name)
                                  }
                                  disabled={loadingEvents[event.slug]}
                                >
                                  {loadingEvents[event.slug] ? (
                                    <>
                                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                      Registering...
                                    </>
                                  ) : (
                                    "Register Now"
                                  )}
                                </Button>
                              )}
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                </div>
              )}
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-12 md:py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-6 sm:p-10 md:p-14 rounded-2xl md:rounded-3xl shadow-2xl"
              >
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 md:w-40 h-32 md:h-40 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-24 md:w-32 h-24 md:h-32 bg-orange-600/30 rounded-full blur-2xl" />

                <div className="relative z-10">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">
                    Ready to Participate?
                  </h2>
                  <p className="text-white/80 text-sm sm:text-base md:text-lg mb-6 md:mb-8 max-w-xl mx-auto">
                    Register your team now and secure your spot in RoboSaga
                    &apos;26!
                  </p>
                  <Link href="/team">
                    <button className="bg-slate-900 text-amber-400 px-6 py-3 md:px-8 md:py-4 rounded-full font-bold hover:bg-slate-800 transition-all text-sm md:text-lg shadow-xl hover:shadow-2xl hover:-translate-y-0.5">
                      Manage Your Team
                    </button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>

          <Footer />
        </>
      )}
    </div>
  );
}
