import { PlaceholderPage } from "@/components/ui/placeholder-page";

const metrics = [
  "Total applications",
  "Applications by status",
  "Interview conversion",
  "Upcoming deadlines",
];

export default function DashboardPage() {
  return (
    <PlaceholderPage
      description="A future overview of application volume, outcomes, recent activity, and deadlines."
      title="Dashboard"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div
            className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800"
            key={metric}
          >
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {metric}
            </p>
            <p className="mt-3 text-2xl font-semibold">—</p>
          </div>
        ))}
      </div>
    </PlaceholderPage>
  );
}
