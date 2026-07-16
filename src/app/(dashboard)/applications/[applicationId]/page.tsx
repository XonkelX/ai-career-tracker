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
      description={`Application detail placeholder for ID ${applicationId}. Editing, activity, linked resume, and AI actions are deferred.`}
      title="Application details"
    />
  );
}
