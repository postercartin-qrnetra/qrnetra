import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ kind: string }>;
};

const KIND_MAP: Record<string, string> = {
  kid: "child",
  child: "child",
  pet: "pet",
  vehicle: "vehicle",
  asset: "asset",
  business: "business",
};

export default async function CreateKindPage({ params }: Props) {
  const { kind } = await params;
  const resolved = KIND_MAP[kind];
  redirect(resolved ? `/create?type=${encodeURIComponent(resolved)}` : "/create");
}
