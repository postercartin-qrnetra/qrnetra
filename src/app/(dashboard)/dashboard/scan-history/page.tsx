import { redirect } from "next/navigation";

export default function ScanHistoryRedirect() {
  redirect("/dashboard/scan-activity");
}
