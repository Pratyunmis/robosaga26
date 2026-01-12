"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Target,
  Megaphone,
  Handshake,
  Lightbulb,
  type LucideIcon,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function SponsorsPage() {
  const sponsorshipTiers = [
    {
      tier: "Title Sponsor",
      amount: "Above ₹50,000",
      color: "from-yellow-400 to-yellow-600",
      benefits: [
        '"Title Sponsor" tag across entire event',
        "Logo on all posters, banners, and certificates",
        "Logo on stage backdrop and inauguration standee",
        "Dedicated stall/booth at the venue",
        "Social media spotlight with promotional video",
        "Recognition during opening and closing ceremonies",
        "Opportunity for a short address",
        "Maximum brand visibility",
      ],
    },
    {
      tier: "Gold Sponsor",
      amount: "Above ₹25,000",
      color: "from-orange-400 to-orange-600",
      benefits: [
        "Logo placement with title sponsor (below title sponsor)",
        "Branding on certificates",
        "Prime and large promotional booth space",
        "2 social media shoutouts",
        "Stage acknowledgment during events",
        "High visibility throughout the event",
      ],
    },
    {
      tier: "Silver Sponsor",
      amount: "Above ₹15,000",
      color: "from-gray-300 to-gray-500",
      benefits: [
        "Logo on posters and banners",
        "Mention on certificates",
        "1 social media shoutout",
        "Mention during announcements",
        "Publicity via media and newsroom",
        "Good brand exposure",
      ],
    },
  ];

  const stats = [
    { value: "5000+", label: "Participants" },
    { value: "10,000+", label: "Social Media Impressions" },
    { value: "100+", label: "Colleges" },
    { value: "50+", label: "Industry Partners" },
  ];

  const whySponsor: Array<{
    icon: LucideIcon;
    title: string;
    description: string;
  }> = [
    {
      icon: Target,
      title: "Target Audience",
      description:
        "Reach 5000+ students, tech enthusiasts, and future engineers",
    },
    {
      icon: Megaphone,
      title: "Brand Visibility",
      description:
        "Extensive exposure through social media, banners, and event materials",
    },
    {
      icon: Handshake,
      title: "Networking",
      description: "Connect with talented students and academic institutions",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description:
        "Associate your brand with cutting-edge technology and innovation",
    },
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            Become a <span className="text-yellow-400">Sponsor</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto mb-8"
          >
            Partner with RoboSaga&lsquo;26 and showcase your brand to thousands
            of aspiring engineers and tech enthusiasts
          </motion.p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-12"
          >
            Our <span className="text-yellow-400">Reach</span>
          </motion.h2>

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

      {/* Why Sponsor Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-12"
          >
            Why <span className="text-yellow-400">Sponsor Us?</span>
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whySponsor.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-linear-to-br from-gray-900 to-black border-2 border-yellow-400/50 hover:border-yellow-400 transition-all h-full text-center">
                  <CardHeader>
                    <item.icon className="w-12 h-12 text-yellow-400 mb-4" />
                    <CardTitle className="text-xl text-yellow-400">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsorship Tiers */}
      <section className="py-20 bg-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-12"
          >
            Sponsorship <span className="text-yellow-400">Packages</span>
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {sponsorshipTiers.map((tier, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-linear-to-br from-gray-900 to-black border-2 border-yellow-400/50 hover:border-yellow-400 transition-all h-full">
                  <CardHeader>
                    <div
                      className={`bg-linear-to-r ${tier.color} p-4 -mx-6 -mt-6 rounded-t-lg mb-4`}
                    >
                      <CardTitle className="text-2xl text-black text-center">
                        {tier.tier}
                      </CardTitle>
                      <p className="text-center text-black/80 font-bold mt-2">
                        {tier.amount}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {tier.benefits.map((benefit, i) => (
                        <div
                          key={i}
                          className="flex items-start text-sm text-gray-300"
                        >
                          <span className="text-yellow-400 mr-2 mt-1">✓</span>
                          <span>{benefit}</span>
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

      {/* Current Sponsors Placeholder */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-12"
          >
            Our <span className="text-yellow-400">Sponsors</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-linear-to-br from-gray-900 to-black border-2 border-yellow-400/50 p-12 rounded-lg text-center"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="group flex flex-col items-center gap-4">
                  <div className="w-full aspect-video rounded-xl bg-gray-900/40 border border-dashed border-gray-800 flex items-center justify-center transition-all duration-300 group-hover:border-yellow-400/30 group-hover:bg-gray-900/60">
                    <div className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center group-hover:border-yellow-400/20 transition-colors">
                      <span className="text-xl font-semibold text-gray-400 group-hover:text-yellow-400">
                        coming soon
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-linear-to-r from-yellow-400 to-yellow-500 p-12 rounded-2xl"
          >
            <h2 className="text-4xl font-bold text-black mb-4">
              Interested in Sponsoring?
            </h2>
            <p className="text-black/80 text-lg mb-8">
              Get in touch with us to discuss sponsorship opportunities and
              customize a package for your brand
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:pratyumnis@bitmesra.ac.in">
                <Button className="bg-black text-yellow-400 px-8 py-4 rounded-full font-bold hover:bg-gray-900 transition-colors text-lg">
                  Contact Us
                </Button>
              </a>
              <a href="tel:8789727207">
                <Button className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors text-lg">
                  Call Now
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
