"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Laptop,
  Bot,
  Target,
  Wrench,
  Zap,
  Mic,
  Calendar,
  MapPin,
  Users,
  Globe,
  Lightbulb,
  Handshake,
} from "lucide-react";
import { Vortex } from "@/components/ui/vortex";

export default function Home() {
  const events = [
    { title: "HackAway", time: "23 Jan, 7 PM - 24 Jan, 2 PM", icon: Laptop },
    { title: "Robotics Exhibition", time: "24 Jan, 8 AM - 2 PM", icon: Bot },
    {
      title: "Blindfold Droid Trooper",
      time: "24 Jan, 10 AM - 2 PM",
      icon: Target,
    },
    {
      title: "Robotics Workshop",
      time: "24 Jan, 3 PM - 7:30 PM",
      icon: Wrench,
    },
    { title: "Burst n Brawl", time: "25 Jan, 10 AM - 1 PM", icon: Zap },
    { title: "Speaker Session", time: "25 Jan, 3 PM - 5 PM", icon: Mic },
  ];

  const stats = [
    { value: "5000+", label: "Participants", icon: Users },
    { value: "10K+", label: "Social Reach", icon: Globe },
    { value: "20+", label: "Workshops", icon: Lightbulb },
    { value: "50+", label: "Partners", icon: Handshake },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-black via-blue-950 to-black text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-20">
        {/* Animated Background Elements */}
        <div className="inset-0 z-10 absolute bg-black/50 pointer-events-none" />

        <Vortex
          backgroundColor="black"
          className="flex items-center flex-col justify-center px-4 sm:px-6 md:px-10 py-8 sm:py-12 md:py-4 w-full h-full"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 w-full">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 100 }}
              className="mb-3 sm:mb-4 md:mb-2"
            >
              <p className="text-sm sm:text-lg md:text-xl lg:text-2xl text-[#176AA2] font-bold tracking-widest">
                <span className="inline-block">ROBOLUTION</span>
                <span className="text-[#D9D9D9] mx-1 sm:mx-2">PRESENTS</span>
              </p>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 120 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 leading-tight"
            >
              <motion.span
                className="text-[#F8C437]"
                animate={{
                  textShadow: [
                    "0 0 20px #F8C437",
                    "0 0 40px #F8C437",
                    "0 0 20px #F8C437",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ROBO
              </motion.span>
              <span className="text-white">SAGA</span>
              <motion.span
                className="text-[#F8C437]"
                animate={{
                  textShadow: [
                    "0 0 20px #F8C437",
                    "0 0 40px #F8C437",
                    "0 0 20px #F8C437",
                  ],
                }}
                transition={{ duration: 20, repeat: Infinity, delay: 0.5 }}
              >
                &apos;26
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-4 sm:mb-3 md:mb-2 px-4 sm:px-0"
            >
              Pioneering Innovation, Redefining Robotics
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-sm sm:text-base md:text-lg lg:text-xl text-yellow-400 mb-6 sm:mb-8 flex items-center justify-center gap-2 sm:gap-4 flex-wrap px-4 sm:px-0"
            >
              <span className="flex items-center gap-1 sm:gap-2">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5" /> 23-25 January,
                2026
              </span>
              <span className="flex items-center gap-1 sm:gap-2">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" /> BIT Mesra, Ranchi
              </span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0"
            >
              <Link href="/events" className="w-full sm:w-auto">
                <Button
                  variant="pacman"
                  className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto"
                >
                  Explore Events
                </Button>
              </Link>
              <Link href="/teams" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                >
                  Register Team
                </Button>
              </Link>
            </motion.div>
          </div>
        </Vortex>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 hidden sm:block"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-yellow-400 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-yellow-400 rounded-full"></div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center flex flex-col items-center justify-center p-4 sm:p-6 rounded-lg bg-linear-to-b from-blue-950/30 to-transparent border border-yellow-400/20 hover:border-yellow-400/50 transition-all duration-300"
                >
                  <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-yellow-400 mb-2 sm:mb-3" />
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-yellow-400 mb-1 sm:mb-2">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm md:text-base text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              About <span className="text-yellow-400">Robolution</span>
            </h2>
            <div className="w-24 h-1 bg-yellow-400 mx-auto mb-8"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-linear-to-br from-yellow-400/20 to-transparent p-8 rounded-lg border-2 border-yellow-400/50">
                {/* Placeholder for image */}
                <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-gray-500">Robolution Logo / Image</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-gray-300 mb-4">
                Founded in 2001, Robolution, the official robotics club of BIT
                Mesra, stands as a center of innovation and teamwork blending
                mechanics, electronics, programming, and creativity.
              </p>
              <p className="text-gray-300 mb-4">
                Our members consistently shine in renowned competitions across
                the nation. As Team Pratyunmis, we proudly represent BIT Mesra
                at ABU ROBOCON, an international robotics contest.
              </p>
              <p className="text-gray-300 mb-6">
                In 2021, we made history by earning a perfect score of 100 in 3D
                design analysis, marking a milestone achievement.
              </p>
              <Link href="/contact">
                <Button variant="pacman">Learn More</Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-20 bg-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Featured <span className="text-yellow-400">Events</span>
            </h2>
            <div className="w-24 h-1 bg-yellow-400 mx-auto mb-8"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => {
              const IconComponent = event.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-linear-to-br from-gray-900 to-black border-2 border-yellow-400/50 hover:border-yellow-400 transition-all hover:scale-105">
                    <CardHeader>
                      <IconComponent className="w-12 h-12 text-yellow-400 mb-2" />
                      <CardTitle className="text-yellow-400">
                        {event.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400 text-sm">{event.time}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/events">
              <Button variant="pacman" className="text-lg px-8 py-6">
                View All Events
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-linear-to-r from-yellow-400 to-yellow-500 p-12 rounded-2xl"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
              Ready to Compete?
            </h2>
            <p className="text-black/80 text-lg mb-8">
              Join us for 3 days of innovation, learning, and robotics
              excellence!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/teams">
                <button className="bg-black text-yellow-400 px-8 py-4 rounded-full font-bold hover:bg-gray-900 transition-colors text-lg">
                  Register Now
                </button>
              </Link>
              <Link href="/sponsors">
                <button className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors text-lg">
                  Become a Sponsor
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
