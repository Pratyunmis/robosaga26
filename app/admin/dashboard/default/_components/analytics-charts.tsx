"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Pie,
  PieChart,
  XAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  Calendar,
  Trophy,
} from "lucide-react";

interface AnalyticsChartsProps {
  userGrowthData: Array<{ date: string; count: number }>;
  branchDistribution: Array<{ branch: string; count: number }>;
  hourlyActivity: Array<{ hour: number; count: number }>;
  stats: {
    totalUsers: number;
    recentUsers: number;
    monthlyUsers: number;
    totalTeams: number;
    recentTeams: number;
  };
}

export function AnalyticsCharts({
  userGrowthData,
  branchDistribution,
  hourlyActivity,
  stats,
}: AnalyticsChartsProps) {
  // --- User Growth Chart Config ---
  const userGrowthConfig = {
    count: {
      label: "Registrations",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  // --- Branch Distribution Chart Config ---
  // Generate dynamic colors for branches if possible, or mapping
  const branchChartConfig = React.useMemo(() => {
    const config: ChartConfig = {
      count: {
        label: "Users",
      },
    };
    branchDistribution.forEach((item, index) => {
      // Use css variables for chart colors if available, or fallbacks
      // We'll use the shadcn standard variables --chart-1 to --chart-5 cyclically
      const colorIndex = (index % 5) + 1;
      config[item.branch] = {
        label: item.branch,
        color: `var(--chart-${colorIndex})`,
      };
    });
    return config;
  }, [branchDistribution]);

  // Transform branch data to include fill colors for PieChart
  const branchDataWithFill = React.useMemo(() => {
    return branchDistribution.map((item, index) => ({
      ...item,
      fill: `var(--chart-${(index % 5) + 1})`,
    }));
  }, [branchDistribution]);

  // --- Hourly Activity Chart Config ---
  const hourlyConfig = {
    count: {
      label: "Activity",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  const totalBranchCount = React.useMemo(() => {
    return branchDistribution.reduce((acc, curr) => acc + curr.count, 0);
  }, [branchDistribution]);

  // Find peak activity hour
  const peakHour = React.useMemo(
    () =>
      hourlyActivity.length > 0
        ? hourlyActivity.reduce((max, item) =>
            item.count > max.count ? item : max
          ).hour
        : null,
    [hourlyActivity]
  );

  // Create a unique ID for the gradient to prevent conflicts
  const id = React.useId();
  const gradientId = `fillCount-${id.replace(/:/g, "")}`;

  return (
    <div className="grid md:grid-cols-2 gap-4 md:gap-6">
      {/* User Growth Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            User Registrations
          </CardTitle>
          <CardDescription>Daily user registration trend</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={userGrowthConfig}
            className="aspect-auto h-[250px] w-full min-w-[100px]"
          >
            <AreaChart
              accessibilityLayer
              data={userGrowthData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-count)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-count)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  // Assuming date is ISO or YYYY-MM-DD, format to short date
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey="count"
                type="natural"
                fill={`url(#${gradientId})`}
                fillOpacity={1}
                stroke="var(--color-count)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-bold text-foreground text-lg">
                {stats.recentUsers}
              </span>
              <span>new users this week</span>
            </div>
            {stats.recentUsers > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-orange-500" />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Branch Distribution Chart */}
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Branch Distribution
          </CardTitle>
          <CardDescription>Active users by department</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={branchChartConfig}
            className="mx-auto aspect-square h-[250px] min-w-[100px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={branchDataWithFill}
                dataKey="count"
                nameKey="branch"
                innerRadius={60}
                strokeWidth={5}
                stroke="var(--background)"
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalBranchCount.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground text-xs"
                          >
                            Users
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm text-muted-foreground pt-4">
          <div className="flex items-center gap-2 font-medium leading-none">
            Top branch: {branchDistribution[0]?.branch || "N/A"} (
            {branchDistribution[0]?.count || 0})
          </div>
        </CardFooter>
      </Card>

      {/* Hourly Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Peak Activity
          </CardTitle>
          <CardDescription>User activity by time of day</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={hourlyConfig}
            className="aspect-auto h-[250px] w-full min-w-[100px]"
          >
            <BarChart accessibilityLayer data={hourlyActivity}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="hour"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => `${value}:00`}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="count" fill="var(--color-count)" radius={8} />
            </BarChart>
          </ChartContainer>
          <div className="flex flex-col gap-1 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">Peak Hour:</span>
              <span>{peakHour !== null ? `${peakHour}:00` : "N/A"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Stats Summary - Keeping basic for now but styled better */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Team Formation
          </CardTitle>
          <CardDescription>Overview of team statistics</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 justify-center h-[250px]">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg">
              <span className="text-3xl font-bold">{stats.totalTeams}</span>
              <span className="text-sm text-muted-foreground">Total Teams</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg">
              <span className="text-3xl font-bold flex items-center gap-1">
                {stats.recentTeams}
                {stats.recentTeams > 0 && (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                )}
              </span>
              <span className="text-sm text-muted-foreground">
                New This Week
              </span>
            </div>
          </div>
          {stats.totalTeams > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>New Team Rate</span>
                <span>
                  {Math.round((stats.recentTeams / stats.totalTeams) * 100)}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round((stats.recentTeams / stats.totalTeams) * 100)
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
