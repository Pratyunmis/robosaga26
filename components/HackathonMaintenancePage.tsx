"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AlertCircle } from "lucide-react";

export default function HackathonMaintenancePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="text-center space-y-6 max-w-2xl">
          <AlertCircle className="w-20 h-20 text-yellow-400 mx-auto" />
          
          <h1 className="text-5xl md:text-6xl font-bold">
            Under Maintenance
          </h1>
          
          <p className="text-xl text-gray-300">
            We're working hard to bring you an enhanced experience.
          </p>
          
          <p className="text-gray-400">
            We'll be back soon!
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
