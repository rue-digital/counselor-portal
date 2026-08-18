import { createFileRoute, Link } from "@tanstack/react-router";
import { PortalShell, StatusBadge } from "@/components/portal-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/mock-data";
import { FilePlus2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Ticket } from "@/lib/types";
import { getAllRequests } from "@/lib/tickets.server";
import { requireRole } from "@/lib/route-auth";

export const Route = createFileRoute("/requests/")({
  beforeLoad: async () => {
    const profile = await requireRole("counselor");
    return { profile };
  },
  head: () => ({ meta: [{ title: "My Requests — Counselor Portal" }] }),
  component: MyRequestsPage,
});

function MyRequestsPage() {
  const { profile } = Route.useRouteContext();
  const [q, setQ] = useState("");
  const [tickets, setTickets] = useState<Ticket[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      const requests = await getAllRequests();
      setTickets(requests);
      setLoading(false);
    }

    void loadDashboard();
  }, []);

  if (loading) {
    return (
      <PortalShell role={profile.role} title="My Requests">
        <div className="text-sm text-muted-foreground">Loading requests...</div>
      </PortalShell>
    );
  }

  return (
    <PortalShell
      role={profile.role}
      title="My Requests"
      subtitle="All assistance requests you've submitted."
      actions={
        <Button asChild>
          <Link to="/requests/new">
            <FilePlus2 className="h-4 w-4" />
            New request
          </Link>
        </Button>
      }
    >
      <Card className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Request Info</TableHead>
              <TableHead>Family Code</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets?.map((r) => (
              <TableRow
                key={r.id}
                id={r.id}
                className={`cursor-pointer ${r.urgent_need ? "bg-red-50 hover:bg-red-100" : ""}`}
              >
                <TableCell className="font-medium">
                  <Link to="/requests/$id" params={{ id: r.id }} className="block w-full">
                    {r.request_details.length > 45
                      ? r.request_details.slice(0, 45) + "..."
                      : r.request_details}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link to="/requests/$id" params={{ id: r.id }} className="block w-full">
                    {r.family_reference_code}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link to="/requests/$id" params={{ id: r.id }} className="block w-full">
                    {r.assistance_types.join(", ")}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link to="/requests/$id" params={{ id: r.id }} className="block w-full">
                    <StatusBadge status={r.status} />
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <Link to="/requests/$id" params={{ id: r.id }} className="block w-full">
                    {formatDate(r.updated_at)}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {tickets?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                  No requests found.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </Card>
    </PortalShell>
  );
}
