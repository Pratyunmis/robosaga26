import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/current-user";
import { MessagesTable } from "./_components/messages-table";
import { connection } from "next/server";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

async function MessagesContent() {
  await connection();
  try {
    await requireAdmin();
  } catch {
    redirect("/api/auth/signin?callbackUrl=/admin/dashboard/messages");
  }

  return <MessagesTable />;
}

export default function MessagesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground mt-2">
          View and manage contact form submissions.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="w-full h-96 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <MessagesContent />
      </Suspense>
    </div>
  );
}
