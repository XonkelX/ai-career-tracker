import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/ui/placeholder-page";

export const metadata: Metadata = {
  title: "Resumes",
};

export default function ResumesPage() {
  return (
    <PlaceholderPage
      description="Manage resume metadata, immutable versions, and application associations from this workspace."
      title="Resumes"
    />
  );
}
