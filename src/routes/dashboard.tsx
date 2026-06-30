import { createFileRoute, Link } from "@tanstack/react-router";
import { PortalShell, StatusBadge } from "@/components/portal-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockRequests, STATUSES, STATUS_LABELS, formatDate } from "@/lib/mock-data";
import { FilePlus2, ArrowRight } from "lucide-react";

const CURRENT_COUNSELOR = "Jordan Reyes";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Counselor Portal" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const mine = mockRequests.filter((r) => r.counselor === CURRENT_COUNSELOR);
  const counts = STATUSES.reduce<Record<string, number>>((acc, s) => {
    acc[s] = mine.filter((r) => r.status === s).length;
    return acc;
  }, {});
  const recent = [...mine].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5);

  return (
    <PortalShell
      role="counselor"
      title={`Welcome back, ${CURRENT_COUNSELOR.split(" ")[0]}`}
      subtitle="Here's an overview of your active assistance requests."
      actions={
        <Button asChild>
          <Link to="/requests/new">
            <FilePlus2 className="h-4 w-4" />
            New request
          </Link>
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {STATUSES.map((s) => (
          <Card key={s}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {STATUS_LABELS[s]}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">{counts[s]}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent activity</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link to="/requests">
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="divide-y">
          {recent.map((r) => (
            <Link
              key={r.id}
              to="/requests/$id"
              params={{ id: r.id }}
              className="flex items-center justify-between py-3 hover:bg-muted/40 -mx-6 px-6"
            >
              <div className="min-w-0">
                <div className="font-medium truncate">{r.title}</div>
                <div className="text-xs text-muted-foreground">
                  {r.id} · {r.client} · Updated {formatDate(r.updatedAt)}
                </div>
              </div>
              <StatusBadge status={r.status} />
            </Link>
          ))}
        </CardContent>
      </Card>
    </PortalShell>
  );
}