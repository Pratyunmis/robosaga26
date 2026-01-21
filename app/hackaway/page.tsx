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
  Bot,
  Gauge,
  Users,
  CheckCircle2,
  Loader2,
  AlertCircle,
  GitPullRequest,
  Radar,
  HeartPulse,
  TrainFront,
  Wallet,
  Music,
  Scale,
  AlertTriangle,
  Inbox,
  BrainCircuit,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getUserTeamWithMembers,
  registerForHackaway,
  getHackawayRegistrationStats,
  checkHackawayRegistration,
} from "./actions";
import { config } from "@/lib/config";
import HackathonMaintenancePage from "@/components/HackathonMaintenancePage";

export default function HackAwayPage() {
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
      id: "code-reviewer",
      no: 1,
      title: "The Reviewer Who Never Sleeps",
      icon: GitPullRequest,
      description: "Autonomous Code Reviewer",
      story:
        "Gaurav works on a fast-paced software project where pull requests are reviewed in a hurry. Since reviewers are often busy, code that looks correct gets approved—even when it contains logical mistakes, performance issues, or inconsistent coding styles. A small bug missed during review later breaks a feature, wasting hours in fixes. Gaurav begins to wonder: what if there was a smart reviewer that carefully checked every pull request, gave clear feedback, and learned from past reviews instead of repeating the same mistakes?",
      challenge: [
        "Automatically reviews pull requests",
        "Detects logical bugs beyond syntax errors",
        "Identifies performance issues",
        "Enforces coding standards across languages",
        "Generates human-like review comments",
        "Learns from previously accepted and rejected reviews",
      ],
    },
    {
      id: "3d-mapping",
      no: 2,
      title: "Seeing the World with One Sensor",
      icon: Radar,
      description: "Low-Cost 3D Mapping System",
      story:
        "Himanshu is building a small robot, but there's a problem—3D sensors like LiDAR are too expensive. All he has is a single ultrasonic sensor and a simple motor setup that can rotate it left–right and up–down. Himanshu wonders: can one sensor, if moved smartly, understand the 3D shape of a room? Your task is to help Himanshu build a low-cost 3D mapping system where an ultrasonic sensor is mounted on a controlled yaw–pitch sweep. As the sensor scans the surroundings, distance readings should be converted into 3D points, slowly forming a rough map of the environment. The system should handle noisy readings, group nearby points to recognize objects, and make sense of what is around it.",
      challenge: [
        "Generates a real-time 3D point cloud of the surroundings",
        "Creates a discretized occupancy map showing free and occupied space",
        "Performs basic surface detection, such as identifying walls and obstacles",
      ],
    },
    {
      id: "smart-blind-stick",
      no: 3,
      title: "Finding the Way, One Step at a Time",
      icon: HeartPulse,
      description: "Smart Blind Stick",
      story:
        "Palak is visually impaired and depends on a traditional white cane to move around independently. While the cane helps her detect obstacles on the ground, it cannot warn her about objects ahead, obstacles at head level, water puddles, or uneven surfaces. In crowded areas or unfamiliar places, she often realizes the danger only when it is too late, making everyday travel stressful and unsafe. Palak begins to wonder—what if her walking stick could sense the surroundings before she reaches them and gently guide her through obstacles, just like a human assistant would?",
      challenge: [
        "Detects obstacles in front of the user at multiple heights",
        "Identifies environmental hazards such as water or uneven surfaces",
        "Provides non-visual alerts using vibration or sound",
        "Works smoothly during normal walking without causing false or unnecessary alerts",
      ],
    },
    {
      id: "gesture-drift-racer",
      no: 4,
      title: "Glove-Controlled Drift Racer: Master Every Move!",
      icon: Gauge,
      description: "Gesture-Based Robotic Control",
      story:
        "Vatsalya and his team wanted to control a robot without buttons or joysticks—just hand gestures. They built a three-wheeled bot with two powered wheels and a gesture-controlled glove using an IMU sensor. At first, the bot moved erratically, failing to follow commands. After refining their gesture-to-motion algorithm, they mapped movements correctly: Tilt forward → Move forward, Tilt left/right → Turn, Fist close → Stop. Finally, with a flick of Vatsalya's wrist, the bot moved perfectly. They had solved the problem—creating an intuitive, hands-free robotic control system.",
      challenge: [
        "Building a functional robotic platform that moves using minimal external input",
        "Implementing gesture recognition with an IMU sensor or equivalent technology",
        "Designing an efficient control algorithm that ensures precise movement execution",
      ],
    },
    {
      id: "trekbot",
      no: 5,
      title: "TrekBot – A Simple Quadruped Walking Robot",
      icon: Bot,
      description: "Four-Legged Walking Robot",
      story:
        "Ayush is an engineering student working on a project for his robotics club. His team has built multiple wheeled robots before, but they now want to try something different—a robot that can walk instead of rolling. While experimenting, they notice that wheels struggle on uneven surfaces, and a legged system might handle small obstacles better. One day, while testing a rover on a rough classroom floor with cables and small objects scattered around, the bot kept getting stuck. Ayush realized that a four-legged walking robot could step over obstacles instead of getting blocked.",
      challenge: [
        "Walk using four legs with a simple gait pattern",
        "Move forward, backward, and turn using servo motors",
        "Remain stable while walking, ensuring coordinated movement",
      ],
    },
    {
      id: "chordmate",
      no: 6,
      title: "ChordMate – Never Play the Wrong Chord Again!",
      icon: Music,
      description: "Real-Time Chord Detection",
      story:
        "Shubham is an aspiring guitarist, practicing late at night for an upcoming performance. He's trying to play a song by ear but keeps struggling to identify the right chords. Every time he plays a chord, he second-guesses himself. Frustrated, he pulls out his phone to check an online chord detection app, but the app struggles with background noise. He tries a tuner, but it only detects individual notes, not full chords. His OLED display tuner only shows the tuning of single strings, making it useless for chord practice. What if Shubham had a pocket-sized device that could instantly tell him the chord he just played—without needing a phone or an app?",
      challenge: [
        "Captures sounds",
        "Processes the audio signal to detect the played chord",
        "Displays the detected chord name on an OLED screen in real time",
        "Ignores ambient noise to prevent false detections",
      ],
    },
    {
      id: "ball-balancer",
      no: 7,
      title: "Ayushman Test – Steady Hands, Smart Control",
      icon: Scale,
      description: "Ball Balancing Platform",
      story:
        "Ayushman is designing a small robotic system that needs to keep fragile objects perfectly balanced. During testing, he places a ball on a flat platform, but even the smallest tilt causes the ball to roll away. He realizes that keeping the platform steady by hand is impossible—the system must sense, think, and react instantly. Ayushman starts wondering—what if the platform could automatically adjust its angle to keep the ball balanced at one spot, no matter where the ball moves?",
      challenge: [
        "Uses a tilting platform to control the motion of a ball",
        "Continuously detects the position of the ball on the platform",
        "Adjusts the platform angle in real time to keep the ball balanced at a target position",
        "Demonstrates stable control, even when the ball is disturbed or placed at different starting points",
      ],
    },
    {
      id: "railway-fault-detector",
      no: 8,
      title: "Automated Railway Track Fault Detector",
      icon: TrainFront,
      description: "Prince's Railway Safety System",
      story:
        "Prince works in railway maintenance, where the safety of thousands of passengers depends on the condition of railway tracks. Even a tiny crack or gap in a track can lead to serious accidents. Today, inspections are mostly done by people walking along the tracks—this process is slow, risky, and prone to human error. After hearing about an accident caused by a small fault that went unnoticed, Prince starts thinking—what if a small autonomous machine could continuously inspect the tracks, instantly detect faults, and clearly report where they are?",
      challenge: [
        "Uses a small motorized robot that moves autonomously along a railway track (to be demonstrated using a small physical model made from cardboard, wooden strips, or similar materials)",
        "Detects cracks or gaps in the track while moving",
        "Stops immediately and triggers an alert when a fault is found",
        "Calculates the distance of the detected fault from a nearby reference point (station) to determine its location",
        "Builds a simple user interface (UI) that displays real-time system updates such as: 'Crack detected 5 m away from Ranchi Station', Robot status (moving / stopped), Fault detection alerts",
      ],
    },
    {
      id: "financial-ai",
      no: 9,
      title: "Agentic AI for Intelligent Personal Financial Decision-Making",
      icon: Wallet,
      description: "Smart Financial Agent",
      story:
        "In today's digital life, individuals perform hundreds of financial transactions every month—buying groceries from local stores, ordering food online, paying subscriptions, and investing in stocks across multiple platforms. While data exists everywhere, insights exist nowhere. Most people: Overspend on small, repeated expenses, Invest emotionally rather than rationally, React late to market changes instead of acting proactively.",
      challenge: [
        "Operates as a financial decision-making agent, not a static app",
        "Brings segregated financial data across different platforms (stocks, investments, EPFs, mutual funds, expenses) onto one platform",
        "Combines transaction analysis, market intelligence, and reasoning and planning",
        "Provides explainable, actionable insights",
        "Works across daily expenses + long-term investments",
        "Natural language interaction",
        "Simulated real-time market reactions",
        "Ethical & privacy-aware design",
      ],
    },
    {
      id: "rescuenet",
      no: 10,
      title: "RescueNet – Every Minute Knows Where to Go",
      icon: AlertTriangle,
      description: "Emergency Response Coordination System",
      story:
        "After a natural disaster, emergency teams are flooded with distress messages from calls, social media, and helpline portals. Some requests are urgent, some are duplicates, some lack location clarity. With limited rescue teams and time-critical decisions, manual triaging becomes chaotic. Lives are lost not because help didn't exist—but because prioritization failed. An emergency coordinator starts thinking—what if incoming information could be intelligently filtered, ranked, and routed in real time?",
      challenge: [
        "Ingests distress reports from multiple sources (text, forms, social feeds, simulated inputs)",
        "Uses NLP to extract urgency, location clues, and type of assistance needed",
        "Assigns a severity score and priority rank to each request",
        "Groups duplicate or related reports to avoid redundancy",
        "Displays a live operational dashboard for responders showing what needs attention now",
      ],
    },
    {
      id: "salil-inbox",
      no: 11,
      title: "Salil's Inbox – Signal, Not Noise",
      icon: Inbox,
      description: "Intelligent Workflow Analyzer",
      story:
        "Salil works in a growing startup where communication is spread across email, Slack, Jira, GitHub, and meeting notes. Important decisions get buried under notifications, duplicate threads, and long message chains. Critical action items are missed, responsibilities become unclear, and people waste hours just figuring out what actually matters. Salil starts wondering—what if software could automatically understand conversations, extract commitments, and keep everyone aligned without forcing people to change how they communicate?",
      challenge: [
        "Ingests data from multiple collaboration sources (simulated APIs or datasets)",
        "Identifies actionable items, deadlines, and owners from conversations",
        "Detects conflicting decisions or unresolved threads",
        "Tracks follow-ups and highlights overdue actions",
        "Presents a clean, role-based dashboard showing 'what needs attention now'",
      ],
    },
    {
      id: "multi-modal-severity",
      no: 12,
      title:
        "Multi-Modal Severity Quantifier – When Images and Reports Speak Together",
      icon: BrainCircuit,
      description: "Medical Imaging AI",
      story:
        "In a busy hospital, a radiologist reviews a chest X-ray on the screen. The image shows certain abnormalities, but it doesn't clearly answer one important question: How severe is the disease? To decide, the doctor reads the accompanying radiology report, which includes phrases like mild opacity, moderate involvement, or severe consolidation. The final decision comes from combining what is seen in the image with what is written in the report. However, hospitals generate thousands of X-rays and reports every day. Manually analyzing each image and report pair is time-consuming, and severity judgments can vary between experts. The radiologist wonders—what if a system could automatically read both the image and the report and consistently determine disease severity?",
      challenge: [
        "Analyzes chest X-ray images and radiology reports from the MIMIC-CXR dataset",
        "Understands radiology reports by extracting explicit severity cues and underlying clinical patterns",
        "Learns visual features from X-ray images that indicate disease progression",
        "Fuses text-based and image-based features into a single predictive model",
        "Classifies disease severity as Mild, Moderate, or Severe",
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

  if (config.hackaway.showMaintenance) {
    return <HackathonMaintenancePage />;
  }

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
