import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/ui/placeholder-page";

export const metadata: Metadata = {
  title: "Add a job application",
};

export default function NewApplicationPage() {
  return (
    <PlaceholderPage
      description="An accessible, server-validated application form will be implemented in the application-management milestone."
      title="Add a job application"
    />
  );
}
