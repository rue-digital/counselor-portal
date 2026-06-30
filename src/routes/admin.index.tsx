import { createFileRoute, Link } from "@tanstack/react-router";
import { PortalShell, StatusBadge } from "@/components/portal-shell";
import { Card } from "@/components/ui/card";
import {
  mockRequests,
  STATUSES,
  STATUS_LABELS,
  formatDate,
  type RequestStatus,
} from "@/lib/mock-data";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Request Board — Admin" }] }),
  component: AdminBoardPage,
});

function AdminBoardPage() {
  const byStatus = STATUSES.reduce<Record<RequestStatus, typeof mockRequests>>(
    (acc, s) => {
      acc[s] = mockRequests.filter((r) => r.status === s);
      return acc;
    },
    {} as Record<RequestStatus, typeof mockRequests>,
  );

  return (
    <PortalShell
      role="admin"
      title="Request Board"
      subtitle="All counselor requests, organized by status."
    >
      <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
        {STATUSES.map((status) => (
          <div key={status} className="flex flex-col min-w-0">
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="flex items-center gap-2">
                <StatusBadge status={status} />
                <span className="text-xs text-muted-foreground">
                  {byStatus[status].length}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2 rounded-lg bg-muted/40 p-2 min-h-[120px]">
              {byStatus[status].map((r) => (
                <Link
                  key={r.id}
                  to="/admin/requests/$id"
                  params={{ id: r.id }}
                  className="block"
                >
                  <Card className="p-3 hover:shadow-sm transition-shadow">
                    <div className="text-xs font-mono text-muted-foreground">{r.id}</div>
                    <div className="font-medium text-sm mt-0.5 line-clamp-2">{r.title}</div>
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{r.counselor}</span>
                      <span
                        className={
                          r.urgency === "High"
                            ? "text-rose-600 font-medium"
                            : r.urgency === "Medium"
                              ? "text-amber-600"
                              : ""
                        }
                      >
                        {r.urgency}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Updated {formatDate(r.updatedAt)}
                    </div>
                  </Card>
                </Link>
              ))}
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