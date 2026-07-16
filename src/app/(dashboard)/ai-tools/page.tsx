import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/ui/placeholder-page";

export const metadata: Metadata = {
  title: "AI tools",
};

export default function AiToolsPage() {
  return (
    <PlaceholderPage
      description="Grounded resume analysis, cover-letter drafts, professional summaries, and interview questions will be generated here with explicit user review."
      title="AI tools"
    />
  );
}
