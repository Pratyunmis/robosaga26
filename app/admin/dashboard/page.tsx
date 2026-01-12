import { redirect } from "next/navigation";
import { connection } from "next/server";

export default async function Page() {
  // Force dynamic rendering to prevent prerendering errors
  await connection();

  redirect("/admin/dashboard/default");
}
