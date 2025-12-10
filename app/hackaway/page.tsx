"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Trophy,
  Award,
  Medal,
  Laptop,
  Zap,
  Link2,
  type LucideIcon,
} from "lucide-react";

export default function HackAwayPage() {
  const prizes: Array<{
    place: string;
    amount: string;
    icon: LucideIcon;
  }> = [
    { place: "1st Place", amount: "₹50,000", icon: Trophy },
    { place: "2nd Place", amount: "₹30,000", icon: Award },
    { place: "3rd Place", amount: "₹20,000", icon: Medal },
  ];

  const tracks: Array<{
    title: string;
    icon: LucideIcon;
    description: string;
    examples: string[];
  }> = [
    {
      title: "Software Track",
      icon: Laptop,
      description:
        "Build innovative web apps, mobile apps, AI/ML solutions, or any software project",
      examples: [
        "Web Applications",
        "Mobile Apps",
        "AI/ML Projects",
        "APIs & Backend",
      ],
    },
    {
      title: "Hardware Track",
      icon: Zap,
      description:
        "Create amazing hardware projects, IoT devices, robotics, or embedded systems",
      examples: ["IoT Devices", "Robotics", "Embedded Systems", "Automation"],
    },
    {
      title: "Combined Track",
      icon: Link2,
      description:
        "Combine software and hardware to create the ultimate innovative solution",
      examples: [
        "Smart Systems",
        "Connected Devices",
        "Hybrid Solutions",
        "Full-Stack IoT",
      ],
    },
  ];

  const schedule = [
    { time: "7:00 PM", event: "Check-in & Registration" },
    { time: "7:30 PM", event: "Opening Ceremony & Problem Statement Reveal" },
    { time: "8:00 PM", event: "Hacking Begins!" },
    { time: "10:00 PM", event: "Dinner Break" },
    { time: "12:00 AM", event: "Midnight Snacks" },
    { time: "6:00 AM", event: "Breakfast" },
    { time: "12:00 PM", event: "Submissions Close" },
    { time: "12:30 PM", event: "Judging & Presentations" },
    { time: "2:00 PM", event: "Winner Announcement" },
  ];

  const rules = [
    "Teams of 2-4 members",
    "All code must be written during the event",
    "Open source libraries and frameworks are allowed",
    "Hardware components will be provided (limited stock)",
    "Projects must be submitted before deadline",
    "Judging based on innovation, implementation, and presentation",
  ];

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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mb-6"
            >
              <Laptop className="w-32 h-32 text-yellow-400 mx-auto" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              <span className="text-yellow-400">HackAway</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-300 mb-4"
            >
              Overnight Hackathon - Build, Create, Innovate!
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-yellow-400 text-lg"
            >
              📅 23 January, 7:00 PM - 24 January, 2:00 PM
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-linear-to-br from-yellow-400/20 to-transparent p-8 rounded-lg border-2 border-yellow-400/50 max-w-4xl mx-auto"
          >
            <p className="text-gray-300 text-lg leading-relaxed">
              Prepare for an electrifying overnight hackathon where creativity,
              innovation, and teamwork take center stage! This thrilling event
              brings together the power of software development and the
              ingenuity of hardware design, giving participants the ultimate
              platform to showcase their skills and ideas.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Prizes Section */}
      <section className="py-20 bg-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-12"
          >
            Win <span className="text-yellow-400">Exciting Prizes</span>
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {prizes.map((prize, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-linear-to-br from-gray-900 to-black border-2 border-yellow-400/50 hover:border-yellow-400 transition-all text-center">
                  <CardHeader>
                    <prize.icon className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                    <CardTitle className="text-2xl text-yellow-400 mb-2">
                      {prize.place}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-white">
                      {prize.amount}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tracks Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-12"
          >
            Competition <span className="text-yellow-400">Tracks</span>
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {tracks.map((track, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-linear-to-br from-gray-900 to-black border-2 border-yellow-400/50 h-full">
                  <CardHeader>
                    <track.icon className="w-12 h-12 text-yellow-400 mb-4" />
                    <CardTitle className="text-xl text-yellow-400 mb-2">
                      {track.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 mb-4">{track.description}</p>
                    <div className="space-y-2">
                      {track.examples.map((example, i) => (
                        <div
                          key={i}
                          className="flex items-center text-sm text-gray-400"
                        >
                          <span className="text-yellow-400 mr-2">▸</span>
                          {example}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section className="py-20 bg-black/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-12"
          >
            Event <span className="text-yellow-400">Schedule</span>
          </motion.h2>

          <div className="space-y-4">
            {schedule.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-linear-to-r from-gray-900 to-black border-l-4 border-yellow-400 p-4 rounded"
              >
                <div className="flex items-center justify-between">
                  <span className="text-yellow-400 font-bold">{item.time}</span>
                  <span className="text-gray-300">{item.event}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Rules Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-12"
          >
            Rules & <span className="text-yellow-400">Guidelines</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-linear-to-br from-gray-900 to-black border-2 border-yellow-400/50 p-8 rounded-lg"
          >
            <div className="space-y-4">
              {rules.map((rule, index) => (
                <div key={index} className="flex items-start">
                  <span className="text-yellow-400 mr-3 text-xl">✓</span>
                  <span className="text-gray-300">{rule}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-black/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-linear-to-r from-yellow-400 to-yellow-500 p-12 rounded-2xl"
          >
            <h2 className="text-4xl font-bold text-black mb-4">
              Ready to Hack?
            </h2>
            <p className="text-black/80 text-lg mb-8">
              Register your team now and showcase your innovation at HackAway!
            </p>
            <Link href="/teams">
              <Button className="bg-black text-yellow-400 px-8 py-4 rounded-full font-bold hover:bg-gray-900 transition-colors text-lg">
                Register Team
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
