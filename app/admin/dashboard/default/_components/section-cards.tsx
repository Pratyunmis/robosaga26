"use client";

import { Users, Trophy, UserPlus, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SectionCardsProps {
  stats: {
    totalUsers: number;
    totalTeams: number;
    totalMembers: number;
    pendingRequests: number;
    recentUsers: number;
    recentTeams: number;
  };
}

export function SectionCards({ stats }: SectionCardsProps) {
  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      description: `${stats.recentUsers} new this week`,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Total Teams",
      value: stats.totalTeams,
      description: `${stats.recentTeams} new this week`,
      icon: Trophy,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Team Members",
      value: stats.totalMembers,
      description: "Across all teams",
      icon: UserPlus,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Pending Requests",
      value: stats.pendingRequests,
      description: "Join requests awaiting approval",
      icon: Clock,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
