import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { GreenhouseDetailView } from "@/components/greenhouse/greenhouse-detail-view";
import { getGreenhouseById } from "@/lib/dashboard/mock-data";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const zone = getGreenhouseById(id);
  if (!zone) return { title: "온실" };
  return { title: zone.name };
}

export default async function GreenhouseDetailPage({ params }: Props) {
  const { id } = await params;
  const zone = getGreenhouseById(id);
  if (!zone) notFound();

  return <GreenhouseDetailView zone={zone} />;
}
