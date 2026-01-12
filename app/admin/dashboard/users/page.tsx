import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/admin/current-user"; // Updated import
import { getAllUsers } from "@/lib/admin/queries";
import { UsersDataTable } from "./_components/users-data-table";
import { connection } from "next/server";
import { Suspense } from "react";
import { DataTableSkeleton } from "../_components/skeletons";

async function UsersContent() {
  await connection();
  let currentUser;
  try {
    currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "admin") {
      throw new Error("Unauthorized");
    }
  } catch {
    redirect("/api/auth/signin?callbackUrl=/admin/dashboard/users");
  }
  const users = await getAllUsers();
  return <UsersDataTable users={users} currentUserId={currentUser.id} />;
}

export default function UsersPage() {
  return (
    <div className="@container/main flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
        <p className="text-muted-foreground mt-2">
          View and manage all registered users
        </p>
      </div>

      <Suspense fallback={<DataTableSkeleton />}>
        <UsersContent />
      </Suspense>
    </div>
  );
}
