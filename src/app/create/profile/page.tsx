import { redirect } from "next/navigation";

type Props = { searchParams: Promise<{ type?: string }> };

export default async function CreateProfilePage({ searchParams }: Props) {
  const { type } = await searchParams;
  redirect(type ? `/create?type=${encodeURIComponent(type)}` : "/create");
}
