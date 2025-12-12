"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Mail, ArrowLeft, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-black via-blue-950 to-black text-white flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-20 w-4 h-4 bg-yellow-400 rounded-full"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-40 right-20 w-3 h-3 bg-yellow-400 rounded-full"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
        />
        <motion.div
          className="absolute bottom-20 left-40 w-3 h-3 bg-yellow-400 rounded-full"
          animate={{
            x: [0, 60, 0],
            y: [0, -40, 0],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
        />
        <motion.div
          className="absolute bottom-40 right-40 w-4 h-4 bg-yellow-400 rounded-full"
          animate={{
            x: [0, -70, 0],
            y: [0, -30, 0],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{ duration: 4.5, repeat: Infinity, delay: 1.5 }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full relative z-10"
      >
        <Card className="bg-linear-to-br from-red-950/50 to-black border-2 border-red-500/50 backdrop-blur-sm">
          <CardContent className="p-8 md:p-12 text-center">
            {/* Robot Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-6 relative"
            >
              <div className="relative inline-block">
                <Image
                  src="/svg/robosaga.svg"
                  alt="RoboSaga Logo"
                  loading="eager"
                  width={96}
                  height={96}
                  className="mx-auto opacity-50"
                />
                <motion.div
                  className="absolute -top-2 -right-2"
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                >
                  <AlertTriangle className="w-10 h-10 text-yellow-400" />
                </motion.div>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              <span className="text-red-500">ACCESS DENIED</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4 mb-8"
            >
              <p className="text-xl text-gray-300 font-mono">
                SYSTEM AUTHENTICATION FAILED
              </p>
              <p className="text-lg text-gray-400">
                Only BIT Mesra students can access RoboSaga &apos;26
              </p>

              <motion.div
                className="bg-black/70 border-2 border-yellow-400/50 rounded-lg p-6 my-6 relative overflow-hidden"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(250, 204, 21, 0.3)",
                    "0 0 40px rgba(250, 204, 21, 0.5)",
                    "0 0 20px rgba(250, 204, 21, 0.3)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-yellow-400 to-transparent">
                  <motion.div
                    className="h-full w-20 bg-yellow-400"
                    animate={{ x: [-100, 400] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>

                <div className="flex items-center justify-center gap-3 mb-3">
                  <Zap className="w-6 h-6 text-yellow-400" />
                  <p className="text-lg font-bold text-yellow-400 font-mono">
                    REQUIRED EMAIL DOMAIN
                  </p>
                  <Zap className="w-6 h-6 text-yellow-400" />
                </div>
                <p className="text-3xl font-bold text-white font-mono tracking-wider">
                  @bitmesra.ac.in
                </p>
              </motion.div>

              <p className="text-gray-400">
                Please sign in with your official BIT Mesra email address
                <br />
                using either{" "}
                <span className="text-yellow-400 font-semibold">
                  GitHub
                </span> or{" "}
                <span className="text-yellow-400 font-semibold">Google</span>{" "}
                authentication.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/login">
                <Button className="bg-yellow-400 cursor-pointer text-black hover:bg-yellow-500 px-8 py-6 text-lg font-bold font-mono border-2 border-yellow-500 shadow-lg shadow-yellow-400/50 hover:shadow-yellow-400/70 transition-all w-full sm:w-auto">
                  <Zap className="w-5 h-5 mr-2" />
                  TRY AGAIN
                </Button>
              </Link>

              <Link href="/">
                <Button
                  variant="outline"
                  className="border-2 text-black border-gray-600 hover:text-white cursor-pointer hover:bg-gray-800 hover:border-yellow-400 px-8 py-6 text-lg font-mono transition-all w-full sm:w-auto"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  GO HOME
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 pt-8 border-t border-gray-700/50"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Mail className="w-4 h-4 text-yellow-400" />
                <p className="text-sm text-gray-400 font-mono">SUPPORT</p>
              </div>
              <p className="text-sm text-gray-500">
                If you are a BIT Mesra student and facing issues,
                <br />
                please contact the event organizers.
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
