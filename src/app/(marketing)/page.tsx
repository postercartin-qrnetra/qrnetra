import { LandingPage } from "@/components/landing/landing-page";
import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams;
  if (params.code) {
    const qs = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value == null) continue;
      qs.set(key, Array.isArray(value) ? value[0]! : value);
    }
    redirect(`/auth/callback?${qs.toString()}`);
  }

  return <LandingPage />;
}
