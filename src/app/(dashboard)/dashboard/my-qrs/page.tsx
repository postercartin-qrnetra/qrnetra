import { redirect } from "next/navigation";

export default function MyQrsRedirectPage() {
  redirect("/dashboard/tags");
}
