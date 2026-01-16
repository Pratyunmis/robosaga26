"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Facebook,
  Instagram,
  type LucideIcon,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("/api/contact", formData);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      toast.success("Message sent successfully!");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  const contactInfo: Array<{
    icon: LucideIcon;
    title: string;
    value: string;
    detail?: string;
    link?: string;
  }> = [
    {
      icon: Mail,
      title: "Email",
      value: "pratyumnis@bitmesra.ac.in",
      link: "mailto:pratyumnis@bitmesra.ac.in",
    },
    {
      icon: Phone,
      title: "Phone",
      value: "Ayush Kumar",
      detail: "8789727207",
      link: "tel:8789727207",
    },
    {
      icon: Phone,
      title: "Faculty Advisor",
      value: "Dr. Binay Kumar",
      detail: "8709337300",
      link: "tel:8709337300",
    },
    {
      icon: MapPin,
      title: "Location",
      value: "BIT Mesra, Ranchi",
      detail: "Jharkhand, India",
    },
  ];

  const socialLinks: Array<{
    name: string;
    icon: LucideIcon;
    url: string;
    color: string;
  }> = [
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "https://www.linkedin.com/company/robolution-bit-mesra",
      color: "from-blue-500 to-blue-700",
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: "https://www.facebook.com/TeamRobolution",
      color: "from-blue-600 to-blue-800",
    },
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://www.instagram.com/robolution.bitm/",
      color: "from-pink-500 to-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-black via-blue-950 to-black text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Get in <span className="text-yellow-400">Touch</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Have questions about RoboSaga &apos;26? We&apos;re here to help!
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <Card
                key={index}
                className="bg-linear-to-br from-gray-900 to-black border-2 border-yellow-400/50 hover:border-yellow-400 transition-colors h-full"
              >
                <CardHeader className="text-center">
                  <info.icon className="w-12 h-12 text-yellow-400 mb-3 mx-auto" />
                  <CardTitle className="text-lg text-yellow-400">
                    {info.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  {info.link ? (
                    <a
                      href={info.link}
                      className="text-white hover:text-yellow-400 transition-colors block"
                    >
                      <div className="font-semibold">{info.value}</div>
                      {info.detail && (
                        <div className="text-sm text-gray-400 mt-1">
                          {info.detail}
                        </div>
                      )}
                    </a>
                  ) : (
                    <>
                      <div className="font-semibold text-white">
                        {info.value}
                      </div>
                      {info.detail && (
                        <div className="text-sm text-gray-400 mt-1">
                          {info.detail}
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-20 bg-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Contact Form */}
            <Card className="bg-linear-to-br from-gray-900 to-black border-2 border-yellow-400/50">
              <CardHeader>
                <CardTitle className="text-2xl text-yellow-400">
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                {submitted && (
                  <div className="bg-green-500/20 border border-green-500 text-green-400 p-4 rounded-lg mb-6">
                    ✓ Message sent successfully! We&apos;ll get back to you
                    soon.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Name
                    </label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Your name"
                      required
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="your.email@example.com"
                      required
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Subject
                    </label>
                    <Input
                      type="text"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      placeholder="What is this about?"
                      required
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Message
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Your message..."
                      required
                      rows={5}
                      className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="pacman"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Map */}
            <div className="h-full min-h-[500px]">
              <div className="overflow-hidden rounded-2xl border-2 border-yellow-400/50 h-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3661.333697172754!2d85.43732607549292!3d23.41230990167148!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f4fb53f0c27be7%3A0x66180c1cf3c5e704!2sBirla%20Institute%20of%20Technology%20-%20Mesra!5e0!3m2!1sen!2sin!4v1765387274422!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Links */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8">
            Connect with <span className="text-yellow-400">Us</span>
          </h2>
          <div className="flex justify-center gap-6">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div
                  className={`bg-linear-to-br ${social.color} p-4 rounded-full border-2 border-transparent group-hover:border-yellow-400 transition-all`}
                >
                  <social.icon className="w-8 h-8 text-white" />
                </div>
                <p className="text-sm text-gray-400 mt-2 group-hover:text-yellow-400 transition-colors">
                  {social.name}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* About BIT Mesra */}
      <section className="py-20 bg-black/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-linear-to-br from-yellow-400/20 to-transparent p-8 rounded-lg border-2 border-yellow-400/50 text-center">
            <h2 className="text-3xl font-bold mb-4">
              About <span className="text-yellow-400">BIT Mesra</span>
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Birla Institute of Technology (BIT) Mesra is one of the oldest
              Institutes of Technology in independent India, founded in 1955 by
              visionary industrialist and philanthropist Mr. B.M. Birla. Located
              in Ranchi, the capital of Jharkhand, BIT Mesra has been a beacon
              of excellence in technical education for over six decades.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
