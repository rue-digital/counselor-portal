import { createFileRoute, Link } from "@tanstack/react-router";
import { PortalShell, StatusBadge } from "@/components/portal-shell";
import { Card } from "@/components/ui/card";
import { STATUSES, STATUS_LABELS, formatDate, type RequestStatus } from "@/lib/mock-data";
import { useState, useEffect } from "react";
import { getAllRequests } from "@/lib/tickets.server";
import type { Request } from "@/lib/types";
import { requireRole } from "@/lib/route-auth";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react"; // or icon of choice
import { exportTicketsToCSV } from "@/lib/export-csv";

export const Route = createFileRoute("/admin/")({
  beforeLoad: async () => {
    const profile = await requireRole("admin");
    return { profile };
  },
  head: () => ({ meta: [{ title: "Request Board — Admin" }] }),
  component: AdminBoardPage,
});

const TOP_N_TICKETS = 4;

function AdminBoardPage() {
  const { profile } = Route.useRouteContext();
  const [tickets, setTickets] = useState<Request[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      const requests = await getAllRequests();
      setTickets(requests);
      setLoading(false);
    }

    void loadDashboard();
  }, []);

  let byStatus: Record<RequestStatus, Request[]>;
  if (tickets) {
    byStatus = STATUSES.reduce<Record<RequestStatus, Request[]>>(
      (acc, s) => {
        acc[s] = tickets.filter((r) => r.status === s);
        return acc;
      },
      {} as Record<RequestStatus, Request[]>,
    );
  } else {
    byStatus = STATUSES.reduce<Record<RequestStatus, Request[]>>(
      (acc, s) => {
        acc[s] = [];
        return acc;
      },
      {} as Record<RequestStatus, Request[]>,
    );
  }

  if (loading) {
    return (
      <PortalShell role={profile.role} title="Loading...">
        <div className="text-sm text-muted-foreground">Loading requests...</div>
      </PortalShell>
    );
  }

  return (
    <PortalShell
      role={profile.role}
      title={`Welcome back, ${profile.full_name.split(" ")[0]}`}
      subtitle="All counselor requests, organized by status."
    >
      {/* Export Action Bar */}
      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          size="sm"
          disabled={!tickets || tickets.length === 0}
          onClick={() => exportTicketsToCSV(tickets || [])}
        >
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>
      <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
        {STATUSES.map((status) => (
          <div key={status} className="flex flex-col min-w-0">
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="flex items-center gap-2">
                <Link to="/admin/$id" params={{ id: status }}>
                  {" "}
                  <StatusBadge status={status} />
                </Link>
                <span className="text-xs text-muted-foreground">
                  {byStatus[status].length > 0 ? byStatus[status].length : null}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2 rounded-lg bg-muted/40 p-2 min-h-[120px]">
              {byStatus[status].slice(0, TOP_N_TICKETS).map((r) => (
                <Link key={r.id} to="/admin/requests/$id" params={{ id: r.id }} className="block">
                  <Card className="p-3 hover:shadow-sm transition-shadow">
                    <div className="text-xs font-mono text-muted-foreground">
                      {"REQ-" + r.id.slice(0, 8)}
                    </div>
                    <div className="font-medium text-sm mt-0.5 line-clamp-2">
                      {r.request_details.length > 45
                        ? r.request_details.slice(0, 45) + "..."
                        : r.request_details}
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{r.counselor}</span>
                      <span
                        className={
                          r.priority === "High"
                            ? "text-rose-600 font-medium"
                            : r.priority === "Medium"
                              ? "text-amber-600"
                              : ""
                        }
                      >
                        {r.priority}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Updated {formatDate(r.updated_at)}
                    </div>
                  </Card>
                </Link>
              ))}
              {byStatus[status].length > TOP_N_TICKETS ? (
                <Button asChild variant="ghost" size="sm">
                  <Link to="/admin/$id" params={{ id: status }}>
                    View all
                  </Link>
                </Button>
              ) : null}
              {byStatus[status].length === 0 ? (
                <div className="text-xs text-muted-foreground text-center py-6">
                  No {STATUS_LABELS[status].toLowerCase()} requests
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </PortalShell>
  );
}
