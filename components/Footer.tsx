import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, Linkedin, Facebook, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black border-t-4 border-yellow-400 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <Image
              src="/svg/robosaga.svg"
              alt="RoboSaga Logo"
              width={200}
              loading="eager"
              height={60}
              className="h-16 w-auto mb-4"
            />
            <p className="text-gray-400 text-sm">
              Pioneering Innovation, Redefining Robotics. Presented by
              Robolution, BIT Mesra.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-yellow-400 font-bold text-lg mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  href="/leaderboard"
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link
                  href="/sponsors"
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  Sponsors
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-yellow-400 font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" /> pratyumnis@bitmesra.ac.in
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" /> Ayush Kumar: 8789727207
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" /> Dr. Binay Kumar: 8709337300
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-yellow-400 font-bold text-lg mb-4">
              Follow Us
            </h3>
            <div className="flex space-x-4">
              <a
                href="https://www.linkedin.com/company/robolution-bit-mesra"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-yellow-400 transition-colors"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a
                href="https://www.facebook.com/TeamRobolution"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-yellow-400 transition-colors"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="https://www.instagram.com/robolution.bitm/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-yellow-400 transition-colors"
              >
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2026 Robolution, BIT Mesra. All rights reserved.</p>
          <p className="mt-2">23-25 January, 2026</p>
        </div>
      </div>
    </footer>
  );
}
