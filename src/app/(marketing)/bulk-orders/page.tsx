import { redirect } from "next/navigation";

/** Legacy route — bulk flows live on Business & Fleet */
export default function BulkOrdersPage() {
  redirect("/business-fleet");
}
