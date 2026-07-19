import { createFileRoute, Link } from "@tanstack/react-router";
import { PortalShell } from "@/components/portal-shell";
import { Button } from "@/components/ui/button";
import { RequestDetail } from "@/components/request-detail";
import { ArrowLeft } from "lucide-react";
import { Ticket, getRequest } from "@/lib/auth";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { requireRole } from "@/lib/route-auth";

export const Route = createFileRoute("/requests/$id")({
  beforeLoad: async () => {
    const profile = await requireRole("counselor");
    return { profile };
  },
  head: () => ({ meta: [{ title: "Request — Counselor Portal" }] }),
  component: RequestDetailPage,
  notFoundComponent: () => (
    <PortalShell role="counselor" title="Request not found">
      <p className="text-muted-foreground">
        We couldn't find that request.{" "}
        <Link to="/requests" className="underline">
          Back to my requests
        </Link>
      </p>
    </PortalShell>
  ),
});

function RequestDetailPage() {
  const { profile } = Route.useRouteContext();
  const { id } = Route.useParams();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getTicket() {
      const request = await getRequest(id);
      console.log(request);

      if (!request) {
        toast.error("Failed to load request. Contact site administrator.");
        return;
      }
      setTicket(request);
      setLoading(false);
    }

    void getTicket();
  }, []);

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
      subtitle="View the full request and its status history."
      actions={
        <Button asChild variant="outline" size="sm">
          <Link to="/requests">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
      }
    >
      <RequestDetail {...ticket} />
    </PortalShell>
  );
}
