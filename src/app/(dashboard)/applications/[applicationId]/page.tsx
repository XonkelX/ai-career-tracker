import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/ui/placeholder-page";

export const metadata: Metadata = {
  title: "Application details",
};

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const { applicationId } = await params;

  return (
    <PlaceholderPage
      description={`Application detail placeholder for ID ${applicationId}. Editing, activity history, and linked resume details are available through focused workflows.`}
      title="Application details"
    />
  );
}
