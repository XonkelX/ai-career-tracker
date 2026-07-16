import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/ui/placeholder-page";

export const metadata: Metadata = {
  title: "Job applications",
};

export default function ApplicationsPage() {
  return (
    <PlaceholderPage
      action={{ href: "/applications/new", label: "Add application" }}
      description="Kanban and table views with search, filtering, sorting, deadlines, and status management will live here."
      title="Job applications"
    />
  );
}
