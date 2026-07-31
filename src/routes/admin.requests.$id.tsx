import { createFileRoute, Link } from "@tanstack/react-router";
import { PortalShell } from "@/components/portal-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUSES, STATUS_LABELS, type RequestStatus } from "@/lib/mock-data";
import { RequestDetail } from "@/components/request-detail";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Ticket, getRequest } from "@/lib/auth";
import { requireRole } from "@/lib/route-auth";

export const Route = createFileRoute("/admin/requests/$id")({
  beforeLoad: async () => {
    const profile = await requireRole("admin");
    return { profile };
  },
  head: () => ({ meta: [{ title: "Request — Admin" }] }),
  component: AdminRequestDetailPage,
  notFoundComponent: () => (
    <PortalShell role="admin" title="Request not found">
      <p className="text-muted-foreground">
        We couldn't find that request.{" "}
        <Link to="/admin" className="underline">
          Back to board
        </Link>
      </p>
    </PortalShell>
  ),
});

function AdminRequestDetailPage() {
  const { profile } = Route.useRouteContext();
  const { id } = Route.useParams();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState<RequestStatus>(ticket?.status || "submitted");

  useEffect(() => {
    async function getTicket() {
      const request = await getRequest({ data: { id } });
      if (!request) {
        toast.error("Failed to load request. Contact site administrator.");
        setLoading(false);
        return;
      }
      setTicket(request);
      setCurrentStatus(request.status);
      setLoading(false);
    }

    void getTicket();
  }, [id]);

  if (loading || !ticket) {
    return (
      <PortalShell role={profile.role} title="Request detail">
        <div className="text-sm text-muted-foreground">Loading request...</div>
      </PortalShell>
    );
  }

  const { status, ...react } = ticket;
  const request = { ...react, status: currentStatus };

  return (
    <PortalShell
      role={profile.role}
      title="Request detail"
      subtitle="Review and update the status of this request."
      actions={
        <Button asChild variant="outline" size="sm">
          <Link to="/admin">
            <ArrowLeft className="h-4 w-4" />
            Back to board
          </Link>
        </Button>
      }
    >
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Admin actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-3">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground uppercase tracking-wide">
              Update status
            </label>
            <Select
              value={status ?? "null"}
              onValueChange={(v) => {
                setCurrentStatus(v as RequestStatus);
                toast.success(`Status updated to ${STATUS_LABELS[v as RequestStatus]}`);
              }}
            >
              <SelectTrigger className="w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" onClick={() => toast.info("Note added (mock)")}>
            Add internal note
          </Button>
        </CardContent>
      </Card>
      <RequestDetail {...request} />
    </PortalShell>
  );
}
