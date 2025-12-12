"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Bot, Menu, X, LogOut, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isProfileOpen]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/events", label: "Events" },
    { href: "/leaderboard", label: "Leaderboard" },
    { href: "/sponsors", label: "Sponsors" },
    { href: "/teams", label: "Teams" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-sm border-b-4 border-yellow-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/svg/robosaga.svg"
              alt="RoboSaga Logo"
              width={180}
              height={50}
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link, index) => (
              <div key={index}>
                <Link
                  href={link.href}
                  className={`text-white hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-colors relative group ${
                    pathname === link.href ? "text-yellow-400 font-bold" : ""
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-300 ${
                      pathname === link.href ? "w-full" : ""
                    }`}
                  />
                </Link>
              </div>
            ))}
            {session ? (
              <div className="relative ml-4" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 bg-yellow-400 text-black px-3 py-2 rounded-full font-bold hover:bg-yellow-500 transition-colors"
                >
                  {session.user?.image ? (
                    <div className="relative w-6 h-6 rounded-full overflow-hidden">
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                  <span className="text-sm">
                    {session.user?.name?.split(" ")[0] || "User"}
                  </span>
                </button>

                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-lg border-2 border-yellow-400/50 py-2 z-50"
                  >
                    <Link
                      href="/profile"
                      className="flex items-center space-x-2 px-4 py-2 text-white hover:bg-yellow-400/20 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="flex items-center space-x-2 px-4 py-2 text-white hover:bg-red-500/20 transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <Link href="/login">
                <button className="ml-4 bg-yellow-400 text-black px-4 py-2 rounded-full font-bold hover:bg-yellow-500 transition-colors">
                  Login
                </button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-yellow-400 hover:text-yellow-500 focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden bg-black/95"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white hover:text-yellow-400 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {session ? (
              <>
                <Link
                  href="/profile"
                  className="text-white hover:text-yellow-400 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="w-full bg-red-500 text-white px-4 py-2 rounded-full font-bold hover:bg-red-600 transition-colors mt-2 flex items-center justify-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setIsOpen(false)}>
                <button className="w-full bg-yellow-400 text-black px-4 py-2 rounded-full font-bold hover:bg-yellow-500 transition-colors mt-2">
                  Login
                </button>
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
}
