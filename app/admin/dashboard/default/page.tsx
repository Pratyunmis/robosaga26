import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/current-user";
import { getAdminStats, getAnalyticsData } from "@/lib/admin/queries";
import { SectionCards } from "./_components/section-cards";
import { AnalyticsCharts } from "./_components/analytics-charts";

import { connection } from "next/server";

import { Suspense } from "react";
import { DashboardSkeleton } from "../_components/skeletons";

async function DashboardContent() {
  await connection();
  try {
    await requireAdmin();
  } catch {
    redirect("/api/auth/signin?callbackUrl=/admin/dashboard");
  }

  const stats = await getAdminStats();
  const analyticsData = await getAnalyticsData();

  return (
    <>
      <SectionCards stats={stats} />

      <div>
        <h2 className="text-xl font-semibold tracking-tight mb-4">
          Analytics & Insights
        </h2>
        <AnalyticsCharts
          userGrowthData={analyticsData.userGrowthData}
          branchDistribution={analyticsData.branchDistribution}
          hourlyActivity={analyticsData.hourlyActivity}
          stats={analyticsData.stats}
        />
      </div>
    </>
  );
}

export default function Page() {
  return (
    <div className="@container/main w-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to RoboSaga &apos;26 Admin Panel
        </p>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
