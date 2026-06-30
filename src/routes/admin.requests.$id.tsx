import { createFileRoute, Link, notFound } from "@tanstack/react-router";
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
import {
  mockRequests,
  STATUSES,
  STATUS_LABELS,
  type RequestStatus,
} from "@/lib/mock-data";
import { RequestDetail } from "@/components/request-detail";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/requests/$id")({
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
  const { id } = Route.useParams();
  const found = mockRequests.find((r) => r.id === id);
  if (!found) throw notFound();

  const [status, setStatus] = useState<RequestStatus>(found.status);
  const request = { ...found, status };

  return (
    <PortalShell
      role="admin"
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
              value={status}
              onValueChange={(v) => {
                setStatus(v as RequestStatus);
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
      <RequestDetail request={request} />
    </PortalShell>
  );
}