"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Trophy,
  Laptop,
  Zap,
  Link2,
  type LucideIcon,
  Brain,
  Bot,
  Eye,
  Activity,
  Truck,
  MapPin,
  Gauge,
  Users,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getUserTeamWithMembers,
  registerForHackaway,
  getHackawayRegistrationStats,
  checkHackawayRegistration,
} from "./actions";
import {config} from "@/lib/config";
import HackathonMaintenancePage from "@/components/HackathonMaintenancePage";

export default function HackAwayPage() {
  if (config.hackaway.showMaintenance) {
    return <HackathonMaintenancePage />;
  }
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [teamData, setTeamData] = useState<{
    teamId?: string;
    teamName?: string;
    teamMembers?: { name: string | null; email: string | null }[];
    alreadyRegistered?: boolean;
    existingProblemStatement?: number;
  } | null>(null);
  const [selectedProblemStatement, setSelectedProblemStatement] =
    useState<string>("");
  const [registrationStats, setRegistrationStats] = useState<
    Record<number, { count: number; max: number; isFull: boolean }>
  >({});
  const [registrationResult, setRegistrationResult] = useState<{
    teamName?: string;
    teamMembers?: { name: string | null; email: string | null }[];
    problemStatementNo?: number;
  } | null>(null);
  const [existingRegistration, setExistingRegistration] = useState<{
    isRegistered: boolean;
    teamName?: string;
    problemStatementNo?: number;
    noTeam?: boolean;
  } | null>(null);

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

  const problemStatements = [
    {
      id: "gesture-bot",
      no: 1,
      title: "Glove-Controlled Drift Racer",
      icon: Laptop,
      description: "Master Every Move!",
      story:
        "Aryan and his team wanted to control a robot without buttons or joysticks—just hand gestures. They built a three-wheeled bot with two powered wheels and a gesture-controlled glove using an IMU sensor. At first, the bot moved erratically, failing to follow commands. After refining their gesture-to-motion algorithm, they mapped movements correctly: Tilt forward → Move forward, Tilt left/right → Turn, Fist close → Stop. Finally, with a flick of Aryan's wrist, the bot moved perfectly.",
      challenge: [
        "Building a functional robotic platform that moves using minimal external input.",
        "Implementing gesture recognition with an IMU sensor or equivalent technology.",
        "Designing an efficient control algorithm that ensures precise movement execution.",
      ],
    },
    {
      id: "attendance-system",
      no: 2,
      title: "Smart Attendance System",
      icon: Eye,
      description: "Automated Classroom Attendance",
      story:
        "In most educational institutions, classroom attendance is still recorded manually, which consumes valuable class time and is prone to errors. With the increasing adoption of smart classrooms, there is a growing need for an automated, reliable, and secure attendance system.",
      challenge: [
        "Captures student data using a camera or biometric input device",
        "Identifies students in real time using a recognition mechanism",
        "Automatically marks attendance without manual input",
        "Prevents duplicate or proxy attendance",
        "Stores attendance records securely in a centralized server-side database",
        "Provides a web-based dashboard for faculty and administrators",
      ],
    },
    {
      id: "supply-chain",
      no: 3,
      title: "Relief Supply Chain",
      icon: Truck,
      description: "Real-Time Relief Supply Chain Network",
      story:
        "During large-scale natural disasters, relief efforts are often hindered by poor coordination. Donors, NGOs, and on-ground relief camps frequently operate in silos, leading to logistical mismatches. A transparent, real-time system that connects donors, relief volunteers, and aid requesters can significantly improve disaster response efficiency.",
      challenge: [
        "Requester Interface: Post urgent supply requirements with geolocation",
        "Donor Interface: View active requests and pledge items",
        "Live inventory dashboard to prevent duplicate allocation",
        "Transparent tracking of supply flow from donor to relief camp",
        "Operate reliably under emergency conditions",
      ],
    },
    {
      id: "safety-monitor",
      no: 4,
      title: "Smart Safety Monitor",
      icon: Activity,
      description: "Protecting Workers Before It's Too Late",
      story:
        "In many industrial workplaces, safety depends heavily on manual supervision. Invisible dangers such as toxic gas leaks or sudden emergencies like worker falls may go unnoticed. Imagine a system that could continuously monitor hazardous conditions, automatically recognize dangerous situations, and instantly alert supervisors.",
      challenge: [
        "Continuously monitors environmental conditions using gas sensors",
        "Detects abnormal events such as falls using motion sensors",
        "Transmits real-time alerts wirelessly to a centralized server",
        "Displays live telemetry and emergency notifications on a web-based dashboard",
      ],
    },
    {
      id: "line-follower",
      no: 5,
      title: "Line Follower Robot",
      icon: Bot,
      description: "Precision Navigation Using Sensor Arrays",
      story:
        "Line-following robots often struggle with sharp turns and uneven lighting. Imagine a robot that can precisely track complex paths, smoothly handle curves and junctions, and adapt its motion intelligently using multiple sensors instead of relying on trial-and-error movement.",
      challenge: [
        "Uses multiple IR sensors arranged in an array to detect the line position",
        "Continuously processes sensor data to determine deviation from the path",
        "Adjusts motor speed dynamically for smooth and accurate navigation",
        "Handles sharp turns, curves, and intersections effectively",
      ],
    },
    {
      id: "drowsiness-detection",
      no: 6,
      title: "Drowsiness Detection",
      icon: Eye,
      description: "Driver Drowsiness & Fleet Monitoring",
      story:
        "Driver fatigue is a major cause of road accidents. Traditional safety measures rely on manual reporting. There is a need for an intelligent, real-time system that can detect driver drowsiness accurately and notify both the driver and fleet management before critical situations occur.",
      challenge: [
        "Utilizes facial landmark detection to track the driver's eyes and mouth",
        "Computes Eye Aspect Ratio (EAR) to distinguish normal blinking vs drowsiness",
        "Sends fatigue alerts to a cloud backend when drowsiness is detected",
        "Displays a fleet manager dashboard showing live vehicle status",
      ],
    },
    {
      id: "logistics-partner",
      no: 7,
      title: "Logistics Partner",
      icon: Bot,
      description: "Your Loyal Logistics Partner!",
      story:
        "Elias was exhausted from hauling heavy equipment. He wished for a helper that didn't need a steering wheel—a companion that would simply follow his lead. Aryan and his team envisioned a robot that acted like a 'shadow', using ultrasonic sensors to 'lock onto' its owner.",
      challenge: [
        "Building a mobile robotic chassis using continuous rotation servos",
        "Implementing a 'Follow-Me' algorithm using ultrasonic sensors",
        "Designing an active obstacle-avoidance system",
        "Implementing an 'Emergency Brake' if the path is blocked",
      ],
    },
    {
      id: "supersense",
      no: 8,
      title: "SuperSense",
      icon: Brain,
      description: "Real-Time Object Detection",
      story:
        "Humans have limited ability to perceive objects beyond direct sight. This limitation can lead to accidents. The objective is to develop a real-time spatial awareness system that equips a user with enhanced perception of their surroundings using a camera or depth sensor.",
      challenge: [
        "Capture live environmental data using camera or depth sensor",
        "Perform object detection and basic depth estimation in real time",
        "Identify obstacles within a defined range",
        "Provide immediate visual or auditory feedback",
      ],
    },
    {
      id: "nurse-shift",
      no: 9,
      title: "Drip-Sync",
      icon: Activity,
      description: "IV Saline Monitoring System",
      story:
        "Sarah, a nurse, wastes time checking 'healthy' drips while other patients might need her. She needs a way to know exactly when a treatment has served its purpose without hovering over every bed. What if the saline stand could 'talk' to the nurse station?",
      challenge: [
        "Monitors Real-Time Fluid Levels using a load cell sensor",
        "Predicts Completion Time by calculating flow rate",
        "Notifies the Nurse Station wirelessly when drip is near completion",
        "Logs Treatment Data into a centralized database",
        "Visualizes Ward Status through a web dashboard",
      ],
    },
    {
      id: "pothole-patrol",
      no: 10,
      title: "Pothole Patrol",
      icon: MapPin,
      description: "Smart Mapping for Safer Roads",
      story:
        "Arjun hit a massive pothole that nearly ruined his car. He realized the problem was the lack of real-time data. He decided to turn a robot into a 'Surveyor' equipped with an accelerometer and GPS to detect and map potholes instantly.",
      challenge: [
        "Building a rugged robotic chassis capable of traversing uneven surfaces",
        "Implementing a 'Shock-Detection' algorithm using an MPU6050",
        "Integrating a GPS system to capture location at impact",
        "Designing a Cloud-Sync feature to map potholes in real-time",
      ],
    },
    {
      id: "omni-wheel",
      no: 11,
      title: "The Omni-Wheel Scout",
      icon: Gauge,
      description: "The Zero-Turn Explorer",
      story:
        "In tight corridors, a standard robot takes too long to turn. Maya wanted a robot that could move sideways, diagonally, and spin in circles. She built an 'Omni-Bot' using three continuous rotation servos set in a triangle.",
      challenge: [
        "Building a triangular or square chassis with 3+ continuous servos",
        "Writing a 'Vector-Drive' algorithm to translate X-Y directions",
        "Demonstrating a 'Zero-Radius Turn' where the bot spins on its own center",
      ],
    },
    {
      id: "watt-watch",
      no: 12,
      title: "Watt-Watch",
      icon: Zap,
      description: "Stopping the Spark!",
      story:
        "Raj, a maintenance head, faced a fire due to an overheating motor. He realized relying on old fuses was dangerous. He needs a system that can see electricity moving in real-time and act before wires start to glow.",
      challenge: [
        "Monitors Real-Time Power Consumption",
        "Identifies 'Phantom Loads' or energy leaks",
        "Functions as a Digital Circuit Breaker with auto-cutoff",
        "Predicts Monthly Costs and forecasts utility bills",
      ],
    },
  ];

  // Fetch registration stats on mount
  useEffect(() => {
    async function fetchData() {
      const stats = await getHackawayRegistrationStats();
      setRegistrationStats(stats);

      const regStatus = await checkHackawayRegistration();
      setExistingRegistration(regStatus);
    }
    fetchData();
  }, []);

  const handleRegisterClick = async () => {
    setIsLoading(true);
    setError(null);

    const result = await getUserTeamWithMembers();

    if ("error" in result && result.error) {
      setError(result.error);
      setIsLoading(false);
      setIsDialogOpen(true);
      return;
    }

    setTeamData(result);
    setIsLoading(false);
    setIsDialogOpen(true);
  };

  const handleConfirmRegistration = async () => {
    if (!selectedProblemStatement) {
      setError("Please select a problem statement");
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await registerForHackaway(
      parseInt(selectedProblemStatement),
    );

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    if (result.alreadyRegistered) {
      setError(result.message || "Your team is already registered");
      setIsLoading(false);
      return;
    }

    // Success!
    setRegistrationResult({
      teamName: result.teamName,
      teamMembers: result.teamMembers,
      problemStatementNo: result.problemStatementNo,
    });
    setIsDialogOpen(false);
    setIsConfirmationOpen(true);
    setIsLoading(false);

    // Update stats
    const stats = await getHackawayRegistrationStats();
    setRegistrationStats(stats);

    // Update existing registration status
    const regStatus = await checkHackawayRegistration();
    setExistingRegistration(regStatus);
  };

  const getProblemStatementTitle = (no: number) => {
    const ps = problemStatements.find((p) => p.no === no);
    return ps ? ps.title : `Problem Statement #${no}`;
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mt-6"
            >
              <div className="inline-block bg-yellow-400/10 border border-yellow-400/50 rounded-full px-6 py-3">
                <span className="text-yellow-400 font-bold text-2xl flex items-center justify-center gap-2">
                  <Trophy className="w-6 h-6" />
                  Prize Pool Worth ₹50,000
                </span>
              </div>
            </motion.div>

            {/* Registration Status & Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8"
            >
              {existingRegistration?.isRegistered ? (
                <div className="inline-flex flex-col items-center gap-2 bg-green-500/20 border border-green-500/50 rounded-xl px-8 py-4">
                  <div className="flex items-center gap-2 text-green-400 font-semibold text-lg">
                    <CheckCircle2 className="w-5 h-5" />
                    Already Registered!
                  </div>
                  <p className="text-gray-300 text-sm">
                    Team:{" "}
                    <span className="text-white font-medium">
                      {existingRegistration.teamName}
                    </span>
                  </p>
                  <p className="text-gray-300 text-sm">
                    Problem Statement:{" "}
                    <span className="text-yellow-400 font-medium">
                      {getProblemStatementTitle(
                        existingRegistration.problemStatementNo || 0,
                      )}
                    </span>
                  </p>
                </div>
              ) : (
                <Button
                  onClick={handleRegisterClick}
                  className="bg-yellow-400 text-black px-8 py-6 rounded-full font-bold hover:bg-yellow-500 transition-all text-lg gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Users className="w-5 h-5" />
                  )}
                  Register for HackAway
                </Button>
              )}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
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

      {/* Prize Pool Section */}
      <section className="py-20 bg-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-12"
          >
            Prize <span className="text-yellow-400">Pool</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-linear-to-br from-gray-900 to-black border-2 border-yellow-400/50 p-12 rounded-2xl max-w-3xl mx-auto relative overflow-hidden text-center hover:border-yellow-400 transition-all duration-300"
          >
            <div className="absolute -top-10 -right-10 opacity-10 rotate-12">
              <Trophy className="w-64 h-64 text-yellow-400" />
            </div>

            <div className="relative z-10">
              <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-6" />
              <h3 className="text-6xl md:text-8xl font-bold text-white mb-4">
                ₹50,000
              </h3>
              <p className="text-2xl text-yellow-400 font-semibold mb-2">
                Prize Pool Worth
              </p>
              <p className="text-gray-400 text-lg">
                + Exciting Goodies, Swag & Certificates for all participants
              </p>
            </div>
          </motion.div>
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

      {/* Problem Statements Section */}
      <section className="py-20 bg-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold mb-6"
            >
              Problem <span className="text-yellow-400">Statements</span>
            </motion.h2>
          </div>

          <Tabs defaultValue={problemStatements[0].id} className="w-full">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/3">
                <TabsList className="flex flex-col h-auto bg-transparent space-y-2 w-full p-0">
                  {problemStatements.map((stmt) => (
                    <TabsTrigger
                      key={stmt.id}
                      value={stmt.id}
                      className="w-full cursor-pointer justify-start px-4 py-3 text-left text-gray-400 data-[state=active]:bg-yellow-400 data-[state=active]:text-black border border-gray-800 hover:border-yellow-400/50 hover:text-white transition-all rounded-lg"
                    >
                      <stmt.icon className="w-5 h-5 mr-3 shrink-0" />
                      <span className="truncate flex-1">{stmt.title}</span>
                      {registrationStats[stmt.no] && (
                        <span
                          className={`ml-2 text-xs px-2 py-0.5 rounded-full shrink-0 ${registrationStats[stmt.no].isFull ? "bg-red-500/20 text-red-400" : "bg-yellow-400/20 text-yellow-400"}`}
                        >
                          {registrationStats[stmt.no].count}/
                          {registrationStats[stmt.no].max}
                        </span>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <div className="w-full md:w-2/3">
                {problemStatements.map((stmt) => (
                  <TabsContent key={stmt.id} value={stmt.id} className="mt-0">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="bg-linear-to-br from-gray-900 to-black border-2 border-yellow-400/50">
                        <CardHeader>
                          <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-yellow-400/10 rounded-full border border-yellow-400/30">
                              <stmt.icon className="w-8 h-8 text-yellow-400" />
                            </div>
                            <div>
                              <CardTitle className="text-2xl text-yellow-400">
                                {stmt.title}
                              </CardTitle>
                              <p className="text-gray-400 font-medium">
                                {stmt.description}
                              </p>
                            </div>
                          </div>
                          {registrationStats[stmt.no] && (
                            <div
                              className={`flex items-center gap-2 text-sm ${registrationStats[stmt.no].isFull ? "text-red-400" : "text-gray-400"}`}
                            >
                              <Users className="w-4 h-4" />
                              <span>
                                {registrationStats[stmt.no].count}/
                                {registrationStats[stmt.no].max} teams
                                registered
                                {registrationStats[stmt.no].isFull && (
                                  <span className="ml-2 text-red-400 font-medium">
                                    (FULL)
                                  </span>
                                )}
                              </span>
                            </div>
                          )}
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div>
                            <h4 className="text-lg font-semibold text-white mb-2 flex items-center">
                              <span className="text-yellow-400 mr-2">📖</span>{" "}
                              The Story
                            </h4>
                            <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                              {stmt.story}
                            </p>
                          </div>

                          <div>
                            <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                              <span className="text-yellow-400 mr-2">🎯</span>{" "}
                              Hackathon Challenge
                            </h4>
                            <ul className="grid gap-3">
                              {stmt.challenge.map((item, i) => (
                                <li
                                  key={i}
                                  className="flex items-start bg-white/5 p-3 rounded-md"
                                >
                                  <span className="text-yellow-400 mr-3">
                                    ▸
                                  </span>
                                  <span className="text-gray-300 text-sm md:text-base">
                                    {item}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </TabsContent>
                ))}
              </div>
            </div>
          </Tabs>
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
            {existingRegistration?.isRegistered ? (
              <div className="inline-flex items-center gap-2 bg-black/20 text-black px-6 py-3 rounded-full font-bold">
                <CheckCircle2 className="w-5 h-5" />
                You&apos;re Registered!
              </div>
            ) : (
              <Button
                onClick={handleRegisterClick}
                className="bg-black text-yellow-400 px-8 py-4 rounded-full font-bold hover:bg-gray-900 transition-colors text-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : null}
                Register Now
              </Button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Registration Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-linear-to-b from-gray-900 to-gray-950 border-2 border-yellow-400/30 text-white sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-3">
            <div className="flex items-center justify-center">
              <div className="p-4 bg-yellow-400/10 rounded-full border border-yellow-400/30">
                <Laptop className="w-8 h-8 text-yellow-400" />
              </div>
            </div>
            <DialogTitle className="text-2xl text-center font-bold">
              Register for <span className="text-yellow-400">HackAway</span>
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-center">
              Join the overnight hackathon and showcase your innovation!
            </DialogDescription>
          </DialogHeader>

          {error && !teamData?.teamMembers && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-red-400 font-medium">{error}</p>
                <p className="text-gray-400 text-sm mt-2">
                  {error.includes("team") ? (
                    <Link
                      href="/team"
                      className="inline-flex items-center gap-1 text-yellow-400 hover:text-yellow-300 transition-colors"
                    >
                      Create or join a team first
                      <span className="text-lg">→</span>
                    </Link>
                  ) : (
                    <Link
                      href="/api/auth/signin"
                      className="inline-flex items-center gap-1 text-yellow-400 hover:text-yellow-300 transition-colors"
                    >
                      Sign in to continue
                      <span className="text-lg">→</span>
                    </Link>
                  )}
                </p>
              </div>
            </div>
          )}

          {teamData?.alreadyRegistered && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-5 text-center">
              <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-green-400 mb-2">
                Already Registered!
              </h3>
              <p className="text-gray-300">
                Your team is registered for Problem Statement:
              </p>
              <p className="text-yellow-400 font-semibold mt-1">
                {getProblemStatementTitle(
                  teamData.existingProblemStatement || 0,
                )}
              </p>
            </div>
          )}

          {teamData?.teamMembers && !teamData.alreadyRegistered && (
            <div className="space-y-5">
              {/* Team Info */}
              <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-yellow-400/10 rounded-lg">
                    <Users className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {teamData.teamName}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {teamData.teamMembers.length} team member
                      {teamData.teamMembers.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  {teamData.teamMembers.map((member, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-2 rounded-lg bg-gray-900/50 hover:bg-gray-900 transition-colors"
                    >
                      <div className="w-9 h-9 bg-linear-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-yellow-400/20">
                        <span className="text-black text-sm font-bold">
                          {member.name?.charAt(0)?.toUpperCase() || "?"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">
                          {member.name || "Unknown"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {member.email}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Problem Statement Selection */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <span className="text-yellow-400">🎯</span>
                  Choose Your Problem Statement
                </label>
                <Select
                  value={selectedProblemStatement}
                  onValueChange={setSelectedProblemStatement}
                >
                  <SelectTrigger className="w-full h-12 bg-gray-800 border-2 border-gray-600 text-white hover:border-yellow-400/50 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all">
                    <SelectValue
                      placeholder="Select a problem statement..."
                      className="text-gray-400"
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-2 border-gray-700 shadow-xl max-h-[350px] z-100">
                    {problemStatements.map((stmt) => (
                      <SelectItem
                        key={stmt.no}
                        value={stmt.no.toString()}
                        disabled={registrationStats[stmt.no]?.isFull}
                        className="text-white py-3 px-4 cursor-pointer focus:bg-yellow-400/20 focus:text-white data-highlighted:bg-yellow-400/20 data-highlighted:text-white data-disabled:opacity-50 data-disabled:cursor-not-allowed"
                      >
                        <div className="flex items-center gap-3 w-full">
                          <span
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold shrink-0 ${
                              registrationStats[stmt.no]?.isFull
                                ? "bg-red-500/30 text-red-400"
                                : "bg-yellow-400/30 text-yellow-400"
                            }`}
                          >
                            {stmt.no}
                          </span>
                          <span
                            className={`flex-1 ${
                              registrationStats[stmt.no]?.isFull
                                ? "text-gray-500"
                                : "text-white"
                            }`}
                          >
                            {stmt.title}
                          </span>
                          {registrationStats[stmt.no] && (
                            <span
                              className={`text-xs px-2 py-1 rounded-md font-medium shrink-0 ${
                                registrationStats[stmt.no].isFull
                                  ? "bg-red-500/30 text-red-400"
                                  : "bg-gray-700 text-gray-300"
                              }`}
                            >
                              {registrationStats[stmt.no].count}/
                              {registrationStats[stmt.no].max}
                              {registrationStats[stmt.no].isFull && " FULL"}
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedProblemStatement && (
                  <div className="bg-yellow-400/5 border border-yellow-400/20 rounded-lg p-3">
                    <p className="text-sm text-gray-400">
                      Selected:{" "}
                      <span className="text-yellow-400 font-medium">
                        #{selectedProblemStatement} -{" "}
                        {getProblemStatementTitle(
                          parseInt(selectedProblemStatement),
                        )}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}
            </div>
          )}

          {teamData?.teamMembers && !teamData.alreadyRegistered && (
            <DialogFooter className="flex-col sm:flex-row gap-3 mt-2">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="flex-1 border-gray-600 text-black hover:bg-gray-800 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmRegistration}
                className="flex-1 bg-linear-to-r from-yellow-400 to-orange-500 text-black font-semibold hover:from-yellow-500 hover:to-orange-600 shadow-lg shadow-yellow-400/25"
                disabled={isLoading || !selectedProblemStatement}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                )}
                Confirm Registration
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
        <DialogContent className="bg-gray-900 border-green-500/50 text-white sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl text-green-400 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6" />
              Registration Successful!
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Your team has been registered for HackAway
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 text-center">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-xl font-bold text-white mb-2">
                Welcome to HackAway!
              </h3>
              <p className="text-gray-400">
                Team{" "}
                <span className="text-yellow-400 font-semibold">
                  {registrationResult?.teamName}
                </span>{" "}
                is now registered
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-400 mb-2">
                Problem Statement
              </h4>
              <p className="text-yellow-400 font-semibold">
                #{registrationResult?.problemStatementNo}:{" "}
                {getProblemStatementTitle(
                  registrationResult?.problemStatementNo || 0,
                )}
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-400 mb-3">
                Registered Team Members
              </h4>
              <div className="space-y-2">
                {registrationResult?.teamMembers?.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 text-gray-300"
                  >
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span>{member.name || "Unknown"}</span>
                    <span className="text-gray-500 text-sm">
                      ({member.email})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => setIsConfirmationOpen(false)}
              className="w-full bg-green-500 text-white hover:bg-green-600"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
