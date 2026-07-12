import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PortalShell } from "@/components/portal-shell";
import { Button } from "@/components/ui/button";
import { mockRequests } from "@/lib/mock-data";
import { RequestDetail } from "@/components/request-detail";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/requests/$id")({
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
  const { id } = Route.useParams();
  const request = mockRequests.find((r) => r.id === id);
  if (!request) throw notFound();

  return (
    <PortalShell
      role="counselor"
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
      <RequestDetail request={request} />
    </PortalShell>
  );
}
