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
} from "lucide-react";

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
    { value: "5000+", label: "Participants" },
    { value: "10K+", label: "Social Reach" },
    { value: "20+", label: "Workshops" },
    { value: "50+", label: "Partners" },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-black via-blue-950 to-black text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-10 w-4 h-4 bg-yellow-400 rounded-full"
            animate={{
              y: [0, -20, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-40 right-20 w-3 h-3 bg-yellow-400 rounded-full"
            animate={{
              y: [0, -15, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
          <motion.div
            className="absolute bottom-40 left-1/4 w-3 h-3 bg-yellow-400 rounded-full"
            animate={{
              y: [0, -10, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="w-32 h-32 mx-auto bg-yellow-400 rounded-full flex items-center justify-center mb-6">
              {/* Placeholder for logo */}
              <Bot className="w-20 h-20 text-black" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-8xl font-bold mb-4"
          >
            <span className="text-yellow-400">ROBO</span>
            <span className="text-white">SAGA</span>
            <span className="text-yellow-400"> &apos;26</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 mb-2"
          >
            Pioneering Innovation, Redefining Robotics
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg md:text-xl text-yellow-400 mb-8 flex items-center justify-center gap-4 flex-wrap"
          >
            <span className="flex items-center gap-2">
              <Calendar className="w-5 h-5" /> 23-25 January, 2026
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="w-5 h-5" /> BIT Mesra, Ranchi
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/events">
              <Button variant="pacman" className="text-lg px-8 py-6">
                Explore Events
              </Button>
            </Link>
            <Link href="/teams">
              <Button
                variant="outline"
                className="text-lg px-8 py-6 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
              >
                Register Team
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-yellow-400 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-yellow-400 rounded-full"></div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
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
              <div className="bg-gradient-to-br from-yellow-400/20 to-transparent p-8 rounded-lg border-2 border-yellow-400/50">
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
                  <Card className="bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-400/50 hover:border-yellow-400 transition-all hover:scale-105">
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
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-12 rounded-2xl"
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
