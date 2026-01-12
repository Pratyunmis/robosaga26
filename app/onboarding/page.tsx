"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import PacmanLoader from "@/components/PacmanLoader";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

const branches = [
  "Computer Science and Engineering",
  "Artificial Intelligence & Machine Learning",
  "Electronics & Communication Engineering",
  "Electrical & Electronics Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Biotechnology",
  "Production & Industrial Engineering",
  "B.Arch",
  "B.Pharm",
  "Others",
] as const;

const onboardingSchema = z.object({
  rollno: z.string().min(1, "Roll number is required"),
  branch: z.string().min(1, "Branch is required"),
  phoneNo: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(10, "Phone number must be at most 10 digits")
    .regex(/^[0-9]+$/, "Phone number must contain only numbers"),
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

export default function OnboardingPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      rollno: "",
      branch: "",
      phoneNo: "",
    },
  });

  const onboardingMutation = useMutation({
    mutationFn: async (data: OnboardingFormValues) => {
      const response = await axiosInstance.post("/onboarding", data);
      return response.data;
    },
    onSuccess: async () => {
      toast.success("Profile updated successfully!");
      // Update the session with new data
      await update();
      // Redirect to home page
      router.push("/");
    },
    onError: (error: unknown) => {
      const errorMessage =
        (
          error as {
            response?: { data?: { message?: string } };
            message?: string;
          }
        )?.response?.data?.message ||
        (error as Error).message ||
        "Failed to update profile";
      toast.error(errorMessage);
    },
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    // If user already has rollNo and branch, redirect to home
    if (session?.user?.rollNo && session?.user?.branch) {
      router.push("/");
    }
  }, [status, session, router]);

  const onSubmit = (data: OnboardingFormValues) => {
    onboardingMutation.mutate(data);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <PacmanLoader />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated Pac-Man dots background */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-12 gap-8 p-8 h-full">
          {[...Array(60)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"
              style={{
                animationDelay: `${i * 0.1}s`,
                animationDuration: "2s",
              }}
            />
          ))}
        </div>
      </div>

      {/* Floating pacman */}
      <div
        className="absolute top-20 left-10 animate-bounce"
        style={{ animationDuration: "3s" }}
      >
        <div className="text-6xl">
          <Image
            src="/svg/pacman-svgrepo-com.svg"
            alt="pacman"
            width={48}
            height={48}
          />
        </div>
      </div>
      <div
        className="absolute bottom-20 right-10 animate-bounce"
        style={{ animationDuration: "2.5s", animationDelay: "0.5s" }}
      >
        <div className="text-6xl">
          <Image
            src="/svg/pacman-svgrepo-com.svg"
            alt="pacman"
            width={48}
            height={48}
          />
        </div>
      </div>
      <div
        className="absolute top-40 right-20 animate-bounce"
        style={{ animationDuration: "3.5s", animationDelay: "1s" }}
      >
        <div className="text-5xl">
          <Image
            src="/svg/pacman-svgrepo-com.svg"
            alt="pacman"
            width={48}
            height={48}
          />
        </div>
      </div>

      {/* Main onboarding card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-blue-950 border-4 border-yellow-400 rounded-3xl shadow-2xl shadow-yellow-400/50 p-8 relative overflow-hidden">
          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-yellow-400 rounded-tl-3xl" />
          <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-yellow-400 rounded-tr-3xl" />
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-yellow-400 rounded-bl-3xl" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-yellow-400 rounded-br-3xl" />

          {/* RoboSaga Logo */}
          <div className="flex justify-center mb-8 -mt-2">
            <div className="relative">
              <Image
                src="/svg/robosaga.svg"
                alt="RoboSaga '26 Logo"
                loading="eager"
                width={280}
                height={100}
                className="h-20 w-auto"
              />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-center mb-2 text-yellow-400 font-mono tracking-wider">
            COMPLETE SETUP!
          </h1>
          <p className="text-center text-blue-300 mb-8 font-mono text-sm">
            ENTER YOUR DETAILS
          </p>

          {/* Score display */}
          <div className="flex justify-between mb-8 px-4">
            <div className="text-yellow-400 font-mono">
              <div className="text-xs text-blue-300">1UP</div>
              <div className="text-xl">00</div>
            </div>
            <div className="text-yellow-400 font-mono">
              <div className="text-xs text-blue-300">HIGH SCORE</div>
              <div className="text-xl">999999</div>
            </div>
          </div>

          {/* Onboarding form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="rollno"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-yellow-400 font-mono text-sm">
                      ROLL NUMBER
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter your roll number"
                        className="bg-black border-2 border-yellow-400/50 focus:border-yellow-400 text-white font-mono placeholder:text-gray-500 rounded-xl py-3 px-4"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 font-mono text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-yellow-400 font-mono text-sm">
                      PHONE NUMBER
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter your phone number"
                        className="bg-black border-2 border-yellow-400/50 focus:border-yellow-400 text-white font-mono placeholder:text-gray-500 rounded-xl py-3 px-4"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 font-mono text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="branch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-yellow-400 font-mono text-sm">
                      BRANCH
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full bg-black border-2 border-yellow-400/50 focus:border-yellow-400 text-white font-mono rounded-xl py-3 px-4">
                          <SelectValue placeholder="Select your branch" />
                        </SelectTrigger>
                        <SelectContent className="bg-blue-950 border-2 border-yellow-400/50 text-white font-mono">
                          <SelectGroup>
                            <SelectLabel className="text-yellow-400">
                              Branch
                            </SelectLabel>
                            {branches.map((branch) => (
                              <SelectItem
                                key={branch}
                                value={branch}
                                className="focus:bg-yellow-400/20 focus:text-white"
                              >
                                {branch}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-red-400 font-mono text-xs" />
                  </FormItem>
                )}
              />

              <button
                type="submit"
                disabled={onboardingMutation.isPending}
                className="w-full cursor-pointer bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl border-4 border-yellow-400 shadow-lg shadow-green-500/50 transition-all duration-400 hover:scale-[1.02] hover:shadow-xl hover:shadow-green-500/70 font-mono text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {onboardingMutation.isPending ? "SAVING..." : "START GAME"}
              </button>
            </form>
          </Form>

          {/* Footer text */}
          <div className="mt-8 text-center">
            <p className="text-blue-300 text-xs font-mono">
              © 2026 Robolution,BIT Mesra. All rights reserved.
            </p>
            <div className="flex justify-center gap-2 mt-2">
              <span className="text-yellow-400 text-xl">●</span>
              <span className="text-yellow-400 text-xl">●</span>
              <span className="text-yellow-400 text-xl">●</span>
            </div>
          </div>
        </div>

        {/* Power pellet animation */}
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="w-8 h-8 bg-yellow-400 rounded-full animate-ping" />
        </div>
      </div>
    </div>
  );
}
