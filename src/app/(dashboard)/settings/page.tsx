import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/ui/placeholder-page";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <PlaceholderPage
      description="Profile, theme, privacy, data export, and account deletion controls will be added in later milestones."
      title="Settings"
    />
  );
}
