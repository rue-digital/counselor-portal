import { createFileRoute, Link } from "@tanstack/react-router";
import { PortalShell, StatusBadge } from "@/components/portal-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { STATUSES, STATUS_LABELS, formatDate } from "@/lib/mock-data";
import { FilePlus2, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import type { Database } from "../lib/supabase";
import { getAllRequests, getLoggedInUserName, Ticket } from "@/lib/auth";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Counselor Portal" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const [name, setName] = useState<string | null>(null);
  const [tickets, setTickets] = useState<Ticket[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const full_name = await getLoggedInUserName();
      if (full_name) setName(full_name);
    }

    async function loadDashboard() {
      const requests = await getAllRequests();
      setTickets(requests);
      setLoading(false);
    }

    void loadUser();
    void loadDashboard();
  }, []);

  let counts: Record<string, number>;

  if (tickets) {
    counts = STATUSES.reduce<Record<string, number>>((acc, s) => {
      console.log(s);
      acc[s] = tickets.filter((r) => r.status === s).length;
      return acc;
    }, {});
  }
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <PortalShell
      role="counselor"
      title={`Welcome back, ${name?.split(" ")[0]}`}
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
              {counts ? <div className="text-3xl font-semibold">{counts[s]}</div> : null}
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
          {tickets?.map((r) => (
            <Link
              key={r.id}
              to="/requests/$id"
              params={{ id: r.id }}
              className="flex items-center justify-between py-3 hover:bg-muted/40 -mx-6 px-6"
            >
              <div className="min-w-0">
                <div className="font-medium truncate">{r.title}</div>
                <div className="text-xs text-muted-foreground">
                  {"REQ-" + r.id.slice(0, 8)} · {r.title} · Updated {formatDate(r.updated_at)}
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
