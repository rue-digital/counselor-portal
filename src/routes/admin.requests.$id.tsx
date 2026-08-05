import { createFileRoute, Link } from "@tanstack/react-router";
import { PortalShell } from "@/components/portal-shell";
import { Button } from "@/components/ui/button";
import { RequestDetail } from "@/components/request-detail";
import { ArrowLeft, Plus } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Request, getRequest } from "@/lib/auth";
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
  const [ticket, setTicket] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getTicket() {
      const request = await getRequest({ data: { id } });
      if (!request) {
        toast.error("Failed to load request. Contact site administrator.");
        setLoading(false);
        return;
      }
      setTicket(request);
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
      <RequestDetail role="Admin" request={ticket} />
    </PortalShell>
  );
}
